import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.address import Address
from app.models.user import User
from app.schemas.user import (
    AddressCreate,
    AddressRead,
    AddressUpdate,
    UserRead,
    UserUpdateMe,
)
from app.services.user_service import clear_other_default_addresses, promote_latest_address_to_default

router = APIRouter()


def _get_own_address(db: Session, user: User, address_id: uuid.UUID) -> Address:
    address = db.query(Address).filter_by(id=address_id, user_id=user.id).first()
    if address is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found",
        )
    return address


@router.get("/me", response_model=UserRead)
def read_me(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.patch("/me", response_model=UserRead)
def update_me(
    payload: UserUpdateMe,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/me/addresses", response_model=list[AddressRead])
def list_addresses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Address]:
    return (
        db.query(Address)
        .filter_by(user_id=current_user.id)
        .order_by(Address.is_default.desc(), Address.created_at.desc())
        .all()
    )


@router.post("/me/addresses", response_model=AddressRead, status_code=status.HTTP_201_CREATED)
def create_address(
    payload: AddressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Address:
    existing_count = db.query(Address).filter_by(user_id=current_user.id).count()
    address = Address(
        user_id=current_user.id,
        **payload.model_dump(),
    )
    if existing_count == 0:
        address.is_default = True
    db.add(address)
    db.commit()
    db.refresh(address)
    if address.is_default:
        clear_other_default_addresses(db, current_user.id, exclude_id=address.id)
        db.commit()
    return address


@router.patch("/me/addresses/{address_id}", response_model=AddressRead)
def update_address(
    address_id: uuid.UUID,
    payload: AddressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Address:
    address = _get_own_address(db, current_user, address_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(address, field, value)
    db.commit()
    if address.is_default:
        clear_other_default_addresses(db, current_user.id, exclude_id=address.id)
        db.commit()
    db.refresh(address)
    return address


@router.delete("/me/addresses/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_address(
    address_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    address = _get_own_address(db, current_user, address_id)
    was_default = address.is_default
    db.delete(address)
    db.commit()
    if was_default:
        promote_latest_address_to_default(db, current_user.id)

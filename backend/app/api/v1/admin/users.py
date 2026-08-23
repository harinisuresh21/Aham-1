import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_admin
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.user import (
    AdminRoleUpdate,
    AdminStatusUpdate,
    AdminUserUpdate,
    UserRead,
)
from app.services.user_service import assert_not_last_active_admin

router = APIRouter(dependencies=[Depends(require_admin)])


def _get_user_or_404(db: Session, user_id: uuid.UUID) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.get("", response_model=list[UserRead])
def list_users(
    q: str | None = Query(default=None, max_length=255),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
) -> list[User]:
    query = db.query(User)
    if q:
        pattern = f"%{q}%"
        query = query.filter(User.full_name.ilike(pattern) | User.email.ilike(pattern))
    return (
        query.order_by(User.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{user_id}", response_model=UserRead)
def get_user(
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
) -> User:
    return _get_user_or_404(db, user_id)


@router.patch("/{user_id}", response_model=UserRead)
def update_user(
    user_id: uuid.UUID,
    payload: AdminUserUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
) -> User:
    user = _get_user_or_404(db, user_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


@router.patch("/{user_id}/role", response_model=UserRead)
def change_role(
    user_id: uuid.UUID,
    payload: AdminRoleUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
) -> User:
    user = _get_user_or_404(db, user_id)
    if user.role == UserRole.ADMIN and payload.role != UserRole.ADMIN:
        assert_not_last_active_admin(db, user)
    user.role = payload.role
    db.commit()
    db.refresh(user)
    return user


@router.patch("/{user_id}/status", response_model=UserRead)
def change_status(
    user_id: uuid.UUID,
    payload: AdminStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
) -> User:
    user = _get_user_or_404(db, user_id)
    if user.is_active and not payload.is_active:
        assert_not_last_active_admin(db, user)
    user.is_active = payload.is_active
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
) -> None:
    user = _get_user_or_404(db, user_id)
    assert_not_last_active_admin(db, user)
    db.delete(user)
    db.commit()

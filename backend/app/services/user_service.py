import uuid

from sqlalchemy.orm import Session

from app.models.address import Address
from app.models.user import User, UserRole


class LastActiveAdminError(Exception):
    def __init__(self) -> None:
        super().__init__("Cannot remove the last active administrator")
        self.message = "Cannot remove the last active administrator"


def is_active_admin(user: User) -> bool:
    return user.role == UserRole.ADMIN and user.is_active


def assert_not_last_active_admin(db: Session, target: User) -> None:
    if not is_active_admin(target):
        return
    other_admins = (
        db.query(User)
        .filter(
            User.role == UserRole.ADMIN,
            User.is_active.is_(True),
            User.id != target.id,
        )
        .count()
    )
    if other_admins == 0:
        raise LastActiveAdminError()


def clear_other_default_addresses(db: Session, user_id: uuid.UUID, exclude_id: uuid.UUID | None = None) -> None:
    stmt = db.query(Address).filter(Address.user_id == user_id, Address.is_default.is_(True))
    if exclude_id is not None:
        stmt = stmt.filter(Address.id != exclude_id)
    stmt.update({"is_default": False}, synchronize_session=False)


def promote_latest_address_to_default(db: Session, user_id: uuid.UUID) -> Address | None:
    latest = (
        db.query(Address)
        .filter_by(user_id=user_id)
        .order_by(Address.created_at.desc())
        .first()
    )
    if latest is None:
        return None
    latest.is_default = True
    db.commit()
    db.refresh(latest)
    return latest

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.user import User, UserRole


def get_or_create_user(db: Session, decoded_token: dict) -> User:
    firebase_uid = decoded_token.get("uid")
    if not firebase_uid:
        raise ValueError("Firebase token does not contain a uid claim")

    existing = db.query(User).filter_by(firebase_uid=firebase_uid).first()
    if existing is not None:
        return existing

    email = decoded_token.get("email")
    if not email:
        raise ValueError("Firebase token does not contain an email claim")

    user = User(
        firebase_uid=firebase_uid,
        email=email,
        full_name=(decoded_token.get("name") or None),
        phone=(decoded_token.get("phone_number") or None),
        role=UserRole.USER,
        is_active=True,
    )
    user.full_name = user.full_name[:255] if user.full_name else None
    user.phone = user.phone[:20] if user.phone else None

    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        existing = db.query(User).filter_by(firebase_uid=firebase_uid).first()
        if existing is None:
            raise ValueError("Could not create user from Firebase token")
        return existing
    db.refresh(user)
    return user

"""Tests for auth dependencies (Phase 2)."""
from unittest.mock import MagicMock, patch

import pytest
from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient

from app.api.deps import get_current_user, require_admin
from app.core.security import TokenVerificationError
from app.db.session import get_db
from app.models.user import User, UserRole
from app.services.auth_service import get_or_create_user


def make_user(
    role: UserRole = UserRole.USER,
    is_active: bool = True,
    firebase_uid: str = "uid-123",
) -> User:
    user = User(
        firebase_uid=firebase_uid,
        email="user@example.com",
        full_name="Test User",
        role=role,
        is_active=is_active,
    )
    return user


def fake_db(user: User | None) -> MagicMock:
    db = MagicMock()
    db.query.return_value.filter_by.return_value.first.return_value = user
    return db


class TestGetCurrentUser:
    def test_missing_credentials_raises_401(self) -> None:
        with pytest.raises(Exception) as exc_info:
            get_current_user(credentials=None, db=fake_db(None))
        assert exc_info.value.status_code == 401

    def test_invalid_token_raises_401(self) -> None:
        with patch("app.api.deps.verify_firebase_token") as mock_verify:
            mock_verify.side_effect = TokenVerificationError("expired")
            creds = MagicMock()
            with pytest.raises(Exception) as exc_info:
                get_current_user(credentials=creds, db=fake_db(None))
        assert exc_info.value.status_code == 401

    def test_inactive_user_raises_403(self) -> None:
        inactive = make_user(is_active=False)
        with patch("app.api.deps.verify_firebase_token") as mock_verify:
            mock_verify.return_value = {"uid": "uid-123", "email": "user@example.com"}
            creds = MagicMock()
            with pytest.raises(Exception) as exc_info:
                get_current_user(credentials=creds, db=fake_db(inactive))
        assert exc_info.value.status_code == 403

    def test_valid_token_returns_active_user(self) -> None:
        active = make_user()
        with patch("app.api.deps.verify_firebase_token") as mock_verify:
            mock_verify.return_value = {"uid": "uid-123", "email": "user@example.com"}
            creds = MagicMock()
            result = get_current_user(credentials=creds, db=fake_db(active))
        assert result is active


class TestRequireAdmin:
    def test_non_admin_raises_403(self) -> None:
        plain_user = make_user(role=UserRole.USER)
        with pytest.raises(Exception) as exc_info:
            require_admin(current_user=plain_user)
        assert exc_info.value.status_code == 403

    def test_admin_passes_through(self) -> None:
        admin = make_user(role=UserRole.ADMIN)
        assert require_admin(current_user=admin) is admin


class TestGetOrCreateUser:
    def test_creates_new_user_from_token(self) -> None:
        db = fake_db(None)
        user = get_or_create_user(
            db, {"uid": "new-uid", "email": "new@example.com", "name": "New User"}
        )
        assert user.firebase_uid == "new-uid"
        assert user.email == "new@example.com"
        assert user.full_name == "New User"
        assert user.role == UserRole.USER
        assert user.is_active is True
        db.add.assert_called_once()
        db.commit.assert_called_once()

    def test_returns_existing_user_without_commit(self) -> None:
        existing = make_user(firebase_uid="existing-uid")
        db = fake_db(existing)
        user = get_or_create_user(db, {"uid": "existing-uid", "email": "user@example.com"})
        assert user is existing
        db.add.assert_not_called()
        db.commit.assert_not_called()

    def test_missing_uid_raises_value_error(self) -> None:
        db = fake_db(None)
        with pytest.raises(ValueError):
            get_or_create_user(db, {"email": "x@example.com"})

    def test_missing_email_raises_value_error(self) -> None:
        db = fake_db(None)
        with pytest.raises(ValueError):
            get_or_create_user(db, {"uid": "uid-no-email"})

    def test_integrity_race_returns_existing(self) -> None:
        from sqlalchemy.exc import IntegrityError

        existing = make_user(firebase_uid="race-uid")
        db = fake_db(None)
        db.commit.side_effect = IntegrityError("dup", None, None)
        db.query.return_value.filter_by.return_value.first.side_effect = [None, existing]
        user = get_or_create_user(db, {"uid": "race-uid", "email": "race@example.com"})
        assert user is existing
        db.rollback.assert_called_once()


class TestEndpointIntegration:
    def _build_app(self, db: MagicMock) -> FastAPI:
        test_app = FastAPI()

        @test_app.get("/me")
        def me(current_user: User = Depends(get_current_user)) -> dict:
            return {"firebase_uid": current_user.firebase_uid}

        @test_app.get("/admin-only")
        def admin_only(admin: User = Depends(require_admin)) -> dict:
            return {"role": admin.role.value}

        test_app.dependency_overrides[get_db] = lambda: db
        return test_app

    def test_full_chain_with_bearer_header(self, monkeypatch) -> None:
        user = make_user()
        monkeypatch.setattr(
            "app.api.deps.verify_firebase_token",
            lambda token: {"uid": "uid-123", "email": "user@example.com"},
        )
        client = TestClient(self._build_app(fake_db(user)))
        response = client.get("/me", headers={"Authorization": "Bearer fake-token"})
        assert response.status_code == 200
        assert response.json() == {"firebase_uid": "uid-123"}

    def test_admin_route_rejects_plain_user(self, monkeypatch) -> None:
        user = make_user(role=UserRole.USER)
        monkeypatch.setattr(
            "app.api.deps.verify_firebase_token",
            lambda token: {"uid": "uid-123", "email": "user@example.com"},
        )
        client = TestClient(self._build_app(fake_db(user)))
        response = client.get("/admin-only", headers={"Authorization": "Bearer fake-token"})
        assert response.status_code == 403
        assert response.json()["detail"] == "Admin privileges required"

    def test_missing_header_returns_401(self) -> None:
        client = TestClient(self._build_app(fake_db(None)))
        response = client.get("/me")
        assert response.status_code == 401

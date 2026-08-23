"""Tests for /api/v1/admin/users APIs (Phase 3)."""
import uuid

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.deps import get_current_user, require_admin
from app.api.v1.router import api_router
from app.db.session import get_db
from app.models.user import User, UserRole
from tests.fakes import FakeDB, fixed_timestamp


def make_user(**overrides) -> User:
    defaults = dict(
        id=uuid.uuid4(),
        firebase_uid=f"uid-{uuid.uuid4().hex[:8]}",
        email="user@example.com",
        full_name="Test User",
        phone="555-0100",
        role=UserRole.USER,
        is_active=True,
        created_at=fixed_timestamp(),
        updated_at=fixed_timestamp(),
    )
    defaults.update(overrides)
    return User(**defaults)


def client_for(
    db: FakeDB,
    admin: User | None = None,
    plain_user: User | None = None,
) -> TestClient:
    app = FastAPI()
    app.include_router(api_router, prefix="/api/v1")
    app.dependency_overrides[get_db] = lambda: db
    if admin is not None:
        app.dependency_overrides[require_admin] = lambda: admin
    if plain_user is not None:
        app.dependency_overrides[get_current_user] = lambda: plain_user
    return TestClient(app)


@pytest.fixture
def admin() -> User:
    return make_user(role=UserRole.ADMIN)


@pytest.fixture
def target() -> User:
    return make_user(email="target@example.com")


class TestAdminGate:
    def test_plain_user_gets_403(self) -> None:
        db = FakeDB()
        response = client_for(db, plain_user=make_user()).get("/api/v1/admin/users")
        assert response.status_code == 403
        assert response.json()["detail"] == "Admin privileges required"


class TestListAndGet:
    def test_list_users(self, admin: User, target: User) -> None:
        db = FakeDB()
        db.enqueue(User, [target])
        response = client_for(db, admin).get("/api/v1/admin/users?skip=0&limit=50&q=target")
        assert response.status_code == 200
        body = response.json()
        assert len(body) == 1
        assert body[0]["email"] == "target@example.com"

    def test_get_user_by_id(self, admin: User, target: User) -> None:
        db = FakeDB()
        db.enqueue(User, target)
        response = client_for(db, admin).get(f"/api/v1/admin/users/{target.id}")
        assert response.status_code == 200
        assert response.json()["id"] == str(target.id)

    def test_get_missing_user_404(self, admin: User) -> None:
        db = FakeDB()
        response = client_for(db, admin).get(f"/api/v1/admin/users/{uuid.uuid4()}")
        assert response.status_code == 404

    def test_invalid_uuid_422(self, admin: User) -> None:
        response = client_for(FakeDB(), admin).get("/api/v1/admin/users/not-a-uuid")
        assert response.status_code == 422


class TestUpdateProfileFields:
    def test_patch_updates_name_and_phone(self, admin: User, target: User) -> None:
        db = FakeDB()
        db.enqueue(User, target)
        response = client_for(db, admin).patch(
            f"/api/v1/admin/users/{target.id}", json={"full_name": "Renamed", "phone": "111"}
        )
        assert response.status_code == 200
        assert target.full_name == "Renamed"
        assert target.phone == "111"

    def test_patch_cannot_set_role_or_status_here(self, admin: User, target: User) -> None:
        db = FakeDB()
        db.enqueue(User, target)
        response = client_for(db, admin).patch(
            f"/api/v1/admin/users/{target.id}", json={"role": "ADMIN", "is_active": False}
        )
        assert response.status_code == 200
        assert target.role == UserRole.USER
        assert target.is_active is True


class TestLastActiveAdminSafeguard:
    def test_demote_last_active_admin_conflict(self, admin: User) -> None:
        sole_admin = make_user(role=UserRole.ADMIN)
        db = FakeDB()
        db.enqueue(User, sole_admin)
        db.enqueue(User, 0)
        response = client_for(db, admin).patch(
            f"/api/v1/admin/users/{sole_admin.id}/role", json={"role": "USER"}
        )
        assert response.status_code == 409
        assert sole_admin.role == UserRole.ADMIN

    def test_demote_admin_with_backup_succeeds(self, admin: User) -> None:
        target_admin = make_user(role=UserRole.ADMIN)
        db = FakeDB()
        db.enqueue(User, target_admin)
        db.enqueue(User, 1)
        response = client_for(db, admin).patch(
            f"/api/v1/admin/users/{target_admin.id}/role", json={"role": "USER"}
        )
        assert response.status_code == 200
        assert target_admin.role == UserRole.USER

    def test_deactivate_last_active_admin_conflict(self, admin: User) -> None:
        sole_admin = make_user(role=UserRole.ADMIN)
        db = FakeDB()
        db.enqueue(User, sole_admin)
        db.enqueue(User, 0)
        response = client_for(db, admin).patch(
            f"/api/v1/admin/users/{sole_admin.id}/status", json={"is_active": False}
        )
        assert response.status_code == 409
        assert sole_admin.is_active is True

    def test_deactivate_regular_user_allowed(self, admin: User, target: User) -> None:
        db = FakeDB()
        db.enqueue(User, target)
        response = client_for(db, admin).patch(
            f"/api/v1/admin/users/{target.id}/status", json={"is_active": False}
        )
        assert response.status_code == 200
        assert target.is_active is False

    def test_delete_last_active_admin_conflict(self, admin: User) -> None:
        sole_admin = make_user(role=UserRole.ADMIN)
        db = FakeDB()
        db.enqueue(User, sole_admin)
        db.enqueue(User, 0)
        response = client_for(db, admin).delete(f"/api/v1/admin/users/{sole_admin.id}")
        assert response.status_code == 409
        assert db.deleted == []

    def test_delete_regular_user_allowed(self, admin: User, target: User) -> None:
        db = FakeDB()
        db.enqueue(User, target)
        response = client_for(db, admin).delete(f"/api/v1/admin/users/{target.id}")
        assert response.status_code == 204
        assert db.deleted == [target]

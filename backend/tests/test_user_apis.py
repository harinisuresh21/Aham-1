"""Tests for /api/v1/users/me and address APIs (Phase 3)."""
import uuid

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.deps import get_current_user
from app.api.v1.router import api_router
from app.db.session import get_db
from app.models.address import Address
from app.models.user import User, UserRole
from tests.fakes import FakeDB, fixed_timestamp


def make_user(**overrides) -> User:
    defaults = dict(
        id=uuid.uuid4(),
        firebase_uid="uid-123",
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


def make_address(user_id: uuid.UUID, **overrides) -> Address:
    defaults = dict(
        id=uuid.uuid4(),
        user_id=user_id,
        full_name="Test User",
        phone="555-0100",
        address_line_1="1 Main St",
        city="Springfield",
        state="IL",
        postal_code="62701",
        country="USA",
        is_default=False,
        created_at=fixed_timestamp(),
        updated_at=fixed_timestamp(),
    )
    defaults.update(overrides)
    return Address(**defaults)


def client_for(db: FakeDB, user: User) -> TestClient:
    app = FastAPI()
    app.include_router(api_router, prefix="/api/v1")
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_current_user] = lambda: user
    return TestClient(app)


@pytest.fixture
def user() -> User:
    return make_user()


class TestProfileEndpoints:
    def test_get_me_returns_profile(self, user: User) -> None:
        response = client_for(FakeDB(), user).get("/api/v1/users/me")
        assert response.status_code == 200
        body = response.json()
        assert body["email"] == "user@example.com"
        assert body["role"] == "USER"
        assert body["full_name"] == "Test User"

    def test_patch_me_updates_name_and_phone(self, user: User) -> None:
        db = FakeDB()
        response = client_for(db, user).patch(
            "/api/v1/users/me", json={"full_name": "New Name", "phone": "999"}
        )
        assert response.status_code == 200
        assert user.full_name == "New Name"
        assert user.phone == "999"
        assert db.commit_count == 1

    def test_patch_me_cannot_change_email_or_role(self, user: User) -> None:
        response = client_for(FakeDB(), user).patch(
            "/api/v1/users/me", json={"email": "hax@evil.com", "role": "ADMIN"}
        )
        assert response.status_code == 200
        assert user.email == "user@example.com"
        assert user.role == UserRole.USER


class TestAddressCreation:
    def test_first_address_becomes_default_automatically(self, user: User) -> None:
        db = FakeDB()
        db.enqueue(Address, 0)
        payload = {"full_name": "T", "phone": "1", "address_line_1": "A", "city": "C", "state": "S", "postal_code": "P", "country": "X"}
        response = client_for(db, user).post("/api/v1/users/me/addresses", json=payload)
        assert response.status_code == 201
        created = db.added[0]
        assert created.is_default is True
        assert created.user_id == user.id

    def test_second_address_not_default_by_default(self, user: User) -> None:
        db = FakeDB()
        db.enqueue(Address, 1)
        payload = {"full_name": "T", "phone": "1", "address_line_1": "A", "city": "C", "state": "S", "postal_code": "P", "country": "X"}
        response = client_for(db, user).post("/api/v1/users/me/addresses", json=payload)
        assert response.status_code == 201
        assert db.added[0].is_default is False

    def test_explicit_default_clears_previous(self, user: User) -> None:
        db = FakeDB()
        db.enqueue(Address, 2)
        payload = {"full_name": "T", "phone": "1", "address_line_1": "A", "city": "C", "state": "S", "postal_code": "P", "country": "X", "is_default": True}
        response = client_for(db, user).post("/api/v1/users/me/addresses", json=payload)
        assert response.status_code == 201
        assert db.updates == [{"is_default": False}]

    def test_validation_rejects_missing_fields(self, user: User) -> None:
        response = client_for(FakeDB(), user).post(
            "/api/v1/users/me/addresses", json={"full_name": "T"}
        )
        assert response.status_code == 422


class TestAddressUpdateAndDelete:
    def test_set_existing_address_as_default(self, user: User) -> None:
        db = FakeDB()
        addr = make_address(user.id)
        db.enqueue(Address, addr)
        response = client_for(db, user).patch(
            f"/api/v1/users/me/addresses/{addr.id}", json={"is_default": True}
        )
        assert response.status_code == 200
        assert addr.is_default is True

    def test_cannot_touch_other_users_address(self, user: User) -> None:
        db = FakeDB()
        db.enqueue(Address, None)
        other_id = uuid.uuid4()
        response = client_for(db, user).patch(
            f"/api/v1/users/me/addresses/{other_id}", json={"city": "X"}
        )
        assert response.status_code == 404

    def test_delete_returns_204_and_promotes_next_default(self, user: User) -> None:
        db = FakeDB()
        default_addr = make_address(user.id, is_default=True)
        survivor = make_address(user.id)
        db.enqueue(Address, default_addr)
        db.enqueue(Address, survivor)
        response = client_for(db, user).delete(f"/api/v1/users/me/addresses/{default_addr.id}")
        assert response.status_code == 204
        assert db.deleted == [default_addr]
        assert survivor.is_default is True

    def test_delete_last_address_no_promotion_crash(self, user: User) -> None:
        db = FakeDB()
        addr = make_address(user.id, is_default=True)
        db.enqueue(Address, addr)
        db.enqueue(Address, None)
        response = client_for(db, user).delete(f"/api/v1/users/me/addresses/{addr.id}")
        assert response.status_code == 204

    def test_list_addresses_returns_items(self, user: User) -> None:
        db = FakeDB()
        db.enqueue(Address, [make_address(user.id)])
        response = client_for(db, user).get("/api/v1/users/me/addresses")
        assert response.status_code == 200
        assert len(response.json()) == 1

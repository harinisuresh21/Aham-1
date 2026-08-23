from fastapi import APIRouter

from app.api.v1 import users
from app.api.v1.admin import users as admin_users

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(admin_users.router, prefix="/admin/users", tags=["admin: users"])

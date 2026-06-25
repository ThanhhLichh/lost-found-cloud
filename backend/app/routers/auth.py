from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import (
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    TokenResponse,
    RefreshTokenRequest,
)
from app.services.auth_service import (
    login,
    register,
    refresh_token,
)
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    register(db, request)

    return MessageResponse(
        message="Register successfully",
    )


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login_user(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    return login(
        db,
        request,
    )

@router.post(
    "/refresh",
    response_model=TokenResponse,
)
def refresh_access_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    return refresh_token(
        db,
        request,
    )
@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(get_current_active_user),
):
    return current_user


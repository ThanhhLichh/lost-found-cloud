from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.services.user_service import (
    get_user_by_email,
    get_user_by_phone,
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
)
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
)


def register(
    db: Session,
    request: RegisterRequest,
) -> User:

    existing_email = get_user_by_email(
        db,
        request.email,
    )

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists",
        )

    existing_phone = get_user_by_phone(
        db,
        request.phone,
    )

    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already exists",
        )

    user = User(
        full_name=request.full_name,
        email=request.email,
        phone=request.phone,
        password_hash=hash_password(request.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def login(
    db: Session,
    request: LoginRequest,
) -> TokenResponse:

    user = get_user_by_email(
        db,
        request.email,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(
        request.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        user.id,
    )

    refresh_token = create_refresh_token(
        user.id,
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.schemas.user import (
    ChangePasswordRequest,
    UpdateProfileRequest,
    UpdateAvatarRequest,
    UserResponse,
)
from app.services.user_service import change_password, update_profile, update_avatar

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.put(
    "/me",
    response_model=UserResponse,
)
def update_my_profile(
    request: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return update_profile(
        db,
        current_user,
        request.full_name,
        request.email,
        request.phone,
    )

@router.put(
    "/me/password",
    response_model=UserResponse,
)
def change_my_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return change_password(
        db,
        current_user,
        request.old_password,
        request.new_password,
    )

@router.put(
    "/me/avatar",
    response_model=UserResponse,
)
def update_my_avatar(
    request: UpdateAvatarRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    
    return update_avatar(
        db,
        current_user,
        request.avatar_url,
    )

@router.delete("/me/avatar", response_model=UserResponse)
def delete_my_avatar(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    current_user.avatar_url = None
    db.commit()
    db.refresh(current_user)
    return current_user
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.enums import UserStatus
from app.db.session import get_db
from app.dependencies.auth import get_current_admin
from app.models.user import User
from app.schemas.admin import DashboardResponse
from app.schemas.post import PostResponse
from app.services.admin_service import (
    approve_post,
    get_dashboard,
    get_pending_posts,
    reject_post,
)
from app.models.post import Post
from app.schemas.auth import MessageResponse

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get(
    "/posts/pending",
    response_model=list[PostResponse],
)
def get_pending_post_list(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return get_pending_posts(db)


@router.put(
    "/posts/{post_id}/approve",
    response_model=PostResponse,
)
def approve_existing_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return approve_post(db, post_id)


@router.put(
    "/posts/{post_id}/reject",
    response_model=PostResponse,
)
def reject_existing_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return reject_post(db, post_id)

@router.delete(
    "/posts/{post_id}",
    response_model=MessageResponse,
)
def admin_delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    post = db.get(Post, post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    db.delete(post)
    db.commit()

    return MessageResponse(
        message="Delete post successfully",
    )


@router.get(
    "/dashboard",
    response_model=DashboardResponse,
)
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return get_dashboard(db)

@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = db.scalars(
        select(User).order_by(User.created_at.desc())
    ).all()

    return result


@router.patch("/users/{user_id}/lock")
def lock_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot lock yourself",
        )

    user.status = UserStatus.LOCKED

    db.commit()
    db.refresh(user)

    return user


@router.patch("/users/{user_id}/unlock")
def unlock_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.status = UserStatus.ACTIVE

    db.commit()
    db.refresh(user)

    return user
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

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


@router.get(
    "/dashboard",
    response_model=DashboardResponse,
)
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return get_dashboard(db)
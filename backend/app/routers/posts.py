from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user
from app.models.enums import ApprovalStatus, PostType
from app.models.user import User
from app.schemas.auth import MessageResponse
from app.schemas.post import PostCreateRequest, PostResponse, PostUpdateRequest
from app.services.post_service import (
    create_post,
    delete_post,
    get_post_by_id,
    get_posts,
    update_post,
)

router = APIRouter(
    prefix="/posts",
    tags=["Posts"],
)


@router.post(
    "",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_post(
    request: PostCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return create_post(
        db,
        request,
        current_user,
    )


@router.get(
    "",
    response_model=list[PostResponse],
)
def get_post_feed(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=50),
    keyword: str | None = None,
    post_type: PostType | None = None,
    db: Session = Depends(get_db),
):
    return get_posts(
        db,
        page=page,
        limit=limit,
        keyword=keyword,
        post_type=post_type,
        approval_status=ApprovalStatus.APPROVED,
    )


@router.get(
    "/{post_id}",
    response_model=PostResponse,
)
def get_post_detail(
    post_id: int,
    db: Session = Depends(get_db),
):
    return get_post_by_id(
        db,
        post_id,
    )


@router.put(
    "/{post_id}",
    response_model=PostResponse,
)
def update_existing_post(
    post_id: int,
    request: PostUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return update_post(
        db,
        post_id,
        request,
        current_user,
    )


@router.delete(
    "/{post_id}",
    response_model=MessageResponse,
)
def delete_existing_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    delete_post(
        db,
        post_id,
        current_user,
    )

    return MessageResponse(
        message="Delete post successfully",
    )
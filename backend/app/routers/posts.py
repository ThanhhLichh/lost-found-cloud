from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user
from app.models.enums import ApprovalStatus, PostType
from app.models.post import Post
from app.models.user import User
from app.schemas.auth import MessageResponse
from app.schemas.post import (
    PostCreateRequest,
    PostResponse,
    PostUpdateRequest,
    PostStatusUpdateRequest,
)
from app.services.post_service import (
    create_post,
    delete_post,
    get_post_by_id,
    get_posts,
    update_post,
    update_post_status,
)
from sqlalchemy import func

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
    "/me",
    response_model=list[PostResponse],
)
def get_my_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return db.scalars(
        select(Post)
        .options(
            joinedload(Post.user),
            joinedload(Post.category),
        )
        .where(Post.user_id == current_user.id)
        .order_by(Post.created_at.desc())
    ).all()


@router.patch(
    "/{post_id}/status",
    response_model=PostResponse,
)
def update_existing_post_status(
    post_id: int,
    request: PostStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return update_post_status(
        db,
        post_id,
        request.status,
        current_user,
    )

@router.get("/ranking")
def get_post_ranking(
    db: Session = Depends(get_db),
):
    result = db.execute(
        select(
            User.id,
            User.full_name,
            func.count(Post.id).label("returned_count"),
        )
        .join(Post, Post.user_id == User.id)
        .where(Post.status == "RETURNED")
        .group_by(User.id, User.full_name)
        .order_by(func.count(Post.id).desc())
        .limit(5)
    ).all()

    return [
        {
            "user_id": row.id,
            "full_name": row.full_name,
            "returned_count": row.returned_count,
        }
        for row in result
    ]

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
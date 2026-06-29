from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from sqlalchemy.orm import joinedload
from app.models.category import Category
from app.models.enums import ApprovalStatus, FoundPostStatus, LostPostStatus, PostType
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreateRequest, PostUpdateRequest


def validate_post_status(
    post_type: PostType,
    post_status: str,
) -> None:
    if post_type == PostType.LOST:
        allowed_statuses = [item.value for item in LostPostStatus]
    else:
        allowed_statuses = [item.value for item in FoundPostStatus]

    if post_status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post status for this post type",
        )


def ensure_category_exists(
    db: Session,
    category_id: int,
) -> None:
    category = db.get(Category, category_id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )


def create_post(
    db: Session,
    request: PostCreateRequest,
    current_user: User,
) -> Post:
    ensure_category_exists(db, request.category_id)
    validate_post_status(request.type, request.status)

    post = Post(
        user_id=current_user.id,
        title=request.title,
        type=request.type,
        category_id=request.category_id,
        description=request.description,
        location=request.location,
        event_date=request.event_date,
        image_url=request.image_url,
        contact_email=request.contact_email,
        contact_phone=request.contact_phone,
        status=request.status,
        approval_status=ApprovalStatus.PENDING,
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return post


def get_posts(
    db: Session,
    page: int = 1,
    limit: int = 10,
    keyword: str | None = None,
    post_type: PostType | None = None,
    category_id: int | None = None,
    approval_status: ApprovalStatus | None = ApprovalStatus.APPROVED,
) -> list[Post]:
    query = select(Post).options(
        joinedload(Post.user),
        joinedload(Post.category),
    )

    if approval_status:
        query = query.where(Post.approval_status == approval_status)

    if post_type:
        query = query.where(Post.type == post_type)

    if category_id:
        query = query.where(Post.category_id == category_id)

    if keyword:
        keyword_like = f"%{keyword}%"
        query = query.where(
            Post.title.like(keyword_like)
            | Post.description.like(keyword_like)
            | Post.location.like(keyword_like)
        )

    offset = (page - 1) * limit

    query = query.order_by(Post.created_at.desc()).offset(offset).limit(limit)

    return list(db.scalars(query).all())


def get_post_by_id(
    db: Session,
    post_id: int,
) -> Post:
    post = db.scalar(
        select(Post)
        .options(
            joinedload(Post.user),
            joinedload(Post.category),
        )
        .where(Post.id == post_id)
    )

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    return post


def update_post(
    db: Session,
    post_id: int,
    request: PostUpdateRequest,
    current_user: User,
) -> Post:
    post = get_post_by_id(db, post_id)

    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own posts",
        )

    update_data = request.model_dump(exclude_unset=True)

    if "category_id" in update_data:
        ensure_category_exists(db, update_data["category_id"])

    if "status" in update_data:
        validate_post_status(post.type, update_data["status"])

    for field, value in update_data.items():
        setattr(post, field, value)

    post.approval_status = ApprovalStatus.PENDING

    db.commit()
    db.refresh(post)

    return post

def update_post_status(
    db: Session,
    post_id: int,
    new_status: str,
    current_user: User,
) -> Post:
    post = get_post_by_id(db, post_id)

    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own posts",
        )

    validate_post_status(post.type, new_status)

    post.status = new_status

    db.commit()
    db.refresh(post)

    return post

def delete_post(
    db: Session,
    post_id: int,
    current_user: User,
) -> None:
    post = get_post_by_id(db, post_id)

    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own posts",
        )

    db.delete(post)
    db.commit()
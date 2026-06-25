from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.enums import ApprovalStatus, PostType
from app.models.post import Post
from app.models.user import User
from app.schemas.admin import DashboardResponse


def get_pending_posts(
    db: Session,
) -> list[Post]:
    return list(
        db.scalars(
            select(Post)
            .where(Post.approval_status == ApprovalStatus.PENDING)
            .order_by(Post.created_at.desc())
        ).all()
    )


def approve_post(
    db: Session,
    post_id: int,
) -> Post:
    post = db.get(Post, post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    post.approval_status = ApprovalStatus.APPROVED

    db.commit()
    db.refresh(post)

    return post


def reject_post(
    db: Session,
    post_id: int,
) -> Post:
    post = db.get(Post, post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    post.approval_status = ApprovalStatus.REJECTED

    db.commit()
    db.refresh(post)

    return post


def get_dashboard(
    db: Session,
) -> DashboardResponse:
    total_users = db.scalar(select(func.count(User.id))) or 0
    total_posts = db.scalar(select(func.count(Post.id))) or 0

    pending_posts = db.scalar(
        select(func.count(Post.id)).where(
            Post.approval_status == ApprovalStatus.PENDING
        )
    ) or 0

    approved_posts = db.scalar(
        select(func.count(Post.id)).where(
            Post.approval_status == ApprovalStatus.APPROVED
        )
    ) or 0

    rejected_posts = db.scalar(
        select(func.count(Post.id)).where(
            Post.approval_status == ApprovalStatus.REJECTED
        )
    ) or 0

    lost_posts = db.scalar(
        select(func.count(Post.id)).where(Post.type == PostType.LOST)
    ) or 0

    found_posts = db.scalar(
        select(func.count(Post.id)).where(Post.type == PostType.FOUND)
    ) or 0

    return DashboardResponse(
        total_users=total_users,
        total_posts=total_posts,
        pending_posts=pending_posts,
        approved_posts=approved_posts,
        rejected_posts=rejected_posts,
        lost_posts=lost_posts,
        found_posts=found_posts,
    )
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import CategoryCreateRequest, CategoryUpdateRequest


def get_all_categories(
    db: Session,
) -> list[Category]:
    return list(
        db.scalars(
            select(Category).order_by(Category.name.asc())
        ).all()
    )


def get_category_by_id(
    db: Session,
    category_id: int,
) -> Category | None:
    return db.get(Category, category_id)


def get_category_by_name(
    db: Session,
    name: str,
) -> Category | None:
    return db.scalar(
        select(Category).where(Category.name == name)
    )


def create_category(
    db: Session,
    request: CategoryCreateRequest,
) -> Category:
    existing_category = get_category_by_name(
        db,
        request.name,
    )

    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category already exists",
        )

    category = Category(
        name=request.name,
    )

    db.add(category)
    db.commit()
    db.refresh(category)

    return category


def update_category(
    db: Session,
    category_id: int,
    request: CategoryUpdateRequest,
) -> Category:
    category = get_category_by_id(db, category_id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    existing_category = get_category_by_name(
        db,
        request.name,
    )

    if existing_category and existing_category.id != category_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category already exists",
        )

    category.name = request.name

    db.commit()
    db.refresh(category)

    return category
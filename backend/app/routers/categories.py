from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.category import (
    CategoryCreateRequest,
    CategoryResponse,
    CategoryUpdateRequest,
)
from app.services.category_service import (
    create_category,
    get_all_categories,
    update_category,
)

router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)


@router.get(
    "",
    response_model=list[CategoryResponse],
)
def get_categories(
    db: Session = Depends(get_db),
):
    return get_all_categories(db)


@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_category(
    request: CategoryCreateRequest,
    db: Session = Depends(get_db),
):
    return create_category(db, request)


@router.put(
    "/{category_id}",
    response_model=CategoryResponse,
)
def update_existing_category(
    category_id: int,
    request: CategoryUpdateRequest,
    db: Session = Depends(get_db),
):
    return update_category(
        db,
        category_id,
        request,
    )
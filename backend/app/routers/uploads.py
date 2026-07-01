from fastapi import APIRouter, Depends, File, UploadFile

from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.services.storage_service import upload_image_to_gcs

router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"],
)


@router.post("/image")
def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
):
    image_url = upload_image_to_gcs(file, folder="posts")

    return {
        "image_url": image_url,
    }

@router.post("/avatar")
def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
):
    image_url = upload_image_to_gcs(file, folder="avatars")
    return {
        "image_url": image_url,
    }
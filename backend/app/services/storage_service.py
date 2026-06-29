import os
from uuid import uuid4

from fastapi import UploadFile
from google.cloud import storage

from app.core.config import settings


def upload_image_to_gcs(file: UploadFile) -> str:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.GOOGLE_APPLICATION_CREDENTIALS

    client = storage.Client()
    bucket = client.bucket(settings.GCP_BUCKET_NAME)

    file_extension = file.filename.split(".")[-1]
    file_name = f"posts/{uuid4()}.{file_extension}"

    blob = bucket.blob(file_name)
    blob.upload_from_file(
        file.file,
        content_type=file.content_type,
    )

    return f"https://storage.googleapis.com/{settings.GCP_BUCKET_NAME}/{file_name}"
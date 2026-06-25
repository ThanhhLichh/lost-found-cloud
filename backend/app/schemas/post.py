from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.enums import ApprovalStatus, PostType


class PostCreateRequest(BaseModel):
    title: str = Field(min_length=2, max_length=255)
    type: PostType
    category_id: int
    description: str = Field(min_length=5)
    location: str = Field(min_length=2, max_length=255)
    event_date: date
    image_url: str | None = None
    contact_email: EmailStr
    contact_phone: str = Field(min_length=10, max_length=20)
    status: str = Field(min_length=2, max_length=50)


class PostUpdateRequest(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=255)
    category_id: int | None = None
    description: str | None = Field(default=None, min_length=5)
    location: str | None = Field(default=None, min_length=2, max_length=255)
    event_date: date | None = None
    image_url: str | None = None
    contact_email: EmailStr | None = None
    contact_phone: str | None = Field(default=None, min_length=10, max_length=20)
    status: str | None = Field(default=None, min_length=2, max_length=50)


class PostResponse(BaseModel):
    id: int
    user_id: int
    category_id: int
    title: str
    type: PostType
    description: str
    location: str
    event_date: date
    image_url: str | None
    contact_email: str
    contact_phone: str
    status: str
    approval_status: ApprovalStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
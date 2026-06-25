from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import UserRole, UserStatus


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    role: UserRole
    status: UserStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
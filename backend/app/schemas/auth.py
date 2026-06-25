from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    full_name: str = Field(
        min_length=2,
        max_length=100,
    )

    email: EmailStr

    phone: str = Field(
        min_length=10,
        max_length=20,
    )

    password: str = Field(
        min_length=6,
        max_length=100,
    )


class LoginRequest(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=6,
        max_length=100,
    )


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class MessageResponse(BaseModel):
    message: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str
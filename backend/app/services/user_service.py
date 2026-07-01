from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User
from fastapi import HTTPException, status
from app.core.security import hash_password, verify_password

def get_user_by_id(
    db: Session,
    user_id: int,
) -> User | None:
    return db.scalar(
        select(User).where(User.id == user_id)
    )


def get_user_by_email(
    db: Session,
    email: str,
) -> User | None:
    return db.scalar(
        select(User).where(User.email == email)
    )


def get_user_by_phone(
    db: Session,
    phone: str,
) -> User | None:
    return db.scalar(
        select(User).where(User.phone == phone)
    )

def update_profile(
    db: Session,
    current_user: User,
    full_name: str,
    email: str,
    phone: str,
) -> User:
    email_user = get_user_by_email(db, email)

    if email_user and email_user.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists",
        )

    phone_user = get_user_by_phone(db, phone)

    if phone_user and phone_user.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already exists",
        )

    current_user.full_name = full_name
    current_user.email = email
    current_user.phone = phone

    db.commit()
    db.refresh(current_user)

    return current_user

def change_password(
    db: Session,
    current_user: User,
    old_password: str,
    new_password: str,
) -> User:
    if not verify_password(old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mật khẩu hiện tại không đúng",
        )

    current_user.password_hash = hash_password(new_password)

    db.commit()
    db.refresh(current_user)

    return current_user

def update_avatar(
    db: Session,
    current_user: User,
    avatar_url: str,
) -> User:
    current_user.avatar_url = avatar_url
    db.commit()
    db.refresh(current_user)
    return current_user
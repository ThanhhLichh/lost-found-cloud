from enum import Enum


class UserRole(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class UserStatus(str, Enum):
    ACTIVE = "ACTIVE"
    LOCKED = "LOCKED"

class PostType(str, Enum):
    LOST = "LOST"
    FOUND = "FOUND"


class LostPostStatus(str, Enum):
    SEARCHING = "SEARCHING"
    FOUND = "FOUND"


class FoundPostStatus(str, Enum):
    WAITING_OWNER = "WAITING_OWNER"
    RETURNED = "RETURNED"


class ApprovalStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
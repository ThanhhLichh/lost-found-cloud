from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_users: int
    total_posts: int
    pending_posts: int
    approved_posts: int
    rejected_posts: int
    lost_posts: int
    found_posts: int
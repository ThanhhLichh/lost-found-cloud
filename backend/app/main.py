from fastapi import FastAPI

from app.db.database import Base, engine
from app.routers.auth import router as auth_router

# Import tất cả model
from app.models.user import User


app = FastAPI(
    title="Lost & Found API",
    version="1.0.0",
)

app.include_router(auth_router)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Lost & Found API is running"}
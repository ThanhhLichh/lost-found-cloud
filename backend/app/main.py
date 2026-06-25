from fastapi import FastAPI

from app.db.database import Base, engine

# Import tất cả model
from app.models.user import User

app = FastAPI(
    title="Lost & Found API",
    version="1.0.0",
)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Lost & Found API is running"}
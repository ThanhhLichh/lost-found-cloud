from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine
from app.db import base
from app.routers.auth import router as auth_router
from app.routers.categories import router as categories_router
from app.routers.posts import router as posts_router
from app.routers.admin import router as admin_router
from app.routers.users import router as users_router

app = FastAPI(
    title="Lost & Found API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(categories_router)
app.include_router(posts_router)
app.include_router(admin_router)
app.include_router(users_router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Lost & Found API is running"}
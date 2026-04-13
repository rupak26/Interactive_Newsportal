from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from config import initialize_database
from fastapi.middleware.cors import CORSMiddleware

initialize_database()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

from routers import router as news_router
app.include_router(news_router)
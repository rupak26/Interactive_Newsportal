import os
import psycopg
from fastapi import APIRouter

configs = APIRouter()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_0cWKmoPMh1xU@ep-floral-base-ampb7pig-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")

def get_cursor():
    try:
        conn = psycopg.connect(DATABASE_URL)
        cursor = conn.cursor()
        return conn, cursor
    except Exception as e:
        print("Database connection failed:", e)
        return None, None

def initialize_database() -> None:
    try:
        conn, cursor = get_cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS news_posts (
                id           SERIAL PRIMARY KEY,
                title        VARCHAR(255) NOT NULL,
                author       VARCHAR(255) NOT NULL,
                text_content TEXT,
                youtube_link TEXT,
                photos       JSONB DEFAULT '[]',
                videos       JSONB DEFAULT '[]',
                audios       JSONB DEFAULT '[]',
                created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        conn.commit()
        conn.close()
        print("Database initialized successfully")
    except Exception as e:
        print("Database initialization failed:", e)
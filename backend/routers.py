# routers/news.py
import os
import shutil
import uuid
import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.datastructures import UploadFile

from config import get_cursor

router = APIRouter(prefix="/api/news", tags=["News"])

BASE_UPLOAD_DIR = "uploads"
UPLOAD_DIRS = {
    "photo": os.path.join(BASE_UPLOAD_DIR, "photos"),
    "video": os.path.join(BASE_UPLOAD_DIR, "videos"),
    "audio": os.path.join(BASE_UPLOAD_DIR, "audio"),
}

for dir_path in UPLOAD_DIRS.values():
    Path(dir_path).mkdir(parents=True, exist_ok=True)


def save_file(file: UploadFile, file_type: str) -> str:
    ext = Path(file.filename).suffix.lower()
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    full_path = os.path.join(UPLOAD_DIRS[file_type], unique_filename)
    with open(full_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return full_path


@router.post(
    "/",
    status_code=201,
    openapi_extra={
        "requestBody": {
            "content": {
                "multipart/form-data": {
                    "schema": {
                        "type": "object",
                        "required": ["title", "author"],
                        "properties": {
                            "title":        {"type": "string"},
                            "author":       {"type": "string"},
                            "text_content": {"type": "string"},
                            "youtube_link": {"type": "string"},
                            "photos":       {"type": "array", "items": {"type": "string", "format": "binary"}},
                            "videos":       {"type": "array", "items": {"type": "string", "format": "binary"}},
                            "audios":       {"type": "array", "items": {"type": "string", "format": "binary"}},
                        }
                    }
                }
            }
        }
    }
)
async def create_news(request: Request):  # ✅ Raw request — Pydantic never touches the files
    form = await request.form()

    title        = form.get("title")
    author       = form.get("author")
    text_content = form.get("text_content")
    youtube_link = form.get("youtube_link")

    if not title:
        raise HTTPException(status_code=400, detail="title is required")
    if not author:
        raise HTTPException(status_code=400, detail="author is required")
    if youtube_link and "youtube.com" not in youtube_link and "youtu.be" not in youtube_link:
        raise HTTPException(status_code=400, detail="Invalid YouTube link")

    # ✅ Filter out empty strings — only keep real UploadFile objects
    photos = [f for f in form.getlist("photos") if isinstance(f, UploadFile) and f.filename]
    videos = [f for f in form.getlist("videos") if isinstance(f, UploadFile) and f.filename]
    audios = [f for f in form.getlist("audios") if isinstance(f, UploadFile) and f.filename]

    saved_photos = []
    saved_videos = []
    saved_audios = []

    try:
        for photo in photos:
            saved_photos.append(save_file(photo, "photo"))
            print(f"✅ Photo saved: {saved_photos[-1]}")

        for video in videos:
            saved_videos.append(save_file(video, "video"))
            print(f"✅ Video saved: {saved_videos[-1]}")

        for audio in audios:
            saved_audios.append(save_file(audio, "audio"))
            print(f"✅ Audio saved: {saved_audios[-1]}")

    except Exception as e:
        for path in saved_photos + saved_videos + saved_audios:
            if os.path.exists(path):
                os.remove(path)
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

    conn, cursor = get_cursor()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor.execute("""
            INSERT INTO news_posts 
                (title, author, text_content, youtube_link, photos, videos, audios)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id, title, author, text_content, youtube_link, photos, videos, audios, created_at
        """, (
            title, author, text_content, youtube_link,
            json.dumps(saved_photos),
            json.dumps(saved_videos),
            json.dumps(saved_audios),
        ))

        row = cursor.fetchone()
        conn.commit()

        return {
            "message": "News post created successfully",
            "data": {
                "id":           row[0],
                "title":        row[1],
                "author":       row[2],
                "text_content": row[3],
                "youtube_link": row[4],
                # ✅ JSONB comes back as a list already — no need for json.loads()
                "photos":       row[5] if row[5] is not None else [],
                "videos":       row[6] if row[6] is not None else [],
                "audios":       row[7] if row[7] is not None else [],
                "created_at":   row[8],
            }
        }
    except Exception as e:
        conn.rollback()
        for path in saved_photos + saved_videos + saved_audios:
            if os.path.exists(path):
                os.remove(path)
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()



@router.get("/")
async def get_all_news():
    conn, cursor = get_cursor()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor.execute("""
            SELECT id, title, author, text_content, youtube_link, photos, videos, audios, created_at, updated_at
            FROM news_posts
            ORDER BY created_at DESC
        """)

        rows = cursor.fetchall()

        return {
            "total": len(rows),
            "data": [
                {
                    "id":           row[0],
                    "title":        row[1],
                    "author":       row[2],
                    "text_content": row[3],
                    "youtube_link": row[4],
                    "photos":       row[5] if row[5] is not None else [],
                    "videos":       row[6] if row[6] is not None else [],
                    "audios":       row[7] if row[7] is not None else [],
                    "created_at":   row[8],
                    "updated_at":   row[9],
                }
                for row in rows
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()


@router.get("/{news_id}")
async def get_single_news(news_id: int):
    conn, cursor = get_cursor()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor.execute("""
            SELECT id, title, author, text_content, youtube_link, photos, videos, audios, created_at, updated_at
            FROM news_posts
            WHERE id = %s
        """, (news_id,))

        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail=f"News post with id {news_id} not found")

        return {
            "id":           row[0],
            "title":        row[1],
            "author":       row[2],
            "text_content": row[3],
            "youtube_link": row[4],
            "photos":       row[5] if row[5] is not None else [],
            "videos":       row[6] if row[6] is not None else [],
            "audios":       row[7] if row[7] is not None else [],
            "created_at":   row[8],
            "updated_at":   row[9],
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()


@router.put(
    "/{news_id}",
    openapi_extra={
        "requestBody": {
            "content": {
                "multipart/form-data": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "title":        {"type": "string"},
                            "author":       {"type": "string"},
                            "text_content": {"type": "string"},
                            "youtube_link": {"type": "string"},
                            "photos":       {"type": "array", "items": {"type": "string", "format": "binary"}},
                            "videos":       {"type": "array", "items": {"type": "string", "format": "binary"}},
                            "audios":       {"type": "array", "items": {"type": "string", "format": "binary"}},
                        }
                    }
                }
            }
        }
    }
)
async def update_news(news_id: int, request: Request):
    conn, cursor = get_cursor()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    # ── Check post exists
    try:
        cursor.execute("SELECT id, photos, videos, audios FROM news_posts WHERE id = %s", (news_id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail=f"News post {news_id} not found")

        # Existing file paths from DB
        existing_photos = existing[1] if existing[1] is not None else []
        existing_videos = existing[2] if existing[2] is not None else []
        existing_audios = existing[3] if existing[3] is not None else []

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    form = await request.form()

    # ── Text fields — keep existing value if not provided
    title        = form.get("title")
    author       = form.get("author")
    text_content = form.get("text_content")
    youtube_link = form.get("youtube_link")

    if youtube_link and "youtube.com" not in youtube_link and "youtu.be" not in youtube_link:
        raise HTTPException(status_code=400, detail="Invalid YouTube link")

    # ── New uploaded files
    new_photos = [f for f in form.getlist("photos") if isinstance(f, UploadFile) and f.filename]
    new_videos = [f for f in form.getlist("videos") if isinstance(f, UploadFile) and f.filename]
    new_audios = [f for f in form.getlist("audios") if isinstance(f, UploadFile) and f.filename]

    saved_photos = []
    saved_videos = []
    saved_audios = []

    try:
        for photo in new_photos:
            saved_photos.append(save_file(photo, "photo"))

        for video in new_videos:
            saved_videos.append(save_file(video, "video"))

        for audio in new_audios:
            saved_audios.append(save_file(audio, "audio"))

    except Exception as e:
        for path in saved_photos + saved_videos + saved_audios:
            if os.path.exists(path):
                os.remove(path)
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

    # ── Merge new files with existing files
    merged_photos = existing_photos + saved_photos
    merged_videos = existing_videos + saved_videos
    merged_audios = existing_audios + saved_audios

    try:
        cursor.execute("""
            UPDATE news_posts SET
                title        = COALESCE(%s, title),
                author       = COALESCE(%s, author),
                text_content = COALESCE(%s, text_content),
                youtube_link = COALESCE(%s, youtube_link),
                photos       = %s,
                videos       = %s,
                audios       = %s,
                updated_at   = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id, title, author, text_content, youtube_link, photos, videos, audios, created_at, updated_at
        """, (
            title,
            author,
            text_content,
            youtube_link,
            json.dumps(merged_photos),
            json.dumps(merged_videos),
            json.dumps(merged_audios),
            news_id,
        ))

        row = cursor.fetchone()
        conn.commit()

        return {
            "message": "News post updated successfully",
            "data": {
                "id":           row[0],
                "title":        row[1],
                "author":       row[2],
                "text_content": row[3],
                "youtube_link": row[4],
                "photos":       row[5] if row[5] is not None else [],
                "videos":       row[6] if row[6] is not None else [],
                "audios":       row[7] if row[7] is not None else [],
                "created_at":   row[8],
                "updated_at":   row[9],
            }
        }

    except Exception as e:
        conn.rollback()
        for path in saved_photos + saved_videos + saved_audios:
            if os.path.exists(path):
                os.remove(path)
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()
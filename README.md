# Interactive Teaching Platform — Vercel Deployment Guide

## Project Structure
```
Interactive-main/
├── frontend/        ← Deploy this as Project #1 on Vercel
│   ├── vercel.json
│   ├── .env.example
│   └── src/
└── backend/         ← Deploy this as Project #2 on Vercel
    ├── vercel.json
    ├── main.py
    └── requirements.txt
```

---

## Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/interactive-platform.git
git push -u origin main
```

---

## Step 2 — Deploy the BACKEND first

1. Go to https://vercel.com → **Add New Project**
2. Import your GitHub repo
3. **Set Root Directory** → `backend`
4. Framework Preset → **Other**
5. Add **Environment Variable**:
   - Key: `DATABASE_URL`
   - Value: `postgresql://user:password@host:5432/teaching_platform`
   
   > **Free PostgreSQL options:**
   > - [Neon](https://neon.tech) — free, serverless Postgres (recommended)
   > - [Supabase](https://supabase.com) — free tier
   > - [Railway](https://railway.app) — free $5 credit

6. Click **Deploy**
7. Copy your backend URL → e.g. `https://interactive-backend.vercel.app`

---

## Step 3 — Deploy the FRONTEND

1. Go to https://vercel.com → **Add New Project**
2. Import the SAME GitHub repo
3. **Set Root Directory** → `frontend`
4. Framework Preset → **Vite**
5. Add **Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://interactive-backend.vercel.app`  ← your backend URL from Step 2
6. Click **Deploy**
7. Your frontend will be live at `https://interactive-frontend.vercel.app`

---

## Step 4 — Set up Free PostgreSQL with Neon (Recommended)

1. Go to https://neon.tech → Sign up free
2. Create a new project → **Create Database**
3. Copy the connection string (looks like):
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Paste this as `DATABASE_URL` in your Vercel backend environment variables
5. Redeploy the backend — it will auto-create tables and seed data on startup

---

## Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt
export DATABASE_URL=postgresql://postgres:12345678@localhost:5433/teaching_platform
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local → VITE_API_URL=http://localhost:8000
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/articles` | List all articles |
| GET | `/articles/{id}` | Get article by ID |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI |


# 🌐 CineVerse 3D — Vercel Deployment Guide

**Architects**: Kombaiya & Ashik Chandru  
**Platform**: Vercel (React 18 SPA + Serverless Express REST API)

---

## 🚀 Method 1: Deploy via GitHub (Recommended — 100% Automated)

This is the standard, easiest way to host CineVerse 3D on Vercel with automatic SSL and zero-downtime updates:

### Step 1: Push your Code to GitHub
Open your terminal in the project directory:
```bash
git add .
git commit -m "Configure CineVerse 3D for Vercel deployment"
git push origin main
```

### Step 2: Import into Vercel
1. Log into your [Vercel Dashboard](https://vercel.com/).
2. Click **"Add New..."** ➜ **"Project"**.
3. Under **Import Git Repository**, select your repository.
4. Vercel will **automatically detect `vercel.json`**:
   - **Framework Preset**: `Vite` (or `Other`)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `cd frontend && npm install && npm run build` (pre-configured)
   - **Output Directory**: `frontend/dist` (pre-configured)
5. Click **"Deploy"**!
6. In about 45 seconds, your website is live with a free `.vercel.app` domain (e.g., `https://cineverse-3d.vercel.app`)!

---

## ⚡ Method 2: Deploy using Vercel CLI (Direct from Terminal)

If you have Vercel CLI installed on your computer:

```bash
# 1. Install Vercel CLI globally (if not installed)
npm install -g vercel

# 2. Run deployment from the project folder
vercel

# 3. For production release:
vercel --prod
```

---

## ⚙️ Configuration Files Included for Vercel

1. **`vercel.json`** (Root of Project):
   - Tells Vercel how to compile the frontend (`cd frontend && npm install && npm run build`).
   - Routes `/api/*` to the serverless function in `api/index.js`.
   - Directs all other client routes (`/*`) to `/index.html` (SPA routing with zero 404s).
2. **`api/index.js`**:
   - Serverless entry point running the full Express.js backend on Vercel's serverless edge.
3. **`frontend/vercel.json`**:
   - Pre-configured in case you choose to set Vercel's Root Directory directly to `frontend`.
4. **`frontend/src/services/mockData.js` & `api.js`**:
   - Embedded zero-failure fallback: Even if a serverless cold-start happens or an API route is delayed, the full 15 blockbusters, 3D seat inspection, trailers, and booking system load instantly.

---

## 🔐 Admin Console Login on Vercel
- **Portal**: Click **Admin Portal** on top navbar.
- **Username**: `admin@cinema`
- **Password**: `kombaiya ashik`

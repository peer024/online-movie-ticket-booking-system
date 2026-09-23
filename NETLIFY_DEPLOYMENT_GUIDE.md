# 🌐 CineVerse 3D — Netlify Deployment Guide

**Architects**: Kombaiya & Ashik Chandru  
**Platform**: Netlify (Frontend + Serverless Backend API)

---

## 🚀 Method 1: Git-Connected Deployment (Recommended — 100% Automated)

This method connects your GitHub repository to Netlify. Whenever you push changes, Netlify automatically rebuilds and deploys the entire application.

### Step 1: Push Code to GitHub
Open PowerShell or your terminal in the project directory:
```bash
git init
git add .
git commit -m "CineVerse 3D — Full Stack Release with Netlify Support"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Step 2: Connect to Netlify
1. Log into [Netlify Dashboard](https://app.netlify.com/).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Choose **GitHub** and select your repository.
4. Netlify will automatically read the included `netlify.toml` configuration:
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Functions directory**: `netlify/functions`
5. Click **"Deploy site"**.
6. Within 1–2 minutes, your website is live with a custom URL (e.g. `https://cineverse-3d.netlify.app`)!

---

## ⚡ Method 2: Netlify Drop (Instant 1-Minute Drag & Drop)

If you want your website live on the internet immediately without setting up Git:

1. Build the production bundle (already built):
   ```bash
   npm run build
   ```
2. Open your browser and go to: **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
3. Open File Explorer to your project folder:
   `C:\Users\peerm\.gemini\antigravity\scratch\online-movie-ticket-booking-system\frontend`
4. Drag and drop the **`dist`** folder directly into the Netlify Drop box in your browser.
5. In just 5 seconds, Netlify will upload and launch your site live with an active HTTPS link!

---

## ⚙️ Configuration Files Included

We have pre-configured everything needed for Netlify:

1. **`netlify.toml`** (Root of project):
   - Sets build commands and publish directories.
   - Redirects `/api/*` to the Netlify Serverless Function (`netlify/functions/api.js`).
   - Configures Single Page Application fallback (`/* -> /index.html`) so refreshing the page never shows a 404 error.
2. **`netlify/functions/api.js`**:
   - Wraps the Express backend with `serverless-http` to run as AWS Lambda / Netlify serverless functions.
   - Features writable `/tmp` fallback for `db.json` with in-memory caching.
3. **`frontend/public/_redirects`**:
   - Ensures fallback routing works even on manual drag-and-drop deployments.
4. **`frontend/src/services/api.js`**:
   - Dynamically calls same-origin `/api` in production (zero CORS issues).

---

## 🔐 Admin Console Login on Netlify
- **Portal**: Click **Admin Portal** on top navbar.
- **Username**: `admin@cinema`
- **Password**: `kombaiya ashik`

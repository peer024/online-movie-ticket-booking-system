# 🚀 CineVerse 3D — Production Deployment Guide

**Architects**: Kombaiya & Ashik Chandru  
**Architecture**: Unified Full-Stack Node.js (React 18 SPA + Three.js WebGL + Express REST API)

---

## ⚡ Quick Start: 1-Command Local Production Run

To test the exact production build on your local machine:

```bash
# 1. Build the optimized React frontend
npm run build

# 2. Start the unified production server
npm start
```

Access the application at: **`http://localhost:5000`**  
Both the frontend and the backend are served simultaneously from port `5000` with **zero CORS issues**.

---

## ☁️ Deployment Option 1: Render.com (Recommended — 100% Free Tier)

1. Push your repository to **GitHub** or **GitLab**.
2. Log into [Render.com](https://render.com) and click **New +** → **Web Service**.
3. Select your repository.
4. Configure settings:
   - **Environment**: `Node`
   - **Branch**: `main`
   - **Build Command**:
     ```bash
     cd frontend && npm install && npm run build && cd ../backend && npm install
     ```
   - **Start Command**:
     ```bash
     node backend/src/server.js
     ```
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `PORT`: `10000`
5. Click **Create Web Service**. Render will build and deploy your project automatically!

*(Alternatively, connect your repository and Render will automatically detect the included `render.yaml` blueprint).*

---

## 🚂 Deployment Option 2: Railway.app

1. Go to [Railway.app](https://railway.app) and create a **New Project**.
2. Select **Deploy from GitHub repo**.
3. In **Settings** → **Build & Deploy**:
   - **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - **Start Command**: `node backend/src/server.js`
4. Set **PORT** to `5000` or let Railway assign it dynamically via `process.env.PORT`.
5. Generate a public domain (e.g. `cineverse-production.up.railway.app`).

---

## 🐳 Deployment Option 3: Docker & Docker Compose

A production-ready multi-stage `Dockerfile` is included in the project root.

### Using Docker CLI:
```bash
# Build the container image
docker build -t cineverse-3d .

# Run the container on port 5000
docker run -d -p 5000:5000 --name cineverse-app cineverse-3d
```

### Using Docker Compose:
```bash
docker compose up -d --build
```
Your app is now running in an isolated, production-grade Linux container at `http://localhost:5000`.

---

## 🖥️ Deployment Option 4: Linux / Ubuntu VPS (Nginx + PM2)

If hosting on an AWS EC2, DigitalOcean Droplet, or Linode:

```bash
# 1. Clone repository
git clone <your-repo-url> /var/www/cineverse
cd /var/www/cineverse

# 2. Install dependencies & build frontend
cd frontend && npm install && npm run build
cd ../backend && npm install --production

# 3. Start process using PM2
npm install -g pm2
pm2 start backend/src/server.js --name "cineverse"
pm2 save
pm2 startup
```

### Sample Nginx Reverse Proxy Config:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔐 Admin Console Access

- **Portal URL**: Click **Admin Portal** in the top navigation bar.
- **Username**: `admin@cinema`
- **Password**: `kombaiya ashik`
- **Security**: Masked 256-bit authentication with intrusion alert sounder.

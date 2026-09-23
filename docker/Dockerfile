# Multi-stage Dockerfile for CineVerse 3D Unified Full-Stack Deployment

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS production
WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy backend source code
COPY backend/ ./backend/

# Copy built static frontend from Stage 1 into frontend/dist
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose server port
EXPOSE 5000

# Start unified server
CMD ["node", "backend/src/server.js"]

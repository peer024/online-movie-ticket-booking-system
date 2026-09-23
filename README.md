# 🎬 CineVerse 3D — Next-Gen Online Movie Ticket Booking & Management System

> An ultra-premium, WebGL-accelerated 3D cinema booking engine featuring interactive IMAX auditorium exploration, first-person seat POV views, dynamic sound synthesis, gourmet concessions, encrypted holographic passes, and theater management analytics.

---

## 🌟 Key Highlights

### 1. 🪐 3D WebGL Cinema Auditorium (Three.js)
- **Curved IMAX Silver Screen**: Modeled with realistic procedural projection shaders, ambient reflection bouncing onto seats, and glowing laser emitter bezel.
- **Tiered Multi-level Seating**: VIP Recliners with armrests & headrests (Rows A-B), Executive Club (Rows C-E), and Classic Standard (Rows F-H).
- **Seat POV Camera Mode**: Sit directly in your selected seat before booking! The camera smoothly glides into the seat cushion at eye level looking up at the curved screen.
- **Hybrid View Toggle**: Effortlessly swap between 3D Spatial WebGL and rapid 2D Grid Plan modes.

### 2. 🎵 Web Audio API Sound Synthesizer
- Built-in zero-dependency synthetic audio engine.
- High-tech interactive sounds: button hovers, tactile clicks, musical seat selection chords, cinema projector hum, booking fanfare, and master mute toggle.

### 3. 🍿 Gourmet Cinema Concessions (F&B)
- Interactive food & drink store with item steppers and real-time bill calculations (Truffle Popcorn, Loaded Nachos, Electric Blue Mocktails, Combos).

### 4. 🎟️ Holographic Digital Pass with Live QR Code
- Cyberpunk VIP pass with dynamic SVG QR code, reference numbers, screen/gate assignment, and one-click print/download support.

### 5. ⚡ Checkout & Payment Simulator
- Instant 256-bit encrypted simulated checkout.
- Working promo codes:
  - `CINE50` (50% Cyber discount, max ₹150)
  - `BLOCKBUSTER` (Flat ₹100 voucher)
  - `VIPFREE` (₹200 Premiere credit)
- Multiple payment modes (UPI / Quantum QR & CyberCard Titanium Chip).

### 6. 📊 Central Command (Admin / Operator Portal)
- Live metrics: Total Gross Revenue, Tickets Sold, Occupancy Rate %, Active Screenings.
- Revenue breakdown by movie title bar chart.
- Movie Catalog Manager (Add/Delete movies, posters, YouTube trailer embeds).
- Theatrical Showtime Scheduler (Set halls, showtimes, VIP/Exec/Classic prices).
- Real-time Screen Occupancy Matrix with live seat inspection & cancellation refunds.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm

### 1. Start the Backend API (Port 5000)
```bash
cd backend
npm start
```
*Backend runs on `http://localhost:5000`*

### 2. Start the Frontend (Port 5173)
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🏗️ Tech Stack
- **Frontend**: React 18, Vite, Three.js, Tailwind CSS, Lucide React, Canvas Confetti
- **Audio**: Web Audio API (native browser synthesis)
- **Backend**: Node.js, Express, CORS, Persistent JSON Database
- **Platform**: Cross-platform (Windows / macOS / Linux)

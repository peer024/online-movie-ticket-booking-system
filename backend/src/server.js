import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { readDb, writeDb } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Netlify Functions path normalizer
app.use((req, res, next) => {
  if (req.url.startsWith('/.netlify/functions/api')) {
    req.url = req.url.replace('/.netlify/functions/api', '') || '/';
    if (!req.url.startsWith('/api')) {
      req.url = '/api' + req.url;
    }
  }
  next();
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', system: 'CineVerse 3D Engine', timestamp: new Date() });
});

// ======================== MOVIES ========================

app.get('/api/movies', (req, res) => {
  const db = readDb();
  res.json(db.movies);
});

app.get('/api/movies/:id', (req, res) => {
  const db = readDb();
  const movie = db.movies.find(m => m.id === req.params.id);
  if (!movie) return res.status(404).json({ error: 'Movie not found' });
  res.json(movie);
});

app.post('/api/movies', (req, res) => {
  const db = readDb();
  const newMovie = {
    id: `mov-${Date.now()}`,
    title: req.body.title || 'Untitled Feature',
    tagline: req.body.tagline || 'Experience the cinema of the future.',
    genre: req.body.genre || ['Action', 'Sci-Fi'],
    duration: req.body.duration || '2h 15m',
    rating: Number(req.body.rating) || 8.5,
    votes: req.body.votes || '10K',
    certificate: req.body.certificate || 'UA',
    language: req.body.language || 'English / Tamil',
    formats: req.body.formats || ['IMAX 3D', 'Dolby Atmos'],
    releaseDate: req.body.releaseDate || new Date().toISOString().split('T')[0],
    director: req.body.director || 'Director Unknown',
    cast: req.body.cast || ['Lead Actor', 'Lead Actress'],
    synopsis: req.body.synopsis || 'An extraordinary theatrical spectacle.',
    posterUrl: req.body.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    bannerUrl: req.body.bannerUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: req.body.trailerUrl || 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: Boolean(req.body.featured),
    accentColor: req.body.accentColor || '#00f5ff'
  };

  db.movies.unshift(newMovie);
  writeDb(db);
  res.status(201).json(newMovie);
});

app.put('/api/movies/:id', (req, res) => {
  const db = readDb();
  const idx = db.movies.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Movie not found' });

  db.movies[idx] = { ...db.movies[idx], ...req.body, id: req.params.id };
  writeDb(db);
  res.json(db.movies[idx]);
});

app.delete('/api/movies/:id', (req, res) => {
  const db = readDb();
  db.movies = db.movies.filter(m => m.id !== req.params.id);
  // Also clean up showtimes
  db.showtimes = db.showtimes.filter(s => s.movieId !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Movie and associated showtimes removed' });
});

// ======================== SHOWTIMES & SEAT MATRIX ========================

app.get('/api/showtimes', (req, res) => {
  const db = readDb();
  const { movieId, date, showType } = req.query;
  let results = db.showtimes;
  if (movieId) {
    results = results.filter(s => s.movieId === movieId);
  }
  if (date) {
    results = results.filter(s => s.date.toLowerCase() === date.toLowerCase());
  }
  if (showType) {
    results = results.filter(s => s.showType?.toLowerCase() === showType.toLowerCase());
  }
  res.json(results);
});

app.get('/api/showtimes/:id', (req, res) => {
  const db = readDb();
  const showtime = db.showtimes.find(s => s.id === req.params.id);
  if (!showtime) return res.status(404).json({ error: 'Showtime not found' });
  res.json(showtime);
});

// Seat layout generator for the 3D Auditorium
// Rows: A-B (VIP Recliners), C-E (Executive), F-H (Classic)
// Columns: 1 to 10
app.get('/api/showtimes/:id/seats', (req, res) => {
  const db = readDb();
  const showtime = db.showtimes.find(s => s.id === req.params.id);
  if (!showtime) return res.status(404).json({ error: 'Showtime not found' });

  const rows = [
    { row: 'A', tier: 'VIP', price: showtime.priceTiers?.vip || 450, totalCols: 8 },
    { row: 'B', tier: 'VIP', price: showtime.priceTiers?.vip || 450, totalCols: 8 },
    { row: 'C', tier: 'Executive', price: showtime.priceTiers?.executive || 320, totalCols: 10 },
    { row: 'D', tier: 'Executive', price: showtime.priceTiers?.executive || 320, totalCols: 10 },
    { row: 'E', tier: 'Executive', price: showtime.priceTiers?.executive || 320, totalCols: 10 },
    { row: 'F', tier: 'Classic', price: showtime.priceTiers?.classic || 200, totalCols: 10 },
    { row: 'G', tier: 'Classic', price: showtime.priceTiers?.classic || 200, totalCols: 10 },
    { row: 'H', tier: 'Classic', price: showtime.priceTiers?.classic || 200, totalCols: 10 }
  ];

  const booked = new Set(showtime.bookedSeats || []);
  const seats = [];

  rows.forEach((r, rIdx) => {
    for (let c = 1; c <= r.totalCols; c++) {
      const seatCode = `${r.row}${c}`;
      seats.push({
        id: seatCode,
        row: r.row,
        number: c,
        tier: r.tier,
        price: r.price,
        isBooked: booked.has(seatCode),
        rowIndex: rIdx,
        colIndex: c - 1
      });
    }
  });

  res.json({
    showtimeId: showtime.id,
    hall: showtime.hall,
    experience: showtime.experience,
    bookedSeats: showtime.bookedSeats,
    rows,
    seats
  });
});

app.post('/api/showtimes', (req, res) => {
  const db = readDb();
  const newShowtime = {
    id: `st-${Date.now()}`,
    movieId: req.body.movieId,
    date: req.body.date || 'Today',
    time: req.body.time || '07:00 PM',
    hall: req.body.hall || 'Grand IMAX Audi 1',
    experience: req.body.experience || 'IMAX 3D Laser',
    sound: req.body.sound || 'Dolby Atmos 12-Channel',
    priceTiers: {
      vip: Number(req.body.priceVip) || 450,
      executive: Number(req.body.priceExecutive) || 300,
      classic: Number(req.body.priceClassic) || 180
    },
    bookedSeats: []
  };

  db.showtimes.push(newShowtime);
  writeDb(db);
  res.status(201).json(newShowtime);
});

app.delete('/api/showtimes/:id', (req, res) => {
  const db = readDb();
  db.showtimes = db.showtimes.filter(s => s.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Showtime removed' });
});

// ======================== SNACKS & CONCESSIONS ========================

app.get('/api/snacks', (req, res) => {
  const db = readDb();
  res.json(db.snacks);
});

// ======================== BOOKINGS ========================

app.get('/api/bookings', (req, res) => {
  const db = readDb();
  res.json(db.bookings);
});

app.get('/api/bookings/:id', (req, res) => {
  const db = readDb();
  const booking = db.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  res.json(booking);
});

app.post('/api/bookings', (req, res) => {
  const db = readDb();
  const {
    movieId,
    movieTitle,
    showtimeId,
    showType,
    format,
    date,
    time,
    hall,
    seats,
    seatTiers,
    ticketAmount,
    glassesCount,
    glassesAmount,
    snacks,
    snacksAmount,
    discount,
    promoCode,
    totalAmount,
    paymentMethod,
    customerName,
    customerEmail,
    customerPhone
  } = req.body;

  if (!seats || !seats.length) {
    return res.status(400).json({ error: 'Please select at least one seat' });
  }

  // Check showtime and ensure seats are not already booked
  const showtime = db.showtimes.find(s => s.id === showtimeId);
  if (!showtime) {
    return res.status(404).json({ error: 'Showtime not found' });
  }

  const alreadyBooked = seats.filter(s => showtime.bookedSeats.includes(s));
  if (alreadyBooked.length > 0) {
    return res.status(409).json({
      error: `Seats already booked: ${alreadyBooked.join(', ')}. Please choose other seats.`
    });
  }

  // Lock seats
  showtime.bookedSeats.push(...seats);

  const bookingId = `CV-${Math.floor(10000 + Math.random() * 90000)}`;
  const newBooking = {
    id: bookingId,
    movieId,
    movieTitle: movieTitle || 'Feature Presentation',
    showtimeId,
    showType: showType || showtime.showType || '2D',
    format: format || showtime.format || 'Standard',
    date: date || 'Today',
    time: time || '07:00 PM',
    hall: hall || 'Grand IMAX Audi 1',
    seats,
    seatTiers: seatTiers || ['Standard'],
    ticketAmount: Number(ticketAmount) || 0,
    glassesCount: Number(glassesCount) || 0,
    glassesAmount: Number(glassesAmount) || 0,
    snacks: snacks || [],
    snacksAmount: Number(snacksAmount) || 0,
    discount: Number(discount) || 0,
    promoCode: promoCode || '',
    totalAmount: Number(totalAmount) || 0,
    paymentMethod: paymentMethod || 'Instant Hologram Checkout',
    customerName: customerName || 'Valued Cinema Guest',
    customerEmail: customerEmail || 'guest@cineverse.io',
    customerPhone: customerPhone || '+91 98888 77777',
    createdAt: new Date().toISOString(),
    status: 'Confirmed'
  };

  db.bookings.unshift(newBooking);
  writeDb(db);

  res.status(201).json({
    success: true,
    message: 'Booking confirmed successfully!',
    booking: newBooking
  });
});

app.delete('/api/bookings/:id', (req, res) => {
  const db = readDb();
  const bookingIdx = db.bookings.findIndex(b => b.id === req.params.id);
  if (bookingIdx === -1) return res.status(404).json({ error: 'Booking not found' });

  const booking = db.bookings[bookingIdx];
  // Unlock seats from the showtime
  const showtime = db.showtimes.find(s => s.id === booking.showtimeId);
  if (showtime) {
    showtime.bookedSeats = showtime.bookedSeats.filter(s => !booking.seats.includes(s));
  }

  db.bookings.splice(bookingIdx, 1);
  writeDb(db);
  res.json({ success: true, message: `Booking ${req.params.id} cancelled and seats released.` });
});

// ======================== ADMIN ANALYTICS ========================

app.get('/api/admin/stats', (req, res) => {
  const db = readDb();
  const totalRevenue = db.bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalTickets = db.bookings.reduce((sum, b) => sum + (b.seats ? b.seats.length : 0), 0);

  // Total seat capacity vs occupied
  let totalSeatCapacity = 0;
  let totalBookedSeats = 0;
  db.showtimes.forEach(s => {
    totalSeatCapacity += 76; // rows A-H total
    totalBookedSeats += (s.bookedSeats || []).length;
  });

  const occupancyRate = totalSeatCapacity > 0 ? Math.round((totalBookedSeats / totalSeatCapacity) * 100) : 0;

  // Revenue by movie
  const movieRevMap = {};
  db.bookings.forEach(b => {
    const title = b.movieTitle || 'Unknown';
    movieRevMap[title] = (movieRevMap[title] || 0) + (b.totalAmount || 0);
  });

  res.json({
    totalRevenue,
    totalTickets,
    totalBookings: db.bookings.length,
    occupancyRate,
    activeMoviesCount: db.movies.length,
    activeShowtimesCount: db.showtimes.length,
    recentBookings: db.bookings.slice(0, 5),
    revenueByMovie: Object.keys(movieRevMap).map(name => ({ name, revenue: movieRevMap[name] }))
  });
});

// Production Static Serving for Single-Port Deployment
const distPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
  console.log(`📦 Serving optimized frontend from ${distPath}`);
}

export { app };
export default app;

const isMain = process.argv[1] && path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);
if (isMain && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🎬 CineVerse 3D Server running on http://localhost:${PORT}`);
  });
}

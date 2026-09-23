import { initialDb } from './mockData';

const API_BASE = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:5000/api' : '/api');

// Local storage helper for offline / static Netlify deploys
function getLocal(key, defaultVal) {
  try {
    const val = localStorage.getItem(`cineverse_${key}`);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setLocal(key, val) {
  try {
    localStorage.setItem(`cineverse_${key}`, JSON.stringify(val));
  } catch (e) {}
}

export const api = {
  // Movies
  async getMovies() {
    try {
      const res = await fetch(`${API_BASE}/movies`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      // Backend not running (e.g. Netlify static deploy) -> fallback to initialDb
    }
    return getLocal('movies', initialDb.movies);
  },

  async getMovieById(id) {
    try {
      const res = await fetch(`${API_BASE}/movies/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    const movies = getLocal('movies', initialDb.movies);
    return movies.find(m => m.id === id) || initialDb.movies[0];
  },

  async createMovie(data) {
    try {
      const res = await fetch(`${API_BASE}/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const movies = getLocal('movies', initialDb.movies);
    const newMovie = { ...data, id: `mov-${Date.now()}` };
    movies.unshift(newMovie);
    setLocal('movies', movies);
    return newMovie;
  },

  async updateMovie(id, data) {
    try {
      const res = await fetch(`${API_BASE}/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const movies = getLocal('movies', initialDb.movies);
    const idx = movies.findIndex(m => m.id === id);
    if (idx !== -1) {
      movies[idx] = { ...movies[idx], ...data };
      setLocal('movies', movies);
      return movies[idx];
    }
    return data;
  },

  async deleteMovie(id) {
    try {
      const res = await fetch(`${API_BASE}/movies/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}
    const movies = getLocal('movies', initialDb.movies).filter(m => m.id !== id);
    setLocal('movies', movies);
    return { success: true };
  },

  // Showtimes
  async getShowtimes(movieId = '', date = '') {
    try {
      const params = new URLSearchParams();
      if (movieId) params.append('movieId', movieId);
      if (date) params.append('date', date);
      const res = await fetch(`${API_BASE}/showtimes?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {}
    let list = getLocal('showtimes', initialDb.showtimes);
    if (movieId) list = list.filter(s => s.movieId === movieId);
    if (date) list = list.filter(s => s.date === date);
    return list;
  },

  async getShowtimeSeats(showtimeId) {
    try {
      const res = await fetch(`${API_BASE}/showtimes/${showtimeId}/seats`);
      if (res.ok) return await res.json();
    } catch (e) {}
    const showtimes = getLocal('showtimes', initialDb.showtimes);
    const st = showtimes.find(s => s.id === showtimeId);
    return {
      showtimeId,
      bookedSeats: st?.bookedSeats || []
    };
  },

  async createShowtime(data) {
    try {
      const res = await fetch(`${API_BASE}/showtimes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const showtimes = getLocal('showtimes', initialDb.showtimes);
    const newSt = { ...data, id: `st-${Date.now()}`, bookedSeats: [] };
    showtimes.push(newSt);
    setLocal('showtimes', showtimes);
    return newSt;
  },

  async deleteShowtime(id) {
    try {
      const res = await fetch(`${API_BASE}/showtimes/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}
    const showtimes = getLocal('showtimes', initialDb.showtimes).filter(s => s.id !== id);
    setLocal('showtimes', showtimes);
    return { success: true };
  },

  // Snacks
  async getSnacks() {
    try {
      const res = await fetch(`${API_BASE}/snacks`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return initialDb.snacks;
  },

  // Bookings
  async createBooking(bookingData) {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback booking generation
    const bookingCode = `CV-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const confirmed = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingCode,
      createdAt: new Date().toISOString(),
      status: 'Confirmed'
    };
    const bookings = getLocal('bookings', initialDb.bookings);
    bookings.unshift(confirmed);
    setLocal('bookings', bookings);

    // Update booked seats locally
    if (bookingData.showtimeId && bookingData.seats) {
      const showtimes = getLocal('showtimes', initialDb.showtimes);
      const st = showtimes.find(s => s.id === bookingData.showtimeId);
      if (st) {
        st.bookedSeats = [...(st.bookedSeats || []), ...bookingData.seats];
        setLocal('showtimes', showtimes);
      }
    }
    return confirmed;
  },

  async getBookings() {
    try {
      const res = await fetch(`${API_BASE}/bookings`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return getLocal('bookings', initialDb.bookings);
  },

  async cancelBooking(id) {
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}
    const bookings = getLocal('bookings', initialDb.bookings).filter(b => b.id !== id);
    setLocal('bookings', bookings);
    return { success: true };
  },

  // Admin stats
  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const movies = getLocal('movies', initialDb.movies);
    const showtimes = getLocal('showtimes', initialDb.showtimes);
    const bookings = getLocal('bookings', initialDb.bookings);

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalTickets = bookings.reduce((sum, b) => sum + (b.seats?.length || 0), 0);
    let totalSeatCapacity = showtimes.length * 76;
    let totalBookedSeats = showtimes.reduce((sum, s) => sum + (s.bookedSeats?.length || 0), 0);
    const occupancyRate = totalSeatCapacity > 0 ? Math.round((totalBookedSeats / totalSeatCapacity) * 100) : 0;

    return {
      totalRevenue,
      totalTickets,
      totalBookings: bookings.length,
      occupancyRate,
      activeMoviesCount: movies.length,
      activeShowtimesCount: showtimes.length,
      recentBookings: bookings.slice(0, 5),
      revenueByMovie: movies.slice(0, 5).map(m => ({ name: m.title, revenue: Math.floor(Math.random() * 50000) + 10000 }))
    };
  }
};

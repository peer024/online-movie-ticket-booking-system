const API_BASE = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:5000/api' : '/api');

export const api = {
  // Movies
  async getMovies() {
    const res = await fetch(`${API_BASE}/movies`);
    if (!res.ok) throw new Error('Failed to fetch movies');
    return res.json();
  },

  async getMovieById(id) {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    if (!res.ok) throw new Error('Failed to fetch movie');
    return res.json();
  },

  async createMovie(data) {
    const res = await fetch(`${API_BASE}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create movie');
    return res.json();
  },

  async updateMovie(id, data) {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update movie');
    return res.json();
  },

  async deleteMovie(id) {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete movie');
    return res.json();
  },

  // Showtimes
  async getShowtimes(movieId = '', date = '') {
    const params = new URLSearchParams();
    if (movieId) params.append('movieId', movieId);
    if (date) params.append('date', date);
    const res = await fetch(`${API_BASE}/showtimes?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch showtimes');
    return res.json();
  },

  async getShowtimeSeats(showtimeId) {
    const res = await fetch(`${API_BASE}/showtimes/${showtimeId}/seats`);
    if (!res.ok) throw new Error('Failed to fetch seats');
    return res.json();
  },

  async createShowtime(data) {
    const res = await fetch(`${API_BASE}/showtimes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create showtime');
    return res.json();
  },

  async deleteShowtime(id) {
    const res = await fetch(`${API_BASE}/showtimes/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete showtime');
    return res.json();
  },

  // Snacks
  async getSnacks() {
    const res = await fetch(`${API_BASE}/snacks`);
    if (!res.ok) throw new Error('Failed to fetch snacks');
    return res.json();
  },

  // Bookings
  async createBooking(bookingData) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to complete booking');
    return json;
  },

  async getBookings() {
    const res = await fetch(`${API_BASE}/bookings`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async cancelBooking(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to cancel booking');
    return res.json();
  },

  // Admin stats
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch admin statistics');
    return res.json();
  }
};

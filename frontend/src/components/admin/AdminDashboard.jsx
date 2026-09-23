import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { sound } from '../../services/soundEngine';
import {
  TrendingUp, Users, Film, Clock, Plus, Trash2, Edit3,
  Calendar, DollarSign, CheckCircle, AlertTriangle, ArrowLeft, RefreshCw, Eye, Lock
} from 'lucide-react';

export default function AdminDashboard({ onExitAdmin, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'movies' | 'showtimes' | 'matrix'
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Movie Form State
  const [showNewMovieModal, setShowNewMovieModal] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    tagline: '',
    duration: '2h 30m',
    rating: 9.0,
    certificate: 'UA',
    language: 'English / Tamil',
    director: '',
    cast: 'Lead Actor, Lead Actress',
    genre: 'Action, Sci-Fi',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w'
  });

  // New Showtime Form State
  const [showNewShowtimeModal, setShowNewShowtimeModal] = useState(false);
  const [newShowtime, setNewShowtime] = useState({
    movieId: '',
    date: 'Today',
    time: '04:30 PM',
    hall: 'Grand IMAX Audi 1',
    experience: 'IMAX 3D Laser',
    sound: 'Dolby Atmos 12-Channel',
    priceVip: 450,
    priceExecutive: 300,
    priceClassic: 190
  });

  // Selected showtime for matrix inspection
  const [matrixShowtimeId, setMatrixShowtimeId] = useState('');
  const [matrixSeats, setMatrixSeats] = useState([]);

  const refreshAllData = async () => {
    try {
      setLoading(true);
      const [statsData, moviesData, showtimesData, bookingsData] = await Promise.all([
        api.getAdminStats(),
        api.getMovies(),
        api.getShowtimes(),
        api.getBookings()
      ]);
      setStats(statsData);
      setMovies(moviesData);
      setShowtimes(showtimesData);
      setBookings(bookingsData);
      if (showtimesData.length > 0 && !matrixShowtimeId) {
        setMatrixShowtimeId(showtimesData[0].id);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // When matrixShowtimeId changes, fetch seat matrix
  useEffect(() => {
    async function loadMatrix() {
      if (!matrixShowtimeId) return;
      try {
        const data = await api.getShowtimeSeats(matrixShowtimeId);
        setMatrixSeats(data.seats || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadMatrix();
  }, [matrixShowtimeId]);

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    sound.playClick();
    try {
      const payload = {
        ...newMovie,
        genre: newMovie.genre.split(',').map(s => s.trim()),
        cast: newMovie.cast.split(',').map(s => s.trim())
      };
      await api.createMovie(payload);
      setShowNewMovieModal(false);
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to remove this movie and its scheduled screenings?')) return;
    sound.playClick();
    try {
      await api.deleteMovie(id);
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateShowtime = async (e) => {
    e.preventDefault();
    sound.playClick();
    try {
      await api.createShowtime(newShowtime);
      setShowNewShowtimeModal(false);
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteShowtime = async (id) => {
    if (!window.confirm('Delete this showtime?')) return;
    sound.playClick();
    try {
      await api.deleteShowtime(id);
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm(`Cancel booking ${id} and release seats?`)) return;
    sound.playClick();
    try {
      await api.cancelBooking(id);
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onExitAdmin();
            }}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Customer View</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              if (onLogout) {
                onLogout();
              } else {
                onExitAdmin();
              }
            }}
            className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 transition-all flex items-center gap-2 text-xs font-semibold"
            title="Lock Console and require password again"
          >
            <Lock className="w-4 h-4" />
            <span>Lock & Sign Out</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                THEATER OPERATOR SYSTEM
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              CineVerse Central Command
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              refreshAllData();
            }}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition-all"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10">
            {[
              { id: 'overview', label: 'Analytics', icon: TrendingUp },
              { id: 'movies', label: 'Movie Catalog', icon: Film },
              { id: 'showtimes', label: 'Showtimes', icon: Clock },
              { id: 'matrix', label: 'Live Seat Matrix', icon: Eye }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>TOTAL REVENUE</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            ₹{stats?.totalRevenue?.toLocaleString() || '0'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Live synchronized from bookings</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>TICKETS SOLD</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {stats?.totalTickets || 0}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Across all auditorium screens</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>OCCUPANCY RATE</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {stats?.occupancyRate || 0}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Hall capacity utilization</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>ACTIVE TITLES</span>
            <Film className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono">
            {movies.length} Movies
          </div>
          <div className="text-[10px] text-slate-500 mt-1">{showtimes.length} active showtimes</div>
        </div>
      </div>

      {/* TAB: OVERVIEW / ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Revenue by Movie */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10">
            <h3 className="text-base font-bold text-white mb-4">Revenue Breakdown by Title</h3>
            <div className="space-y-3">
              {stats?.revenueByMovie?.map(item => {
                const maxRev = Math.max(...(stats.revenueByMovie.map(i => i.revenue) || [1]), 1);
                const pct = Math.round((item.revenue / maxRev) * 100);
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-200">{item.name}</span>
                      <span className="font-mono text-cyan-400 font-bold">₹{item.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Live Bookings Table */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10">
            <h3 className="text-base font-bold text-white mb-4">Real-Time Bookings & Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono">
                    <th className="pb-3">REF ID</th>
                    <th className="pb-3">MOVIE</th>
                    <th className="pb-3">SHOWTIME</th>
                    <th className="pb-3">SEATS</th>
                    <th className="pb-3">GUEST</th>
                    <th className="pb-3">TOTAL</th>
                    <th className="pb-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-mono font-bold text-cyan-400">{b.id}</td>
                      <td className="py-3 font-semibold text-white">{b.movieTitle}</td>
                      <td className="py-3 text-slate-400">{b.date} • {b.time}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                          {b.seats?.join(', ')}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300">{b.customerName}</td>
                      <td className="py-3 font-mono font-bold text-emerald-400">₹{b.totalAmount?.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-all text-[11px] font-semibold"
                        >
                          Cancel / Refund
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: MOVIES */}
      {activeTab === 'movies' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Movie Catalog ({movies.length})</h2>
            <button
              onClick={() => {
                sound.playClick();
                setShowNewMovieModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Movie</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {movies.map(m => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex gap-4">
                <img
                  src={m.posterUrl}
                  alt={m.title}
                  className="w-20 h-28 object-cover rounded-xl border border-white/10 flex-shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      {m.certificate}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{m.title}</h4>
                    <p className="text-xs text-slate-400">{m.duration} • {m.language}</p>
                    <p className="text-[11px] text-amber-300 font-bold mt-0.5">★ {m.rating} / 10</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleDeleteMovie(m.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 transition-all"
                      title="Delete Movie"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SHOWTIMES */}
      {activeTab === 'showtimes' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Theatrical Schedules ({showtimes.length})</h2>
            <button
              onClick={() => {
                sound.playClick();
                setShowNewShowtimeModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Showtime</span>
            </button>
          </div>

          <div className="space-y-3">
            {showtimes.map(st => {
              const movie = movies.find(m => m.id === st.movieId);
              return (
                <div
                  key={st.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-cyan-400 text-sm">
                      {st.time.split(' ')[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{movie?.title || 'Unknown Title'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-semibold">
                          {st.experience}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {st.hall} • 📅 {st.date} at {st.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right text-xs">
                      <div className="text-slate-400">Pricing Tiers:</div>
                      <div className="font-mono text-cyan-300">
                        VIP: ₹{st.priceTiers?.vip} | Exec: ₹{st.priceTiers?.executive} | Classic: ₹{st.priceTiers?.classic}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {st.bookedSeats?.length || 0} seats booked
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteShowtime(st.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 transition-all"
                      title="Delete Showtime"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: LIVE SEAT MATRIX */}
      {activeTab === 'matrix' && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Live Screen Occupancy Matrix</h2>
              <p className="text-xs text-slate-400">Real-time status of booked vs available seats in the auditorium</p>
            </div>

            {/* Select Showtime to Inspect */}
            <select
              value={matrixShowtimeId}
              onChange={e => setMatrixShowtimeId(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-white text-xs font-medium focus:outline-none"
            >
              {showtimes.map(st => {
                const m = movies.find(mov => mov.id === st.movieId);
                return (
                  <option key={st.id} value={st.id}>
                    {m?.title || 'Film'} ({st.hall} - {st.date} {st.time})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Matrix Grid */}
          <div className="p-6 rounded-2xl bg-black/60 border border-white/5">
            <div className="text-center mb-6">
              <div className="w-1/2 h-1.5 mx-auto bg-cyan-400/80 rounded-full shadow-[0_0_15px_rgba(0,245,255,0.7)]" />
              <div className="text-[10px] font-mono text-cyan-400 tracking-widest mt-1">SCREEN DIRECTION</div>
            </div>

            <div className="flex flex-col gap-2 items-center max-w-2xl mx-auto">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(rowLabel => {
                const rSeats = matrixSeats.filter(s => s.row === rowLabel);
                return (
                  <div key={rowLabel} className="flex items-center gap-2">
                    <span className="w-5 font-mono text-xs font-bold text-slate-500 text-right">{rowLabel}</span>
                    <div className="flex items-center gap-1.5">
                      {rSeats.map(seat => (
                        <div
                          key={seat.id}
                          className={`w-7 h-7 rounded text-[10px] font-mono font-bold flex items-center justify-center border ${
                            seat.isBooked
                              ? 'bg-rose-950/80 border-rose-500/60 text-rose-300'
                              : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          }`}
                          title={`${seat.id} (${seat.tier}) - ${seat.isBooked ? 'Booked' : 'Available'}`}
                        >
                          {seat.number}
                        </div>
                      ))}
                    </div>
                    <span className="w-5 font-mono text-xs font-bold text-slate-500">{rowLabel}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-emerald-950 border border-emerald-500" />
                <span className="text-emerald-300">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-rose-950 border border-rose-500" />
                <span className="text-rose-300">Booked / Occupied</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Movie */}
      {showNewMovieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-950 border border-cyan-500/30 p-6 rounded-3xl max-w-lg w-full">
            <h3 className="text-lg font-bold text-white mb-4">Add Movie to Catalog</h3>
            <form onSubmit={handleCreateMovie} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  value={newMovie.title}
                  onChange={e => setNewMovie({ ...newMovie, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white"
                  placeholder="e.g. Tron: Ares"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={newMovie.duration}
                    onChange={e => setNewMovie({ ...newMovie, duration: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Rating (1-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMovie.rating}
                    onChange={e => setNewMovie({ ...newMovie, rating: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Poster URL</label>
                <input
                  type="text"
                  value={newMovie.posterUrl}
                  onChange={e => setNewMovie({ ...newMovie, posterUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Trailer URL (YouTube Embed)</label>
                <input
                  type="text"
                  value={newMovie.trailerUrl}
                  onChange={e => setNewMovie({ ...newMovie, trailerUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-[11px]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewMovieModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Showtime */}
      {showNewShowtimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-950 border border-cyan-500/30 p-6 rounded-3xl max-w-lg w-full">
            <h3 className="text-lg font-bold text-white mb-4">Schedule New Showtime</h3>
            <form onSubmit={handleCreateShowtime} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Select Movie</label>
                <select
                  required
                  value={newShowtime.movieId}
                  onChange={e => setNewShowtime({ ...newShowtime, movieId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white"
                >
                  <option value="">-- Choose a Movie --</option>
                  {movies.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Date</label>
                  <select
                    value={newShowtime.date}
                    onChange={e => setNewShowtime({ ...newShowtime, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Showtime (e.g. 09:15 PM)</label>
                  <input
                    type="text"
                    required
                    value={newShowtime.time}
                    onChange={e => setNewShowtime({ ...newShowtime, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Hall / Screen</label>
                <input
                  type="text"
                  value={newShowtime.hall}
                  onChange={e => setNewShowtime({ ...newShowtime, hall: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">VIP (₹)</label>
                  <input
                    type="number"
                    value={newShowtime.priceVip}
                    onChange={e => setNewShowtime({ ...newShowtime, priceVip: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Executive (₹)</label>
                  <input
                    type="number"
                    value={newShowtime.priceExecutive}
                    onChange={e => setNewShowtime({ ...newShowtime, priceExecutive: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Classic (₹)</label>
                  <input
                    type="number"
                    value={newShowtime.priceClassic}
                    onChange={e => setNewShowtime({ ...newShowtime, priceClassic: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewShowtimeModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                >
                  Create Showtime
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Developer Footer */}
      <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-mono">
        <div>CineVerse 3D Operator Console • v2.5 Architecture</div>
        <div className="text-slate-400">
          Designed and Developed by <strong className="text-cyan-400 font-sans font-bold">Kombaiya & Ashik Chandru</strong>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import MovieHeroCarousel from './components/movies/MovieHeroCarousel';
import MovieCard from './components/movies/MovieCard';
import MovieDetailsModal from './components/movies/MovieDetailsModal';
import TrailerModal from './components/movies/TrailerModal';
import SeatSelector from './components/booking/SeatSelector';
import SnackConcessions from './components/booking/SnackConcessions';
import CheckoutModal from './components/booking/CheckoutModal';
import DigitalTicket from './components/booking/DigitalTicket';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginModal from './components/admin/AdminLoginModal';
import DeveloperCard3D from './components/common/DeveloperCard3D';
import { api } from './services/api';
import { sound } from './services/soundEngine';
import { Search, Sparkles, Filter, Film, Clapperboard, Layers, Glasses, Flame } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'seat-selection' | 'snacks' | 'ticket'
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all'); // 'all' | 'tamil' | '3d' | '2d'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Modals & Active selections
  const [activeDetailsMovie, setActiveDetailsMovie] = useState(null);
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Booking Flow State
  const [seatBookingState, setSeatBookingState] = useState(null);
  const [snackBookingState, setSnackBookingState] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await api.getMovies();
      setMovies(data);
    } catch (err) {
      console.error('Failed to load movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const genres = ['All', 'Action', 'Sci-Fi', 'Comedy', 'Romance', 'Horror', 'Drama', 'Crime', 'Adventure'];

  // Advanced Filtering
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          movie.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          movie.tamilTitle?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = selectedGenre === 'All' || movie.genre?.includes(selectedGenre);

    let matchesCategory = true;
    if (activeCategoryFilter === 'tamil') {
      matchesCategory = Boolean(movie.isTamil);
    } else if (activeCategoryFilter === '3d') {
      matchesCategory = Boolean(movie.has3D);
    } else if (activeCategoryFilter === '2d') {
      matchesCategory = Boolean(movie.has2D);
    }

    return matchesSearch && matchesGenre && matchesCategory;
  });

  // Flow handlers
  const handleSelectMovie = (movie) => {
    setActiveDetailsMovie(movie);
  };

  const handleSelectShowtime = (showtime) => {
    setSelectedMovie(activeDetailsMovie);
    setSelectedShowtime(showtime);
    setActiveDetailsMovie(null);
    setCurrentView('seat-selection');
  };

  const handleSeatProceed = (seatData) => {
    setSeatBookingState(seatData);
    setCurrentView('snacks');
  };

  const handleSnackProceed = (snackData) => {
    setSnackBookingState(snackData);
    setShowCheckoutModal(true);
  };

  const handleBookingSuccess = (booking) => {
    const validBooking = booking?.id ? booking : (booking?.booking || {
      id: `CV-${Math.floor(10000 + Math.random() * 90000)}`,
      movieTitle: selectedMovie?.title || 'Feature Film',
      showType: selectedShowtime?.showType || '2D',
      format: selectedShowtime?.format || 'IMAX 3D Laser',
      date: selectedShowtime?.date || 'Today',
      time: selectedShowtime?.time || '07:00 PM',
      hall: selectedShowtime?.hall || 'Grand IMAX Audi 1',
      seats: seatBookingState?.seats || ['A1'],
      seatTiers: seatBookingState?.seatObjects?.map(s => s.tier) || ['VIP Lounger'],
      totalAmount: (seatBookingState?.subtotal || 0) + (snackBookingState?.snacksSubtotal || 0),
      customerName: 'Valued Cinema Guest',
      customerEmail: 'guest@cineverse.io',
      paymentMethod: 'Instant Hologram Checkout',
      status: 'Confirmed'
    });
    setConfirmedBooking(validBooking);
    setShowCheckoutModal(false);
    setCurrentView('ticket');
  };

  const handleResetFlow = () => {
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSeatBookingState(null);
    setSnackBookingState(null);
    setConfirmedBooking(null);
    setCurrentView('home');
  };

  const handleToggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      if (isAdminAuthenticated) {
        setIsAdmin(true);
        handleResetFlow();
      } else {
        setShowAdminLogin(true);
      }
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setShowAdminLogin(false);
    setIsAdmin(true);
    handleResetFlow();
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdmin(false);
    handleResetFlow();
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'home') handleResetFlow();
        }}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        activeFilter={activeCategoryFilter}
        onFilterChange={(filter) => {
          setActiveCategoryFilter(filter);
          if (currentView !== 'home') {
            setCurrentView('home');
          }
        }}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {isAdmin ? (
          <AdminDashboard
            onExitAdmin={() => setIsAdmin(false)}
            onLogout={handleAdminLogout}
          />
        ) : currentView === 'home' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* 3D Hero Carousel */}
            <MovieHeroCarousel
              movies={movies}
              onSelectMovie={handleSelectMovie}
              onOpenTrailer={(m) => setActiveTrailerMovie(m)}
            />

            {/* Quick Experience Filter Switcher */}
            <div className="glass-panel p-4 md:p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative w-full lg:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search GOAT, Coolie, Leo, Amaran..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Categories Pills (All / Tamil / 3D Shows / 2D Shows) */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveCategoryFilter('all');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      activeCategoryFilter === 'all'
                        ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    🔥 All Releases ({movies.length})
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveCategoryFilter('tamil');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                      activeCategoryFilter === 'tamil'
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md shadow-amber-500/30'
                        : 'bg-amber-950/20 border border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
                    }`}
                  >
                    <span>தமிழ் Blockbusters</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveCategoryFilter('3d');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                      activeCategoryFilter === '3d'
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black shadow-md shadow-cyan-500/30'
                        : 'bg-cyan-950/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40'
                    }`}
                  >
                    <Glasses className="w-3.5 h-3.5" />
                    <span>🕶️ 3D Experiences Only</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveCategoryFilter('2d');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                      activeCategoryFilter === '2d'
                        ? 'bg-gradient-to-r from-purple-400 to-indigo-600 text-white shadow-md'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>🎬 2D Normal Shows</span>
                  </button>
                </div>

                {/* Genre Filter */}
                <div className="flex items-center gap-2 self-start lg:self-auto">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <select
                    value={selectedGenre}
                    onChange={e => {
                      sound.playClick();
                      setSelectedGenre(e.target.value);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-xs font-medium focus:outline-none"
                  >
                    {genres.map(g => (
                      <option key={g} value={g}>{g === 'All' ? 'All Genres' : g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Movies Catalog Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>
                      {activeCategoryFilter === 'tamil' ? '🔥 தமிழ் Kollywood Blockbusters' :
                       activeCategoryFilter === '3d' ? '🕶️ 3D Stereoscopic Theatrical Releases' :
                       activeCategoryFilter === '2d' ? '🎬 2D Ultra Clear Laser Screenings' :
                       'Now Screening in CineVerse Theaters'}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any title to choose between 3D Experiences or 2D Regular Screenings
                  </p>
                </div>
                <div className="text-xs text-cyan-400 font-mono font-bold">
                  {filteredMovies.length} TITLES FOUND
                </div>
              </div>

              {/* Genre Quick Filter Bar */}
              <div className="flex flex-wrap items-center gap-2 mb-6 pb-2 overflow-x-auto">
                {genres.map(g => {
                  const count = g === 'All' ? movies.length : movies.filter(m => m.genre?.includes(g)).length;
                  return (
                    <button
                      key={g}
                      onClick={() => {
                        sound.playClick();
                        setSelectedGenre(g);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                        selectedGenre === g
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/30'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{g}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${selectedGenre === g ? 'bg-black/30 text-black font-mono' : 'bg-white/10 text-slate-400'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                  <p className="text-xs text-slate-400 font-mono">LOADING CINEMA MATRIX...</p>
                </div>
              ) : filteredMovies.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs bg-slate-900/40 rounded-3xl border border-white/10">
                  No movies matched your current filter criteria.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {filteredMovies.map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onSelectMovie={handleSelectMovie}
                      onOpenTrailer={(m) => setActiveTrailerMovie(m)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Next-Gen Technology Banner */}
            <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 inline-block">
                    <Glasses className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-white text-base">Dedicated 3D & 2D Separation</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Filter IMAX 3D, RealD 3D with sanitized 3D glasses vs high-resolution 2D Dolby Atmos shows with one tap.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 inline-block">
                    <Flame className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-white text-base">Tamil Kollywood Premieres</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Full catalog support for Thalapathy Vijay, Superstar Rajinikanth, Kamal Haasan, and Sivakarthikeyan blockbusters.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 inline-block">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-white text-base">First-Person Seat POV</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sit in your chair in WebGL 3D before booking. Preview exact screen focal angles and row elevations.
                  </p>
                </div>
              </div>
            </div>

            {/* 3D Holographic Glitter Developer Showcase */}
            <DeveloperCard3D />
          </div>
        ) : currentView === 'seat-selection' ? (
          <SeatSelector
            movie={selectedMovie}
            showtime={selectedShowtime}
            onProceed={handleSeatProceed}
            onBack={() => setCurrentView('home')}
          />
        ) : currentView === 'snacks' ? (
          <SnackConcessions
            ticketSubtotal={(seatBookingState?.subtotal || 0) + (seatBookingState?.glassesAmount || 0)}
            selectedSeatsCount={seatBookingState?.seats?.length || 0}
            onProceed={handleSnackProceed}
            onBack={() => setCurrentView('seat-selection')}
          />
        ) : currentView === 'ticket' ? (
          <DigitalTicket
            booking={confirmedBooking}
            onDone={handleResetFlow}
          />
        ) : null}
      </main>

      {/* Global Modals */}
      {showAdminLogin && (
        <AdminLoginModal
          onSuccess={handleAdminLoginSuccess}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      {activeDetailsMovie && (
        <MovieDetailsModal
          movie={activeDetailsMovie}
          onSelectShowtime={handleSelectShowtime}
          onClose={() => setActiveDetailsMovie(null)}
        />
      )}

      {activeTrailerMovie && (
        <TrailerModal
          movie={activeTrailerMovie}
          onClose={() => setActiveTrailerMovie(null)}
        />
      )}

      {showCheckoutModal && (
        <CheckoutModal
          bookingInfo={{
            movie: selectedMovie,
            showtime: selectedShowtime,
            seats: seatBookingState?.seats || [],
            seatObjects: seatBookingState?.seatObjects || [],
            subtotal: seatBookingState?.subtotal || 0,
            glassesCount: seatBookingState?.glassesCount || 0,
            glassesAmount: seatBookingState?.glassesAmount || 0,
            showType: seatBookingState?.showType || selectedShowtime?.showType || '2D',
            format: seatBookingState?.format || selectedShowtime?.format || 'Standard',
            snacks: snackBookingState?.snacks || [],
            snacksSubtotal: snackBookingState?.snacksSubtotal || 0
          }}
          onSuccess={handleBookingSuccess}
          onClose={() => setShowCheckoutModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}

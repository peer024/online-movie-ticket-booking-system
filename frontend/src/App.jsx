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
import ProjectCredits from './components/common/ProjectCredits';
import { api } from './services/api';
import { Search, Film, Layers, Flame, Ticket } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'seat-selection' | 'snacks' | 'ticket'
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all'); // 'all' | 'tamil'
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

  // Filtering
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          movie.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          movie.tamilTitle?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = selectedGenre === 'All' || movie.genre?.includes(selectedGenre);

    let matchesCategory = true;
    if (activeCategoryFilter === 'tamil') {
      matchesCategory = Boolean(movie.isTamil && !movie.isTamilDubbed);
    } else if (activeCategoryFilter === 'dubbed') {
      matchesCategory = Boolean(movie.isTamilDubbed);
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
      id: `CP-${Math.floor(10000 + Math.random() * 90000)}`,
      movieTitle: selectedMovie?.title || 'Feature Film',
      showType: '2D',
      format: selectedShowtime?.format || 'Standard',
      date: selectedShowtime?.date || 'Today',
      time: selectedShowtime?.time || '07:00 PM',
      hall: selectedShowtime?.hall || 'Audi 1',
      seats: seatBookingState?.seats || ['A1'],
      seatTiers: seatBookingState?.seatObjects?.map(s => s.tier) || ['Classic'],
      totalAmount: (seatBookingState?.subtotal || 0) + (snackBookingState?.snacksSubtotal || 0),
      customerName: 'Valued Guest',
      customerEmail: 'guest@cinepass.com',
      paymentMethod: 'UPI Checkout',
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* Hero Carousel */}
            <MovieHeroCarousel
              movies={movies}
              onSelectMovie={handleSelectMovie}
              onOpenTrailer={(m) => setActiveTrailerMovie(m)}
            />

            {/* Quick Experience Filter Switcher */}
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative w-full lg:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search GOAT, Coolie, Leo, Amaran..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs placeholder:text-gray-400 focus:border-rose-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                {/* Categories Pills (All / Tamil) */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  <button
                    onClick={() => setActiveCategoryFilter('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeCategoryFilter === 'all'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🔥 All Releases ({movies.length})
                  </button>

                  <button
                    onClick={() => setActiveCategoryFilter('tamil')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeCategoryFilter === 'tamil'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    <span>தமிழ் Originals</span>
                  </button>

                  <button
                    onClick={() => setActiveCategoryFilter('dubbed')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeCategoryFilter === 'dubbed'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100'
                    }`}
                  >
                    <span>🎧 தமிழ் Dubbed ({movies.filter(m => m.isTamilDubbed).length})</span>
                  </button>
                </div>

                {/* Genre Filter */}
                <div className="flex items-center gap-2 self-start lg:self-auto">
                  <Layers className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedGenre}
                    onChange={e => setSelectedGenre(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 text-gray-700 text-xs font-medium focus:outline-none focus:border-rose-500"
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
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <span>
                      {activeCategoryFilter === 'tamil' ? '🔥 Tamil Original Blockbusters' :
                       activeCategoryFilter === 'dubbed' ? '🎧 Tamil Dubbed Blockbusters' :
                       'Now Showing in Theatres'}
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Select any movie to choose showtimes and book your tickets
                  </p>
                </div>
                <div className="text-xs text-rose-600 font-mono font-bold">
                  {filteredMovies.length} MOVIES AVAILABLE
                </div>
              </div>

              {/* Genre Quick Filter Bar */}
              <div className="flex flex-wrap items-center gap-2 mb-6 pb-1 overflow-x-auto">
                {genres.map(g => {
                  const count = g === 'All' ? movies.length : movies.filter(m => m.genre?.includes(g)).length;
                  return (
                    <button
                      key={g}
                      onClick={() => setSelectedGenre(g)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                        selectedGenre === g
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{g}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded ${selectedGenre === g ? 'bg-black/20 text-white font-mono' : 'bg-gray-100 text-gray-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-rose-600 border-t-transparent animate-spin" />
                  <p className="text-xs text-gray-500 font-medium">Loading movie catalog...</p>
                </div>
              ) : filteredMovies.length === 0 ? (
                <div className="py-16 text-center text-gray-500 text-xs bg-white rounded-2xl border border-gray-200">
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

            {/* Cinema System Features Banner */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-base">Interactive Seat Layout</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Choose your favorite seats with row-wise VIP, Executive, and Classic pricing in real-time.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                    <Flame className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-base">Latest Blockbusters</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Watch official HD YouTube trailers and select showtimes for Tamil and Indian releases.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                    <Film className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-base">Instant E-Ticket Pass</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Get your booking confirmed instantly with QR code verification, print slip, and image download.
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Project Credits */}
            <ProjectCredits />
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
            ticketSubtotal={seatBookingState?.subtotal || 0}
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
            showType: '2D',
            format: selectedShowtime?.format || 'Standard',
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

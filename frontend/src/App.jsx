import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import SeatSelector from './components/booking/SeatSelector';
import CheckoutModal from './components/booking/CheckoutModal';
import DigitalTicket from './components/booking/DigitalTicket';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginModal from './components/admin/AdminLoginModal';

import { api } from './services/api';
import { Search, Film, Layers, Flame, ChevronRight, Info } from 'lucide-react';


export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'seat-selection' | 'ticket'
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [movies, setMovies] = useState([]);
  const [allShowtimes, setAllShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Date Picker
  const [selectedDate, setSelectedDate] = useState('Today');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all'); // 'all' | 'tamil' | 'dubbed'
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredShowtimeId, setHoveredShowtimeId] = useState(null);

  // Modals & Active selections
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Booking Flow State (Direct to Checkout, skipping snacks!)
  const [seatBookingState, setSeatBookingState] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Dates for TicketNew-style horizontal date picker
  const dateOptions = [
    { label: 'Today', day: 'THU', date: '01', month: 'OCT' },
    { label: 'Tomorrow', day: 'FRI', date: '02', month: 'OCT' },
    { label: 'Sat, 03 Oct', day: 'SAT', date: '03', month: 'OCT' },
    { label: 'Sun, 04 Oct', day: 'SUN', date: '04', month: 'OCT' },
    { label: 'Mon, 05 Oct', day: 'MON', date: '05', month: 'OCT' },
    { label: 'Tue, 06 Oct', day: 'TUE', date: '06', month: 'OCT' },
    { label: 'Wed, 07 Oct', day: 'WED', date: '07', month: 'OCT' }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [moviesData, showtimesData] = await Promise.all([
        api.getMovies(),
        api.getShowtimes()
      ]);
      setMovies(moviesData);
      setAllShowtimes(showtimesData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter movies
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          movie.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          movie.tamilTitle?.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesCategory = true;
    if (activeCategoryFilter === 'tamil') {
      matchesCategory = Boolean(movie.isTamil && !movie.isTamilDubbed);
    } else if (activeCategoryFilter === 'dubbed') {
      matchesCategory = Boolean(movie.isTamilDubbed);
    }

    return matchesSearch && matchesCategory;
  });

  // Check if a showtime has already ended for 'Today'
  const isShowtimePast = (timeStr) => {
    if (selectedDate !== 'Today') return false;
    if (!timeStr) return false;
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return false;
    let [_, hours, minutes, ampm] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;

    const now = new Date();
    const showDateTime = new Date();
    showDateTime.setHours(hours, minutes, 0, 0);

    return now > showDateTime;
  };

  // Flow handlers
  const handleSelectShowtime = (movie, showtime) => {
    // Merge live localStorage booked seats
    let localBooked = [];
    try {
      localBooked = JSON.parse(localStorage.getItem(`bookedSeats_${showtime.id}`) || '[]');
    } catch (e) {}

    const mergedShowtime = {
      ...showtime,
      date: showtime.date || selectedDate,
      bookedSeats: Array.from(new Set([...(showtime.bookedSeats || []), ...localBooked]))
    };

    setSelectedMovie(movie);
    setSelectedShowtime(mergedShowtime);
    setCurrentView('seat-selection');
  };

  // Direct to Checkout, bypassing snacks!
  const handleSeatProceed = (seatData) => {
    setSeatBookingState(seatData);
    setShowCheckoutModal(true);
  };

  const handleBookingSuccess = (booking) => {
    const validBooking = booking?.id ? booking : (booking?.booking || {
      id: `CP-${Math.floor(10000 + Math.random() * 90000)}`,
      movieTitle: selectedMovie?.title || 'Feature Film',
      showType: '2D',
      format: selectedShowtime?.format || 'RAM - RGB ATMOS',
      date: selectedShowtime?.date || selectedDate,
      time: selectedShowtime?.time || '07:00 PM',
      hall: selectedShowtime?.hall || 'Audi 1',
      seats: seatBookingState?.seats || ['F10', 'F11'],
      seatTiers: seatBookingState?.seatObjects?.map(s => s.tier) || ['PREMIUM'],
      totalAmount: seatBookingState?.subtotal || 380,
      customerName: 'Valued Guest',
      customerEmail: 'guest@cinepass.com',
      paymentMethod: 'UPI Checkout',
      status: 'Confirmed'
    });

    // Immediately persist booked seats in React state & localStorage
    const bookedShowtimeId = validBooking.showtimeId || selectedShowtime?.id;
    const newlyBookedSeats = validBooking.seats || seatBookingState?.seats || [];
    if (bookedShowtimeId && newlyBookedSeats.length > 0) {
      try {
        const key = `bookedSeats_${bookedShowtimeId}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = Array.from(new Set([...existing, ...newlyBookedSeats]));
        localStorage.setItem(key, JSON.stringify(updated));
      } catch (e) {}

      setAllShowtimes(prev => prev.map(st => {
        if (st.id === bookedShowtimeId) {
          return {
            ...st,
            bookedSeats: Array.from(new Set([...(st.bookedSeats || []), ...newlyBookedSeats]))
          };
        }
        return st;
      }));
    }

    setConfirmedBooking(validBooking);
    setShowCheckoutModal(false);
    setCurrentView('ticket');

    // Background sync with API
    fetchData();
  };

  const handleResetFlow = () => {
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSeatBookingState(null);
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

  // Get showtimes for a movie
  const getMovieShowtimes = (movieId) => {
    let movieShows = allShowtimes.filter(s => s.movieId === movieId);
    if (!movieShows || movieShows.length === 0) {
      // Default fallback showtimes if none explicitly configured in DB
      movieShows = [
        { id: `st-${movieId}-1`, movieId, date: 'Today', time: '11:30 AM', hall: 'Audi 1', sound: 'RAM - RGB ATMOS', priceTiers: { executive: 190, classic: 150 }, bookedSeats: ['F03', 'F04', 'N11'] },
        { id: `st-${movieId}-2`, movieId, date: 'Today', time: '03:00 PM', hall: 'Audi 1', sound: 'RAM - RGB ATMOS', priceTiers: { executive: 190, classic: 150 }, bookedSeats: ['G11', 'G12'] },
        { id: `st-${movieId}-3`, movieId, date: 'Today', time: '06:45 PM', hall: 'Audi 1', sound: 'RAM - RGB ATMOS', priceTiers: { executive: 190, classic: 150 }, bookedSeats: ['H05', 'H06'] },
        { id: `st-${movieId}-4`, movieId, date: 'Today', time: '10:15 PM', hall: 'Audi 1', sound: 'RAM - RGB ATMOS', priceTiers: { executive: 190, classic: 150 }, bookedSeats: ['J14', 'J15'] },
        { id: `st-${movieId}-5`, movieId, date: 'Today', time: '11:45 PM', hall: 'Audi 1', sound: 'RAM - RGB ATMOS', priceTiers: { executive: 190, classic: 150 }, bookedSeats: [] }
      ];
    }

    // Always merge live localStorage booked seats
    return movieShows.map(st => {
      let localBooked = [];
      try {
        localBooked = JSON.parse(localStorage.getItem(`bookedSeats_${st.id}`) || '[]');
      } catch (e) {}
      return {
        ...st,
        date: st.date || selectedDate,
        bookedSeats: Array.from(new Set([...(st.bookedSeats || []), ...localBooked]))
      };
    });
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

            {/* Breadcrumb matching user screenshot */}
            <div className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
              <span className="hover:text-gray-600 cursor-pointer">Home</span>
              <span>→</span>
              <span className="hover:text-gray-600 cursor-pointer">Cinemas in Tamil Nadu</span>
              <span>→</span>
              <span className="text-gray-700 font-semibold">CinePass Cinemas RGB Atmos</span>
            </div>

            {/* TicketNew / BookMyShow Date Navigation Bar (Image 1) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Horizontal Date Picker Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {dateOptions.map((d, idx) => {
                    const isSelected = (selectedDate === 'Today' && idx === 0) ||
                                       (selectedDate === 'Tomorrow' && idx === 1) ||
                                       (selectedDate === d.label);
                    return (
                      <button
                        key={d.label}
                        onClick={() => setSelectedDate(idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : d.label)}
                        className={`flex flex-col items-center justify-center min-w-[65px] px-3 py-2 rounded-xl text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-600 text-white font-bold shadow-xs'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-semibold">{d.day}</span>
                        <span className="text-base font-black leading-tight">{d.date}</span>
                        <span className="text-[10px] uppercase font-semibold">{d.month}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right Filter & Search Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs">
                    <button
                      onClick={() => setActiveCategoryFilter('all')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        activeCategoryFilter === 'all'
                          ? 'bg-white text-gray-900 shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      All ({movies.length})
                    </button>
                    <button
                      onClick={() => setActiveCategoryFilter('tamil')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        activeCategoryFilter === 'tamil'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      தமிழ் Originals
                    </button>
                    <button
                      onClick={() => setActiveCategoryFilter('dubbed')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        activeCategoryFilter === 'dubbed'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      தமிழ் Dubbed
                    </button>
                  </div>

                  {/* Search input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search movie..."
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-gray-50 border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Status Legend Bar (Image 1) */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-5">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    AVAILABLE
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    FAST FILLING
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    SOLD OUT
                  </span>
                </div>
                <div className="text-[11px] text-gray-400">
                  Select time to choose seats directly
                </div>
              </div>
            </div>

            {/* Movie Showtime Schedule Rows matching Image 1 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs divide-y divide-gray-100 overflow-hidden">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-rose-600 border-t-transparent animate-spin" />
                  <p className="text-xs text-gray-500 font-medium">Loading theater show schedules...</p>
                </div>
              ) : filteredMovies.length === 0 ? (
                <div className="py-16 text-center text-gray-500 text-xs">
                  No movies matched your current filter criteria.
                </div>
              ) : (
                filteredMovies.map(movie => {
                  const showtimes = getMovieShowtimes(movie.id);

                  return (
                    <div
                      key={movie.id}
                      className="p-5 sm:p-6 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      {/* Left Side: Movie Details */}
                      <div className="max-w-md space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight">
                            {movie.title}
                          </h3>
                          <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">
                            {movie.certificate}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {movie.isTamilDubbed ? (
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                              Tamil Dubbed, 2D
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200">
                              Tamil, 2D
                            </span>
                          )}

                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 text-[11px]">{movie.duration}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 text-[11px]">{movie.genre?.join(', ')}</span>
                        </div>
                      </div>

                      {/* Right Side: Showtime Box Pills (Image 1) */}
                      <div className="flex flex-wrap items-center gap-3">
                        {showtimes.map(st => {
                          const isHovered = hoveredShowtimeId === `${movie.id}-${st.id}`;
                          const isPast = isShowtimePast(st.time);

                          return (
                            <div key={st.id} className="relative">
                              {/* Price popup on hover matching Image 1 */}
                              {isHovered && !isPast && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white border border-gray-200 rounded-xl p-3 shadow-xl z-30 pointer-events-none animate-fade-in">
                                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                                    <div className="p-1.5 rounded bg-gray-50">
                                      <div className="font-bold text-gray-900">₹{st.priceTiers?.executive || 190}.00</div>
                                      <div className="text-[10px] text-gray-500 font-semibold">PREMIUM</div>
                                      <div className="text-[10px] text-emerald-600 font-bold">Available</div>
                                    </div>
                                    <div className="p-1.5 rounded bg-gray-50">
                                      <div className="font-bold text-gray-900">₹{st.priceTiers?.classic || 150}.00</div>
                                      <div className="text-[10px] text-gray-500 font-semibold">GOLD</div>
                                      <div className="text-[10px] text-emerald-600 font-bold">Available</div>
                                    </div>
                                  </div>
                                  <div className="w-2.5 h-2.5 bg-white border-b border-r border-gray-200 transform rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
                                </div>
                              )}

                              {/* Showtime Box Button (Image 1) */}
                              <button
                                disabled={isPast}
                                onMouseEnter={() => setHoveredShowtimeId(`${movie.id}-${st.id}`)}
                                onMouseLeave={() => setHoveredShowtimeId(null)}
                                onClick={() => !isPast && handleSelectShowtime(movie, st)}
                                className={`px-4 py-2 rounded-xl transition-all text-center group shadow-2xs ${
                                  isPast
                                    ? 'bg-gray-100 border border-gray-200 cursor-not-allowed opacity-60'
                                    : 'bg-white border border-emerald-500 hover:bg-emerald-600 hover:text-white cursor-pointer'
                                }`}
                                title={isPast ? 'This screening has already ended' : `Book ${st.time}`}
                              >
                                <div className={`font-bold text-sm ${
                                  isPast ? 'text-gray-400 line-through' : 'text-emerald-700 group-hover:text-white'
                                }`}>
                                  {st.time}
                                </div>
                                <div className={`text-[9px] font-semibold uppercase tracking-tight ${
                                  isPast ? 'text-rose-600 font-bold' : 'text-gray-500 group-hover:text-emerald-100'
                                }`}>
                                  {isPast ? 'SHOW ENDED' : (st.sound || 'RAM - RGB ATMOS')}
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>


          </div>
        ) : currentView === 'seat-selection' ? (
          <SeatSelector
            movie={selectedMovie}
            showtime={selectedShowtime}
            onProceed={handleSeatProceed}
            onBack={() => setCurrentView('home')}
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


      {showCheckoutModal && (
        <CheckoutModal
          bookingInfo={{
            movie: selectedMovie,
            showtime: selectedShowtime,
            seats: seatBookingState?.seats || [],
            seatObjects: seatBookingState?.seatObjects || [],
            subtotal: seatBookingState?.subtotal || 0
          }}
          onSuccess={handleBookingSuccess}
          onClose={() => setShowCheckoutModal(false)}
        />
      )}

    </div>
  );
}


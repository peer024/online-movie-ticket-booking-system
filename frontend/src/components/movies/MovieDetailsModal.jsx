import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { X, Calendar, Star, MapPin, Clock } from 'lucide-react';

export default function MovieDetailsModal({
  movie,
  onSelectShowtime,
  onClose
}) {
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShowtimes() {
      if (!movie) return;
      try {
        setLoading(true);
        const data = await api.getShowtimes(movie.id);
        setShowtimes(data);
      } catch (err) {
        console.error('Failed to load showtimes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShowtimes();
  }, [movie]);

  if (!movie) return null;

  // Filter by date
  const dateFiltered = showtimes.filter(s => s.date.toLowerCase() === selectedDate.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-2xl my-6 overflow-hidden">
        {/* Header / Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-900">
          <img
            src={movie.bannerUrl}
            alt={movie.title}
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-20 h-28 rounded-lg object-cover border-2 border-white shadow-md hidden sm:block flex-shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {movie.isTamil && (
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-bold text-[10px] uppercase">
                    தமிழ்
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-white/20 text-white font-bold text-[10px]">
                  {movie.certificate}
                </span>
                <span className="text-xs text-gray-200">{movie.duration}</span>
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {movie.rating} ({movie.votes})
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{movie.title}</h2>
              {movie.tamilTitle && (
                <div className="text-xs font-semibold text-gray-200 mt-0.5">
                  {movie.tamilTitle}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Synopsis & Cast */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-700 leading-relaxed">
            <p>{movie.synopsis}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 pt-3 border-t border-gray-200 text-[11px] text-gray-500">
              <div><span className="font-semibold text-gray-700">Director:</span> {movie.director}</div>
              <div><span className="font-semibold text-gray-700">Cast:</span> {movie.cast?.join(', ')}</div>
            </div>
          </div>

          {/* Date Picker */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold text-gray-800">Select Date:</span>
            </div>
            <div className="flex gap-2">
              {['Today', 'Tomorrow'].map(date => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    selectedDate === date
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          {/* Showtimes Listings */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>Available Cinema Showtimes</span>
            </h3>

            {loading ? (
              <div className="h-28 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-rose-600 border-t-transparent animate-spin" />
              </div>
            ) : dateFiltered.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                No shows available on {selectedDate}.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dateFiltered.map(st => (
                  <button
                    key={st.id}
                    onClick={() => onSelectShowtime(st)}
                    className="p-3.5 rounded-xl bg-white border border-gray-200 hover:border-rose-400 hover:bg-rose-50/40 transition-all text-left cursor-pointer flex items-center justify-between shadow-xs group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-gray-900 group-hover:text-rose-600 font-mono">
                          {st.time}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold">
                          {st.sound || 'Dolby Atmos'}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1">
                        {st.hall || 'Audi 1'}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-700 block">
                        From ₹{st.priceTiers?.classic || 150}
                      </span>
                      <span className="text-[11px] text-rose-600 font-semibold group-hover:underline">
                        Select Seats →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

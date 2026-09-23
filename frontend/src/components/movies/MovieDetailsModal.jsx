import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { sound } from '../../services/soundEngine';
import { X, Calendar, Clock, Star, MapPin, Glasses, Film, Sparkles, Layers } from 'lucide-react';

export default function MovieDetailsModal({
  movie,
  onSelectShowtime,
  onClose
}) {
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [showTypeFilter, setShowTypeFilter] = useState('All'); // 'All' | '3D' | '2D'
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

  // Split into 3D Shows and 2D Shows
  const shows3D = dateFiltered.filter(s => s.showType === '3D');
  const shows2D = dateFiltered.filter(s => s.showType === '2D');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#090d16] rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl shadow-cyan-950/70 my-6">
        {/* Banner with Close button */}
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={movie.bannerUrl}
            alt={movie.title}
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/70 to-transparent" />

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white transition-all border border-white/10 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end gap-5">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-24 h-36 rounded-xl object-cover border-2 border-white/20 shadow-2xl hidden sm:block flex-shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {movie.isTamil && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40">
                    தமிழ் KOLLYWOOD
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                  {movie.certificate}
                </span>
                <span className="text-xs text-slate-300">{movie.duration}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {movie.rating} ({movie.votes})
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{movie.title}</h2>
              {movie.tamilTitle && (
                <div className="text-sm font-semibold text-cyan-300 font-display mt-0.5">
                  {movie.tamilTitle}
                </div>
              )}
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{movie.genre?.join(', ')} • {movie.language}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Synopsis & Cast */}
          <div className="mb-6 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
            <p className="text-xs text-slate-300 leading-relaxed">{movie.synopsis}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-400">
              <div><span className="text-slate-500">Director:</span> <span className="text-white font-medium">{movie.director}</span></div>
              <div><span className="text-slate-500">Cast:</span> <span className="text-cyan-300 font-medium">{movie.cast?.join(', ')}</span></div>
            </div>
          </div>

          {/* Date Picker & Format Mode Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            {/* Date Picker */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <div className="flex gap-2">
                {['Today', 'Tomorrow'].map(date => (
                  <button
                    key={date}
                    onClick={() => {
                      sound.playClick();
                      setSelectedDate(date);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedDate === date
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D vs 2D Toggle Switch */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 self-start sm:self-auto">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowTypeFilter('All');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  showTypeFilter === 'All'
                    ? 'bg-white/15 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Shows
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setShowTypeFilter('3D');
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  showTypeFilter === '3D'
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black shadow-md shadow-cyan-500/30'
                    : 'text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                <Glasses className="w-3.5 h-3.5" />
                <span>3D Shows Only</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setShowTypeFilter('2D');
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  showTypeFilter === '2D'
                    ? 'bg-gradient-to-r from-purple-400 to-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>2D Normal Shows</span>
              </button>
            </div>
          </div>

          {/* Showtimes Listings */}
          {loading ? (
            <div className="h-36 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* SECTION 1: 3D EXPERIENCES */}
              {(showTypeFilter === 'All' || showTypeFilter === '3D') && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/20 via-slate-900/60 to-blue-950/20 border border-cyan-500/30 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                        <Glasses className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-black text-white text-sm tracking-wide">
                          🕶️ 3D IMMERSIVE EXPERIENCES (IMAX 3D / RealD / 4DX)
                        </h3>
                        <p className="text-[11px] text-cyan-300 font-mono">
                          Stereoscopic 3D Laser projection • Sanitized 3D Glasses Provided (+₹30)
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 self-start sm:self-auto">
                      HFR 48FPS DEPTH
                    </span>
                  </div>

                  {shows3D.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-500">
                      No 3D screenings available for this title on {selectedDate}.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {shows3D.map(st => (
                        <button
                          key={st.id}
                          onClick={() => {
                            sound.playClick();
                            onSelectShowtime(st);
                          }}
                          className="group p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-300 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-black transition-all text-left cursor-pointer flex items-center justify-between shadow-md"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-black text-cyan-300 group-hover:text-black font-mono">
                                {st.time}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 group-hover:bg-black/20 text-cyan-200 group-hover:text-black font-bold">
                                {st.experience}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 group-hover:text-black mt-1">
                              {st.hall} • {st.sound}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-white group-hover:text-black block">
                              From ₹{st.priceTiers?.classic || 220}
                            </span>
                            <span className="text-[10px] text-cyan-400 group-hover:text-black font-semibold">
                              Select Seats →
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 2: 2D NORMAL SCREENINGS */}
              {(showTypeFilter === 'All' || showTypeFilter === '2D') && (
                <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white/10 text-slate-300 border border-white/15">
                        <Film className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm tracking-wide">
                          🎬 2D STANDARD SCREENINGS (Dolby Atmos 2D / 4K RGB Laser)
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Crystal clear high dynamic range master • No 3D glasses required
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 self-start sm:self-auto">
                      STANDARD 2D
                    </span>
                  </div>

                  {shows2D.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-500">
                      No 2D screenings available for this title on {selectedDate}.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {shows2D.map(st => (
                        <button
                          key={st.id}
                          onClick={() => {
                            sound.playClick();
                            onSelectShowtime(st);
                          }}
                          className="group p-3.5 rounded-xl bg-slate-950/80 border border-white/15 hover:border-white/50 hover:bg-white/10 transition-all text-left cursor-pointer flex items-center justify-between shadow-md"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-black text-white font-mono">
                                {st.time}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300 font-bold">
                                {st.experience}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">
                              {st.hall} • {st.sound}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-emerald-400 block">
                              From ₹{st.priceTiers?.classic || 170}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              Select Seats →
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

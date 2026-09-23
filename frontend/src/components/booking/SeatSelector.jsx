import React, { useState, useEffect } from 'react';
import CinemaHall3D from './CinemaHall3D';
import { api } from '../../services/api';
import { sound } from '../../services/soundEngine';
import { Box, Grid3X3, ArrowRight, ArrowLeft, Ticket, Glasses, ShieldCheck, AlertCircle } from 'lucide-react';

export default function SeatSelector({
  movie,
  showtime,
  onProceed,
  onBack
}) {
  const [seatsData, setSeatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [viewMode, setViewMode] = useState('3d'); // '3d' | '2d'
  const [errorMsg, setErrorMsg] = useState('');

  // 3D Glasses Option (for 3D shows)
  const is3D = showtime?.showType === '3D';
  const [needGlasses, setNeedGlasses] = useState(is3D);
  const glassesUnitFee = showtime?.glassesFee || 30;

  useEffect(() => {
    async function loadSeats() {
      if (!showtime?.id) return;
      try {
        setLoading(true);
        const data = await api.getShowtimeSeats(showtime.id);
        setSeatsData(data.seats || []);
      } catch (err) {
        console.error('Failed to load seats:', err);
        setErrorMsg('Could not fetch real-time seat status. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadSeats();
  }, [showtime]);

  const toggleSeat = (seatId) => {
    setErrorMsg('');
    const target = seatsData.find(s => s.id === seatId);
    if (!target || target.isBooked) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        sound.playError();
        setErrorMsg('Maximum 8 tickets per booking reached.');
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  // Calculations
  const selectedSeatObjects = seatsData.filter(s => selectedSeats.includes(s.id));
  const subtotal = selectedSeatObjects.reduce((sum, s) => sum + s.price, 0);
  const glassesCount = (is3D && needGlasses) ? selectedSeats.length : 0;
  const glassesAmount = glassesCount * glassesUnitFee;

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      sound.playError();
      setErrorMsg('Please select at least 1 seat to proceed.');
      return;
    }
    sound.playClick();
    onProceed({
      seats: selectedSeats,
      seatObjects: selectedSeatObjects,
      subtotal,
      glassesCount,
      glassesAmount,
      showType: showtime?.showType || '2D',
      format: showtime?.format || showtime?.experience || 'Standard'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  is3D
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/20'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                }`}
              >
                {is3D ? <Glasses className="w-3.5 h-3.5" /> : null}
                <span>{showtime?.experience || 'IMAX 3D Laser'}</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">{showtime?.hall}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">{movie?.title}</h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              📅 {showtime?.date} at <span className="text-cyan-400 font-bold">{showtime?.time}</span> • {showtime?.sound}
            </p>
          </div>
        </div>

        {/* View Switcher (3D WebGL vs 2D Plan) */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
          <button
            onClick={() => {
              sound.playClick();
              setViewMode('3d');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === '3d'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black shadow-lg shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>3D Interactive Hall</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setViewMode('2d');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === '2d'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black shadow-lg shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>2D Grid Plan</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Seat Selection Area */}
      {loading ? (
        <div className="h-[480px] rounded-2xl border border-white/10 bg-slate-900/40 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400 font-mono tracking-wider">CALIBRATING 3D AUDITORIUM MATRIX...</p>
        </div>
      ) : viewMode === '3d' ? (
        <CinemaHall3D
          seatsData={seatsData}
          selectedSeats={selectedSeats}
          onToggleSeat={toggleSeat}
          movieTitle={movie?.title || 'Feature Movie'}
          showType={showtime?.showType || '3D'}
          experience={showtime?.experience || 'IMAX 3D Laser'}
        />
      ) : (
        /* 2D Grid Plan View */
        <div className="p-6 md:p-8 rounded-3xl border border-white/10 bg-slate-950/80 shadow-2xl backdrop-blur-xl">
          {/* Curved Screen */}
          <div className="w-full flex flex-col items-center mb-10">
            <div className="w-3/4 max-w-xl h-2.5 rounded-t-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_25px_rgba(0,245,255,0.8)]" />
            <div className="text-[10px] text-cyan-400/80 font-mono tracking-widest uppercase mt-2">
              {is3D ? '🕶️ IMAX 3D CURVED SILVER SCREEN ALL EYES THIS WAY' : '🎬 2D RGB LASER MASTER SCREEN'}
            </div>
          </div>

          {/* Seat Grid Rows */}
          <div className="flex flex-col gap-3 items-center max-w-3xl mx-auto">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(rowLabel => {
              const rowSeats = seatsData.filter(s => s.row === rowLabel);
              const tier = rowSeats[0]?.tier || 'Classic';
              return (
                <div key={rowLabel} className="flex items-center gap-3">
                  <span className="w-6 font-mono text-xs font-bold text-slate-500 text-right">{rowLabel}</span>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {rowSeats.map(seat => {
                      const isSelected = selectedSeats.includes(seat.id);
                      return (
                        <button
                          key={seat.id}
                          disabled={seat.isBooked}
                          onClick={() => {
                            toggleSeat(seat.id);
                            if (isSelected) {
                              sound.playSeatDeselect();
                            } else {
                              sound.playSeatSelect(seat.tier);
                            }
                          }}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center justify-center border ${
                            seat.isBooked
                              ? 'bg-slate-900 border-slate-800 text-slate-700 cursor-not-allowed'
                              : isSelected
                              ? 'bg-cyan-400 text-black border-cyan-300 shadow-lg shadow-cyan-400/50 scale-105'
                              : tier === 'VIP'
                              ? 'bg-amber-950/40 border-amber-600/40 text-amber-300 hover:border-amber-400 hover:bg-amber-900/50'
                              : tier === 'Executive'
                              ? 'bg-sky-950/40 border-sky-600/40 text-sky-300 hover:border-sky-400 hover:bg-sky-900/50'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-700'
                          }`}
                        >
                          {seat.number}
                        </button>
                      );
                    })}
                  </div>
                  <span className="w-6 font-mono text-xs font-bold text-slate-500 text-left">{rowLabel}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-950/60 border border-amber-500/50" />
              <span className="text-amber-200">VIP Lounger (₹480)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-sky-950/60 border border-sky-500/50" />
              <span className="text-sky-200">Executive (₹340)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-800 border border-slate-600" />
              <span className="text-slate-300">Classic (₹220)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-cyan-400 shadow-sm shadow-cyan-400" />
              <span className="text-cyan-300 font-semibold">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-900 border border-slate-800" />
              <span className="text-slate-600">Reserved</span>
            </div>
          </div>
        </div>
      )}

      {/* 3D Glasses Add-on Option Banner (Only for 3D shows) */}
      {is3D && (
        <div className="mt-4 p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Glasses className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Sanitized High-Contrast 3D Glasses</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-mono">
                  +₹{glassesUnitFee} / seat
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Essential for IMAX 3D / RealD depth perception. Sanitized and packed for you at the entrance.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-black/60 px-3.5 py-2 rounded-xl border border-cyan-500/30">
            <input
              type="checkbox"
              checked={needGlasses}
              onChange={e => {
                sound.playClick();
                setNeedGlasses(e.target.checked);
              }}
              className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
            />
            <span className="text-xs font-bold text-cyan-300">
              {needGlasses ? 'Included' : 'Bring Own'}
            </span>
          </label>
        </div>
      )}

      {/* Sticky Bottom Action Drawer */}
      <div className="mt-6 p-4 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">
              Selected Seats: <span className="text-white font-mono font-bold">{selectedSeats.length} / 8</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              {selectedSeats.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No seats picked yet</span>
              ) : (
                selectedSeats.map(s => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40"
                  >
                    {s}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">
              Subtotal {glassesAmount > 0 ? `(incl. 3D glasses ₹${glassesAmount})` : ''}
            </div>
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              ₹{(subtotal + glassesAmount).toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={selectedSeats.length === 0}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all ${
              selectedSeats.length > 0
                ? 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-black shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-[1.02] cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Proceed to Snacks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

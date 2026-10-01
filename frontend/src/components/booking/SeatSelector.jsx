import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { sound } from '../../services/soundEngine';
import { ArrowLeft, Ticket, Glasses, AlertCircle, ArrowRight } from 'lucide-react';

function generateFallbackSeats(showtime) {
  const rows = [
    { row: 'A', tier: 'VIP Recliner', price: showtime?.priceTiers?.vip || 350, totalCols: 8 },
    { row: 'B', tier: 'VIP Recliner', price: showtime?.priceTiers?.vip || 350, totalCols: 8 },
    { row: 'C', tier: 'Executive', price: showtime?.priceTiers?.executive || 250, totalCols: 10 },
    { row: 'D', tier: 'Executive', price: showtime?.priceTiers?.executive || 250, totalCols: 10 },
    { row: 'E', tier: 'Executive', price: showtime?.priceTiers?.executive || 250, totalCols: 10 },
    { row: 'F', tier: 'Classic', price: showtime?.priceTiers?.classic || 150, totalCols: 10 },
    { row: 'G', tier: 'Classic', price: showtime?.priceTiers?.classic || 150, totalCols: 10 },
    { row: 'H', tier: 'Classic', price: showtime?.priceTiers?.classic || 150, totalCols: 10 }
  ];

  const booked = new Set(showtime?.bookedSeats || ['A3', 'A4', 'C5', 'C6']);
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

  return seats;
}

export default function SeatSelector({
  movie,
  showtime,
  onProceed,
  onBack
}) {
  const [seatsData, setSeatsData] = useState(() => generateFallbackSeats(showtime));
  const [loading, setLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // 3D Glasses Option (for 3D shows)
  const is3D = showtime?.showType === '3D';
  const [needGlasses, setNeedGlasses] = useState(is3D);
  const glassesUnitFee = showtime?.glassesFee || 30;

  useEffect(() => {
    async function loadSeats() {
      if (!showtime?.id) {
        setSeatsData(generateFallbackSeats(showtime));
        return;
      }
      try {
        setLoading(true);
        const data = await api.getShowtimeSeats(showtime.id);
        if (data?.seats && Array.isArray(data.seats) && data.seats.length > 0) {
          setSeatsData(data.seats);
        } else {
          setSeatsData(generateFallbackSeats(showtime));
        }
      } catch (err) {
        console.error('Failed to load seats:', err);
        setSeatsData(generateFallbackSeats(showtime));
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
      sound.playSeatDeselect();
    } else {
      if (selectedSeats.length >= 8) {
        sound.playError();
        setErrorMsg('Maximum 8 tickets per booking allowed.');
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
      sound.playSeatSelect(target.tier);
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Back to Movies"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                is3D ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-300'
              }`}>
                {showtime?.format || (is3D ? '3D Experience' : '2D Screening')}
              </span>
              <span className="text-xs text-slate-400 font-medium">{showtime?.hall || 'Audi 1'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">{movie?.title}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              📅 {showtime?.date} • Showtime: <strong className="text-rose-400">{showtime?.time}</strong>
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Standard 2D Interactive Seat Map (Like BookMyShow) */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#0d121f] shadow-xl">
        {/* Cinema Curved Screen Indicator */}
        <div className="w-full flex flex-col items-center mb-10">
          <div className="w-3/4 max-w-lg h-2 rounded-t-full bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
          <div className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase mt-2.5">
            SCREEN THIS WAY
          </div>
        </div>

        {/* Seat Grid Rows */}
        <div className="flex flex-col gap-3 items-center max-w-2xl mx-auto overflow-x-auto py-2">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(rowLabel => {
            const rowSeats = seatsData.filter(s => s.row === rowLabel);
            const tier = rowSeats[0]?.tier || 'Classic';
            const price = rowSeats[0]?.price || 150;

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
                        onClick={() => toggleSeat(seat.id)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center border cursor-pointer ${
                          seat.isBooked
                            ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30 scale-105 font-black'
                            : tier.includes('VIP')
                            ? 'bg-amber-950/40 border-amber-600/40 text-amber-300 hover:border-amber-400 hover:bg-amber-900/50'
                            : tier.includes('Executive')
                            ? 'bg-sky-950/40 border-sky-600/40 text-sky-300 hover:border-sky-400 hover:bg-sky-900/50'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-700'
                        }`}
                        title={`${seat.id} - ${seat.tier} (₹${seat.price})`}
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
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-950/60 border border-amber-500/50" />
            <span className="text-amber-200">VIP Recliner (₹{showtime?.priceTiers?.vip || 350})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-sky-950/60 border border-sky-500/50" />
            <span className="text-sky-200">Executive (₹{showtime?.priceTiers?.executive || 250})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-800 border border-slate-600" />
            <span className="text-slate-300">Classic (₹{showtime?.priceTiers?.classic || 150})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500 border border-emerald-400" />
            <span className="text-emerald-300 font-semibold">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-900 border border-slate-800 opacity-50" />
            <span className="text-slate-500">Booked</span>
          </div>
        </div>
      </div>

      {/* 3D Glasses Option Banner (Only for 3D shows) */}
      {is3D && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Glasses className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Include 3D Glasses</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                  +₹{glassesUnitFee} / seat
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Packed 3D glasses issued at cinema entrance. Uncheck if you bring your own.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-800">
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
              {needGlasses ? 'Included' : 'Skip'}
            </span>
          </label>
        </div>
      )}

      {/* Sticky Bottom Action Drawer */}
      <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">
              Selected Seats: <span className="text-white font-mono font-bold">{selectedSeats.length} / 8</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              {selectedSeats.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No seats selected</span>
              ) : (
                selectedSeats.map(s => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40"
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
              Total Amount {glassesAmount > 0 ? `(incl. glasses ₹${glassesAmount})` : ''}
            </div>
            <div className="text-2xl font-black text-rose-400">
              ₹{(subtotal + glassesAmount).toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={selectedSeats.length === 0}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              selectedSeats.length > 0
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30'
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

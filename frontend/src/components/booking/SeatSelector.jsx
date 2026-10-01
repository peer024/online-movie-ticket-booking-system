import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ArrowLeft, Ticket, AlertCircle, ArrowRight } from 'lucide-react';

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
    } else {
      if (selectedSeats.length >= 8) {
        setErrorMsg('Maximum 8 tickets per booking allowed.');
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  // Calculations
  const selectedSeatObjects = seatsData.filter(s => selectedSeats.includes(s.id));
  const subtotal = selectedSeatObjects.reduce((sum, s) => sum + s.price, 0);

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      setErrorMsg('Please select at least 1 seat to proceed.');
      return;
    }
    onProceed({
      seats: selectedSeats,
      seatObjects: selectedSeatObjects,
      subtotal,
      glassesCount: 0,
      glassesAmount: 0,
      showType: '2D',
      format: showtime?.format || showtime?.sound || 'Standard'
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-gray-900">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition-all cursor-pointer shadow-xs"
            title="Back to Movies"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                {showtime?.sound || 'Dolby Atmos'}
              </span>
              <span className="text-xs text-gray-500 font-medium">{showtime?.hall || 'Audi 1'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-1">{movie?.title}</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              📅 {showtime?.date} • Showtime: <strong className="text-rose-600">{showtime?.time}</strong>
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Standard 2D Interactive Seat Map */}
      <div className="p-6 sm:p-8 rounded-2xl border border-gray-200 bg-white shadow-xs">
        {/* Cinema Curved Screen Indicator */}
        <div className="w-full flex flex-col items-center mb-10">
          <div className="w-3/4 max-w-lg h-2 rounded-t-full bg-rose-500/70 shadow-sm" />
          <div className="text-[11px] text-gray-400 font-semibold tracking-wider uppercase mt-2.5">
            SCREEN THIS WAY
          </div>
        </div>

        {/* Seat Grid Rows */}
        <div className="flex flex-col gap-3 items-center max-w-2xl mx-auto overflow-x-auto py-2">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(rowLabel => {
            const rowSeats = seatsData.filter(s => s.row === rowLabel);
            const tier = rowSeats[0]?.tier || 'Classic';

            return (
              <div key={rowLabel} className="flex items-center gap-3">
                <span className="w-6 font-mono text-xs font-bold text-gray-400 text-right">{rowLabel}</span>
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
                            ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                            : isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-105 font-bold'
                            : tier.includes('VIP')
                            ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 hover:border-amber-300'
                            : tier.includes('Executive')
                            ? 'bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100 hover:border-sky-300'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                        }`}
                        title={`${seat.id} - ${seat.tier} (₹${seat.price})`}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
                </div>
                <span className="w-6 font-mono text-xs font-bold text-gray-400 text-left">{rowLabel}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-50 border border-amber-300" />
            <span className="text-gray-700">VIP Recliner (₹{showtime?.priceTiers?.vip || 350})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-sky-50 border border-sky-300" />
            <span className="text-gray-700">Executive (₹{showtime?.priceTiers?.executive || 250})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-50 border border-gray-300" />
            <span className="text-gray-700">Classic (₹{showtime?.priceTiers?.classic || 150})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-600 border border-emerald-600" />
            <span className="text-emerald-700 font-bold">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200 text-gray-300" />
            <span className="text-gray-400">Booked</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Drawer */}
      <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500">
              Selected Seats: <span className="text-gray-900 font-mono font-bold">{selectedSeats.length} / 8</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              {selectedSeats.length === 0 ? (
                <span className="text-xs text-gray-400 italic">No seats selected</span>
              ) : (
                selectedSeats.map(s => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200"
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
            <div className="text-[11px] text-gray-500 uppercase tracking-wider">
              Total Amount
            </div>
            <div className="text-2xl font-black text-rose-600">
              ₹{subtotal.toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={selectedSeats.length === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              selectedSeats.length > 0
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
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

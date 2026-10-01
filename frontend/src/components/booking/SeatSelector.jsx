import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ArrowLeft, Ticket, AlertCircle, ArrowRight } from 'lucide-react';

function generateAuthenticTheaterSeats(showtime) {
  // Matching TicketNew / Ram Muthuram Cinemas layout from user screenshot (Image 2)
  // Rows F to M: Premium (₹190)
  // Rows N to Y: Gold (₹150)
  const premiumRows = ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
  const goldRows = ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];

  const booked = new Set(showtime?.bookedSeats || [
    'F03', 'F04', 'G11', 'G12', 'H05', 'H06', 'J14', 'J15',
    'N11', 'N12', 'N13', 'O08', 'O09', 'R15', 'R16', 'T04', 'T05'
  ]);

  const seats = [];

  const createRowSeats = (rowLetter, tierName, price) => {
    // 24 seats per row with 3 blocks: Left (1-6), Center (7-18), Right (19-24)
    for (let c = 1; c <= 24; c++) {
      const numStr = c < 10 ? `0${c}` : `${c}`;
      const seatCode = `${rowLetter}${numStr}`;
      seats.push({
        id: seatCode,
        row: rowLetter,
        number: numStr,
        tier: tierName,
        price: price,
        isBooked: booked.has(seatCode),
        block: c <= 6 ? 'left' : c <= 18 ? 'center' : 'right'
      });
    }
  };

  premiumRows.forEach(r => createRowSeats(r, 'PREMIUM', showtime?.priceTiers?.executive || 190));
  goldRows.forEach(r => createRowSeats(r, 'GOLD', showtime?.priceTiers?.classic || 150));

  return seats;
}

export default function SeatSelector({
  movie,
  showtime,
  onProceed,
  onBack
}) {
  const [seatsData, setSeatsData] = useState(() => generateAuthenticTheaterSeats(showtime));
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const premiumRows = ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
  const goldRows = ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];

  const toggleSeat = (seatId) => {
    setErrorMsg('');
    const target = seatsData.find(s => s.id === seatId);
    if (!target || target.isBooked) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= 10) {
        setErrorMsg('Maximum 10 tickets per booking allowed.');
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const selectedSeatObjects = seatsData.filter(s => selectedSeats.includes(s.id));
  const subtotal = selectedSeatObjects.reduce((sum, s) => sum + s.price, 0);

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      setErrorMsg('Please select at least 1 seat to proceed.');
      return;
    }
    // Directly proceeds to Checkout (skipping snacks!)
    onProceed({
      seats: selectedSeats,
      seatObjects: selectedSeatObjects,
      subtotal,
      showType: '2D',
      format: showtime?.format || showtime?.sound || 'RAM - RGB ATMOS'
    });
  };

  const renderSeatRow = (rowLabel) => {
    const rowSeats = seatsData.filter(s => s.row === rowLabel);
    const leftBlock = rowSeats.filter(s => s.block === 'left');
    const centerBlock = rowSeats.filter(s => s.block === 'center');
    const rightBlock = rowSeats.filter(s => s.block === 'right');

    const renderBlock = (blockSeats) => (
      <div className="flex items-center gap-1 sm:gap-1.5">
        {blockSeats.map(seat => {
          const isSelected = selectedSeats.includes(seat.id);
          return (
            <button
              key={seat.id}
              disabled={seat.isBooked}
              onClick={() => toggleSeat(seat.id)}
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-[4px] text-[10px] sm:text-[11px] font-mono transition-all flex items-center justify-center cursor-pointer ${
                seat.isBooked
                  ? 'bg-gray-100 text-gray-300 border border-gray-200 cursor-not-allowed'
                  : isSelected
                  ? 'bg-emerald-600 text-white font-bold border border-emerald-600 shadow-xs'
                  : 'bg-white text-emerald-700 border border-emerald-500 hover:bg-emerald-50'
              }`}
              title={`${seat.id} - ${seat.tier} (₹${seat.price})`}
            >
              {seat.number}
            </button>
          );
        })}
      </div>
    );

    return (
      <div key={rowLabel} className="flex items-center gap-2 sm:gap-4 my-1">
        <span className="w-5 font-mono text-xs font-bold text-gray-500 text-right">{rowLabel}</span>
        
        {/* 3 Column Seating Structure with 2 Aisles */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Left Block (Seats 01-06) */}
          {renderBlock(leftBlock)}

          {/* Aisle 1 */}
          <div className="w-2 sm:w-4" />

          {/* Center Block (Seats 07-18) */}
          {renderBlock(centerBlock)}

          {/* Aisle 2 */}
          <div className="w-2 sm:w-4" />

          {/* Right Block (Seats 19-24) */}
          {renderBlock(rightBlock)}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 text-gray-900">
      {/* Header Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition-all cursor-pointer shadow-xs"
            title="Back to Shows"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                {showtime?.sound || 'RAM - RGB ATMOS'}
              </span>
              <span className="text-xs text-gray-500 font-medium">Audi / Screen 1</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mt-1">
              {movie?.title}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              📅 {showtime?.date} • Showtime: <strong className="text-rose-600">{showtime?.time}</strong>
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-[3px] border border-emerald-500 bg-white" />
            <span className="text-gray-600 text-[11px]">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-[3px] bg-emerald-600 border border-emerald-600" />
            <span className="text-emerald-700 font-bold text-[11px]">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-[3px] bg-gray-100 border border-gray-200" />
            <span className="text-gray-400 text-[11px]">Sold</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Theater Auditorium Container matching TicketNew / Ram Muthuram Cinemas */}
      <div className="p-4 sm:p-8 rounded-2xl border border-gray-200 bg-white shadow-xs overflow-x-auto">
        {/* Curved Screen Indicator */}
        <div className="w-full flex flex-col items-center mb-8">
          <div className="w-3/4 max-w-xl h-2 rounded-t-full bg-emerald-500/60 shadow-xs" />
          <div className="text-[11px] text-gray-400 font-semibold tracking-wider uppercase mt-2">
            All eyes this way please! Screen
          </div>
        </div>

        {/* Seating Layout Grid */}
        <div className="flex flex-col items-center min-w-[700px] mx-auto py-2">
          {/* Tier 1: Premium */}
          <div className="w-full text-center text-xs font-bold text-gray-500 uppercase tracking-widest my-3 py-1.5 border-b border-gray-100">
            ₹{showtime?.priceTiers?.executive || 190} PREMIUM
          </div>
          {premiumRows.map(rowLetter => renderSeatRow(rowLetter))}

          {/* Tier 2: Gold */}
          <div className="w-full text-center text-xs font-bold text-gray-500 uppercase tracking-widest mt-6 mb-3 py-1.5 border-b border-gray-100">
            ₹{showtime?.priceTiers?.classic || 150} GOLD
          </div>
          {goldRows.map(rowLetter => renderSeatRow(rowLetter))}
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
              Selected Seats ({selectedSeats.length}):
            </div>
            <div className="flex flex-wrap items-center gap-1 mt-0.5">
              {selectedSeats.length === 0 ? (
                <span className="text-xs text-gray-400 italic">Please tap on seats to choose</span>
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
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            <span>Proceed to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { CreditCard, QrCode, ShieldCheck, Tag, X, ArrowRight } from 'lucide-react';

export default function CheckoutModal({
  bookingInfo,
  onSuccess,
  onClose
}) {
  const {
    movie,
    showtime,
    seats,
    seatObjects,
    subtotal,
    snacks = [],
    snacksSubtotal = 0
  } = bookingInfo;

  const [customerName, setCustomerName] = useState('Alex Mercer');
  const [customerEmail, setCustomerEmail] = useState('alex.mercer@cinepass.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card'
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const grossTotal = subtotal + snacksSubtotal;
  const netTotal = Math.max(0, grossTotal - promoDiscount);

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'CINE50') {
      const discount = Math.min(100, Math.round(grossTotal * 0.5));
      setAppliedPromo('CINE50');
      setPromoDiscount(discount);
      setPromoMsg('🎉 50% Discount Applied (Max ₹100)!');
    } else if (code === 'BLOCKBUSTER') {
      setAppliedPromo('BLOCKBUSTER');
      setPromoDiscount(75);
      setPromoMsg('🎉 Flat ₹75 Movie voucher applied!');
    } else {
      setPromoMsg('❌ Invalid promo code. Try CINE50 or BLOCKBUSTER.');
    }
  };

  const handlePay = async () => {
    if (!customerName || !customerEmail) {
      setErrorMsg('Please enter your name and email to receive the ticket.');
      return;
    }

    try {
      setProcessing(true);
      setErrorMsg('');

      const bookingPayload = {
        movieId: movie.id,
        movieTitle: movie.title,
        showtimeId: showtime.id,
        showType: '2D',
        format: showtime.format || 'Standard',
        date: showtime.date,
        time: showtime.time,
        hall: showtime.hall,
        seats,
        seatTiers: seatObjects?.map(s => s.tier) || ['Classic'],
        ticketAmount: subtotal,
        glassesCount: 0,
        glassesAmount: 0,
        snacks,
        snacksAmount: snacksSubtotal,
        discount: promoDiscount,
        promoCode: appliedPromo || '',
        totalAmount: netTotal,
        paymentMethod: paymentMethod === 'upi' ? 'UPI (Google Pay / PhonePe)' : 'Debit / Credit Card',
        customerName,
        customerEmail,
        customerPhone
      };

      const result = await api.createBooking(bookingPayload);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      const finalBooking = result?.booking || (result?.id ? result : null) || {
        ...bookingPayload,
        id: `CP-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'Confirmed'
      };

      onSuccess(finalBooking);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Payment processing failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Confirm & Book Tickets</h2>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Order Summary Card */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 mb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">{movie.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {showtime.hall} • {showtime.experience || showtime.sound || 'Dolby Atmos'}
              </p>
              <p className="text-xs text-rose-600 font-semibold mt-1">
                📅 {showtime.date} at {showtime.time}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">Seats:</span>
              <div className="flex flex-wrap items-center gap-1 mt-0.5 justify-end">
                {seats.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-mono font-bold text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mt-4 pt-3 border-t border-gray-200 flex flex-col gap-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Ticket Subtotal ({seats.length} seats)</span>
              <span className="font-mono text-gray-900 font-semibold">₹{subtotal.toLocaleString()}</span>
            </div>
            {snacksSubtotal > 0 && (
              <div className="flex justify-between">
                <span>Concessions ({snacks.length} items)</span>
                <span className="font-mono text-amber-600 font-semibold">₹{snacksSubtotal.toLocaleString()}</span>
              </div>
            )}
            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promo Discount ({appliedPromo})</span>
                <span className="font-mono">-₹{promoDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
              <span>Total Payable Amount</span>
              <span className="text-lg font-bold text-rose-600 font-mono">₹{netTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Promo Code Box */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            <span>Have a Promo Code? (Use: CINE50, BLOCKBUSTER)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCodeInput}
              onChange={e => setPromoCodeInput(e.target.value)}
              placeholder="e.g. CINE50"
              className="flex-1 px-3.5 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-xs font-mono uppercase focus:border-rose-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all border border-gray-300 cursor-pointer"
            >
              Apply
            </button>
          </div>
          {promoMsg && (
            <p className={`text-xs mt-1.5 ${promoDiscount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {promoMsg}
            </p>
          )}
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Your Full Name</label>
            <input
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-xs focus:border-rose-500 focus:outline-none"
              placeholder="Full Name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              value={customerEmail}
              onChange={e => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-xs focus:border-rose-500 focus:outline-none"
              placeholder="name@email.com"
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-600 mb-2">Select Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                paymentMethod === 'upi'
                  ? 'bg-rose-50 border-rose-500 text-gray-900 shadow-xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-gray-900">UPI / QR</div>
                <div className="text-[10px] text-gray-500">GPay, PhonePe, Paytm</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                paymentMethod === 'card'
                  ? 'bg-rose-50 border-rose-500 text-gray-900 shadow-xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-gray-900">Card</div>
                <div className="text-[10px] text-gray-500">Debit / Credit Card</div>
              </div>
            </button>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full py-3.5 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {processing ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <span>Pay ₹{netTotal.toLocaleString()} & Book Tickets</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

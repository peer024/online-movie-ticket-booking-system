import React, { useState } from 'react';
import { api } from '../../services/api';
import { sound } from '../../services/soundEngine';
import confetti from 'canvas-confetti';
import { CreditCard, QrCode, ShieldCheck, Tag, X, CheckCircle, ArrowRight, Sparkles, Smartphone } from 'lucide-react';

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
    glassesCount = 0,
    glassesAmount = 0,
    showType = '2D',
    format = 'Standard',
    snacks,
    snacksSubtotal
  } = bookingInfo;

  const [customerName, setCustomerName] = useState('Alex Mercer');
  const [customerEmail, setCustomerEmail] = useState('alex.mercer@cineverse.io');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card'
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Card details
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9924');
  const [cardExp, setCardExp] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('784');

  const grossTotal = subtotal + glassesAmount + snacksSubtotal;
  const netTotal = Math.max(0, grossTotal - promoDiscount);

  const handleApplyPromo = () => {
    sound.playClick();
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'CINE50') {
      const discount = Math.min(150, Math.round(grossTotal * 0.5));
      setAppliedPromo('CINE50');
      setPromoDiscount(discount);
      setPromoMsg('🎉 50% Cyber Discount Applied (Max ₹150)!');
    } else if (code === 'BLOCKBUSTER') {
      setAppliedPromo('BLOCKBUSTER');
      setPromoDiscount(100);
      setPromoMsg('🎉 Flat ₹100 Blockbuster voucher applied!');
    } else if (code === 'VIPFREE') {
      setAppliedPromo('VIPFREE');
      setPromoDiscount(200);
      setPromoMsg('🎉 ₹200 VIP Premiere Credit applied!');
    } else {
      sound.playError();
      setPromoMsg('❌ Invalid promo code. Try CINE50, BLOCKBUSTER, or VIPFREE.');
    }
  };

  const handlePay = async () => {
    if (!customerName || !customerEmail) {
      sound.playError();
      setErrorMsg('Please enter your name and email to receive the digital pass.');
      return;
    }

    try {
      setProcessing(true);
      setErrorMsg('');
      sound.playClick();

      const bookingPayload = {
        movieId: movie.id,
        movieTitle: movie.title,
        showtimeId: showtime.id,
        showType,
        format,
        date: showtime.date,
        time: showtime.time,
        hall: showtime.hall,
        seats,
        seatTiers: seatObjects.map(s => s.tier),
        ticketAmount: subtotal,
        glassesCount,
        glassesAmount,
        snacks,
        snacksAmount: snacksSubtotal,
        discount: promoDiscount,
        promoCode: appliedPromo || '',
        totalAmount: netTotal,
        paymentMethod: paymentMethod === 'upi' ? 'UPI / Quantum QR' : 'CyberCard Titanium',
        customerName,
        customerEmail,
        customerPhone
      };

      const result = await api.createBooking(bookingPayload);

      // Play victory fanfare sound
      try { sound.playFanfare(); } catch(e) {}

      // Launch golden & cyan confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f5ff', '#8b5cf6', '#f59e0b', '#10b981']
        });
      } catch (e) {}

      const finalBooking = result?.booking || (result?.id ? result : null) || {
        ...bookingPayload,
        id: `CV-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'Confirmed'
      };

      onSuccess(finalBooking);
    } catch (err) {
      sound.playError();
      console.error(err);
      setErrorMsg(err.message || 'Payment processing failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-cyan-500/30 bg-[#0b0f19] p-6 md:p-8 shadow-2xl shadow-cyan-950/60 my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>256-Bit Encrypted High-Speed Checkout</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Confirm & Book Tickets</h2>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Order Summary Card */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base">{movie.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {showtime.hall} • {showtime.experience}
              </p>
              <p className="text-xs text-cyan-400 font-mono mt-1">
                📅 {showtime.date} at {showtime.time}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Seats:</span>
              <div className="flex items-center gap-1 mt-0.5 justify-end">
                {seats.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Ticket Subtotal ({seats.length} seats)</span>
              <span className="font-mono text-white">₹{subtotal.toLocaleString()}</span>
            </div>
            {glassesAmount > 0 && (
              <div className="flex justify-between text-cyan-300">
                <span>Sanitized 3D Glasses ({glassesCount}x ₹30)</span>
                <span className="font-mono">₹{glassesAmount.toLocaleString()}</span>
              </div>
            )}
            {snacksSubtotal > 0 && (
              <div className="flex justify-between">
                <span>Gourmet Concessions ({snacks.length} items)</span>
                <span className="font-mono text-amber-300">₹{snacksSubtotal.toLocaleString()}</span>
              </div>
            )}
            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Promo Discount ({appliedPromo})</span>
                <span className="font-mono">-₹{promoDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
              <span>Total Payable Amount</span>
              <span className="text-lg font-black text-cyan-400 font-mono">₹{netTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Promo Code Box */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Have a Promo Code? (Try: CINE50, BLOCKBUSTER, VIPFREE)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCodeInput}
              onChange={e => setPromoCodeInput(e.target.value)}
              placeholder="e.g. CINE50"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono uppercase focus:border-cyan-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-black text-slate-200 text-xs font-bold transition-all border border-white/10"
            >
              Apply
            </button>
          </div>
          {promoMsg && (
            <p className={`text-xs mt-1.5 ${promoDiscount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {promoMsg}
            </p>
          )}
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Your Full Name</label>
            <input
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email (Ticket sent here)</label>
            <input
              type="email"
              value={customerEmail}
              onChange={e => setCustomerEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
              placeholder="name@email.com"
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-slate-400 mb-2">Select Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setPaymentMethod('upi');
              }}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                paymentMethod === 'upi'
                  ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-lg shadow-cyan-950/40'
                  : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs">Instant UPI / QR</div>
                <div className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setPaymentMethod('card');
              }}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                paymentMethod === 'card'
                  ? 'bg-purple-500/10 border-purple-400 text-white shadow-lg shadow-purple-950/40'
                  : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs">CyberCard Chip</div>
                <div className="text-[10px] text-slate-400">Visa, Mastercard, Amex</div>
              </div>
            </button>
          </div>
        </div>

        {/* Simulated Payment Trigger */}
        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-black shadow-xl shadow-cyan-500/40 hover:shadow-cyan-400/60 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {processing ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
              <span>Verifying High-Speed Payment Matrix...</span>
            </>
          ) : (
            <>
              <span>Authorize & Pay ₹{netTotal.toLocaleString()}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

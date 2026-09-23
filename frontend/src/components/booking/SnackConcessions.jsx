import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { sound } from '../../services/soundEngine';
import { Utensils, Plus, Minus, ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';

export default function SnackConcessions({
  onProceed,
  onBack,
  ticketSubtotal = 0,
  selectedSeatsCount = 0
}) {
  const [snacks, setSnacks] = useState([]);
  const [cart, setCart] = useState({}); // { snackId: quantity }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSnacks() {
      try {
        setLoading(true);
        const data = await api.getSnacks();
        setSnacks(data);
      } catch (err) {
        console.error('Failed to load snacks:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSnacks();
  }, []);

  const updateQuantity = (id, delta) => {
    sound.playClick();
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  // Calculations
  const cartItems = snacks
    .filter(s => cart[s.id] > 0)
    .map(s => ({
      id: s.id,
      name: s.name,
      price: s.price,
      qty: cart[s.id],
      total: s.price * cart[s.id]
    }));

  const snacksSubtotal = cartItems.reduce((sum, item) => sum + item.total, 0);

  const handleContinue = () => {
    sound.playClick();
    onProceed({
      snacks: cartItems,
      snacksSubtotal
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                GOURMET CINEMA DINING
              </span>
              <span className="text-xs text-slate-400">Delivered directly to your seat</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              Add Concessions & Refreshments
            </h1>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="text-xs text-slate-400 hover:text-cyan-400 font-semibold underline underline-offset-4 cursor-pointer"
        >
          Skip to Checkout →
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {snacks.map(snack => {
            const qty = cart[snack.id] || 0;
            return (
              <div
                key={snack.id}
                className={`p-5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between ${
                  qty > 0
                    ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-500/50 shadow-xl shadow-cyan-950/40'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                {snack.isBestSeller && (
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-black uppercase tracking-wider shadow-md">
                    ★ Best Seller
                  </span>
                )}

                <div>
                  <div className="text-4xl mb-3">{snack.image}</div>
                  <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">{snack.category}</div>
                  <h3 className="text-base font-bold text-white mt-1 leading-snug">{snack.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{snack.size} • {snack.calories}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-lg font-black text-white">
                    ₹{snack.price}
                  </div>

                  {qty === 0 ? (
                    <button
                      onClick={() => updateQuantity(snack.id, 1)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-black text-slate-200 text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 bg-black/60 px-2 py-1 rounded-xl border border-cyan-500/40">
                      <button
                        onClick={() => updateQuantity(snack.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-bold text-cyan-300 text-sm">{qty}</span>
                      <button
                        onClick={() => updateQuantity(snack.id, 1)}
                        className="w-7 h-7 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky Bottom Order Summary */}
      <div className="mt-8 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">
              Snacks in Cart: <span className="text-white font-bold">{cartItems.reduce((s, i) => s + i.qty, 0)} items</span>
            </div>
            <div className="text-xs text-slate-400">
              Tickets ({selectedSeatsCount}): <span className="text-slate-200">₹{ticketSubtotal.toLocaleString()}</span>
              {snacksSubtotal > 0 && <span> + Snacks: <span className="text-amber-400 font-semibold">₹{snacksSubtotal.toLocaleString()}</span></span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Total Payable</div>
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400">
              ₹{(ticketSubtotal + snacksSubtotal).toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/30 hover:shadow-amber-400/50 hover:scale-[1.02] cursor-pointer transition-all"
          >
            <span>Proceed to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Utensils, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';

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
    onProceed({
      snacks: cartItems,
      snacksSubtotal
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold border border-rose-200">
                Cinema Snacks & Refreshments
              </span>
              <span className="text-xs text-gray-500">Delivered directly to your seat</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
              Add Concessions
            </h1>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline underline-offset-4 cursor-pointer"
        >
          Skip to Payment →
        </button>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-rose-600 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {snacks.map(snack => {
            const qty = cart[snack.id] || 0;
            return (
              <div
                key={snack.id}
                className={`p-5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between bg-white ${
                  qty > 0
                    ? 'border-rose-500 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 shadow-xs'
                }`}
              >
                {snack.isBestSeller && (
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    ★ Best Seller
                  </span>
                )}

                <div>
                  <div className="text-4xl mb-3">{snack.image}</div>
                  <div className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">{snack.category}</div>
                  <h3 className="text-base font-bold text-gray-900 mt-1 leading-snug">{snack.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{snack.size} • {snack.calories}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-900">
                    ₹{snack.price}
                  </div>

                  {qty === 0 ? (
                    <button
                      onClick={() => updateQuantity(snack.id, 1)}
                      className="px-4 py-1.5 rounded-lg bg-gray-50 hover:bg-rose-50 hover:text-rose-600 text-gray-700 text-xs font-bold transition-all border border-gray-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg border border-gray-300">
                      <button
                        onClick={() => updateQuantity(snack.id, -1)}
                        className="w-6 h-6 rounded bg-white hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-gray-900 text-xs px-1">{qty}</span>
                      <button
                        onClick={() => updateQuantity(snack.id, 1)}
                        className="w-6 h-6 rounded bg-rose-600 text-white hover:bg-rose-700 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
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
      <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500">
              Snacks in Cart: <span className="text-gray-900 font-bold">{cartItems.reduce((s, i) => s + i.qty, 0)} items</span>
            </div>
            <div className="text-xs text-gray-600">
              Tickets ({selectedSeatsCount}): <span className="text-gray-900 font-medium">₹{ticketSubtotal.toLocaleString()}</span>
              {snacksSubtotal > 0 && <span> + Snacks: <span className="text-rose-600 font-bold">₹{snacksSubtotal.toLocaleString()}</span></span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <div className="text-[11px] text-gray-500 uppercase tracking-wider">Total Payable</div>
            <div className="text-2xl font-black text-rose-600">
              ₹{(ticketSubtotal + snacksSubtotal).toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer transition-all"
          >
            <span>Proceed to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

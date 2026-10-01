import React from 'react';
import { Film, Shield, Flame } from 'lucide-react';

export default function Navbar({
  currentView,
  onNavigate,
  isAdmin,
  onToggleAdmin,
  activeFilter,
  onFilterChange
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            onNavigate('home');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shadow-sm">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 font-sans">
                Cine<span className="text-rose-600">Pass</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-[10px] font-semibold text-rose-600 uppercase tracking-wider">
                Cinemas
              </span>
            </div>
            <div className="text-[11px] text-gray-500 font-medium">
              Online Movie Ticket Booking System
            </div>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <nav className="hidden sm:flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200 text-xs font-semibold">
          <button
            onClick={() => onFilterChange('all')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-rose-600 text-white shadow-sm font-bold'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>All Movies</span>
          </button>

          <button
            onClick={() => onFilterChange('tamil')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeFilter === 'tamil'
                ? 'bg-amber-500 text-white shadow-sm font-bold'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <span>தமிழ் Movies</span>
          </button>

          <button
            onClick={() => onFilterChange('dubbed')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeFilter === 'dubbed'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <span>தமிழ் Dubbed</span>
          </button>
        </nav>

        {/* Right Section: Admin Portal Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAdmin}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              isAdmin
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-xs'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">{isAdmin ? 'Exit Admin Panel' : 'Admin Portal'}</span>
            <span className="sm:hidden">{isAdmin ? 'Exit' : 'Admin'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

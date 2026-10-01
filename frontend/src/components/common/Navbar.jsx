import React, { useState } from 'react';
import { sound } from '../../services/soundEngine';
import { Film, Volume2, VolumeX, Shield, Glasses, Flame } from 'lucide-react';

export default function Navbar({
  currentView,
  onNavigate,
  isAdmin,
  onToggleAdmin,
  activeFilter,
  onFilterChange
}) {
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0e17]/95 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            sound.playClick();
            onNavigate('home');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center p-0.5 shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0a0e17] rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                Cine<span className="text-rose-500">Pass</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-[10px] font-medium text-rose-400">
                Cinemas
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Online Movie Ticket Booking System
            </div>
          </div>
        </div>

        {/* Quick Filter Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              sound.playClick();
              onFilterChange('all');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>All Movies</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onFilterChange('tamil');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeFilter === 'tamil'
                ? 'bg-amber-500 text-black shadow-sm font-bold'
                : 'text-amber-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>தமிழ் Movies</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onFilterChange('3d');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeFilter === '3d'
                ? 'bg-cyan-500 text-black shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Glasses className="w-3.5 h-3.5" />
            <span>3D Shows</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onFilterChange('2d');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeFilter === '2d'
                ? 'bg-purple-500 text-white shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>2D Regular</span>
          </button>
        </nav>

        {/* Right Section: Sound Toggle + Admin Portal Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Admin Portal Button */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleAdmin();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
              isAdmin
                ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">{isAdmin ? 'Exit Admin' : 'Admin Portal'}</span>
            <span className="sm:hidden">{isAdmin ? 'Exit' : 'Admin'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

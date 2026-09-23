import React, { useState } from 'react';
import { sound } from '../../services/soundEngine';
import { Film, Volume2, VolumeX, Shield, Glasses, Sparkles, Flame } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            sound.playClick();
            onNavigate('home');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-purple-600 flex items-center justify-center p-0.5 shadow-xl shadow-cyan-500/30 group-hover:shadow-cyan-400/60 transition-all">
            <div className="w-full h-full bg-[#07090e] rounded-[14px] flex items-center justify-center">
              <Film className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
                CINE<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">VERSE</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-400/20 border border-cyan-400/40 text-[10px] font-mono font-black text-cyan-300">
                3D
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 tracking-wider">
              QUANTUM CINEMA SYSTEM
            </div>
          </div>
        </div>

        {/* Quick Filter Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 text-xs font-bold">
          <button
            onClick={() => {
              sound.playClick();
              onFilterChange('all');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
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
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'tamil'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md shadow-amber-500/30'
                : 'text-amber-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-xs">🔥 தமிழ் Kollywood</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onFilterChange('3d');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === '3d'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black shadow-md shadow-cyan-500/30'
                : 'text-cyan-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Glasses className="w-3.5 h-3.5" />
            <span>🕶️ 3D Shows</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onFilterChange('2d');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === '2d'
                ? 'bg-gradient-to-r from-purple-400 to-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>🎬 2D Normal</span>
          </button>
        </nav>

        {/* Right Audio Visualizer + Mute + Admin Toggle */}
        <div className="flex items-center gap-3">
          {/* Animated Audio Visualizer Bar */}
          <div
            onClick={handleToggleSound}
            className={`flex items-center gap-2 p-2 px-3 rounded-xl border transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-sm shadow-cyan-500/20'
            }`}
            title={isMuted ? 'Audio FX Muted (Click to enable)' : 'Cinema Audio Synthesizer Active'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <>
                <Volume2 className="w-4 h-4 animate-pulse" />
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.8s_infinite]" style={{ height: '60%' }} />
                  <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.6s_infinite]" style={{ height: '100%' }} />
                  <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.9s_infinite]" style={{ height: '40%' }} />
                  <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.7s_infinite]" style={{ height: '80%' }} />
                </div>
              </>
            )}
          </div>

          {/* Admin Switcher */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleAdmin();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              isAdmin
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg shadow-purple-950/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{isAdmin ? 'Exit Admin Mode' : 'Admin Portal'}</span>
            <span className="sm:hidden">{isAdmin ? 'Exit' : 'Admin'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

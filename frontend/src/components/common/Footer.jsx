import React from 'react';
import { Film, Sparkles, Shield, Heart, Code2, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#04060a] pt-14 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-cyan-400" />
              <span className="font-display font-black text-white text-base">
                CINE<span className="text-cyan-400">VERSE</span> 3D
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              The world's first WebGL-accelerated 3D cinema ticketing and theater management engine. Built for ultimate theatrical immersion.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Premium Formats</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>IMAX 3D Laser & HFR 48fps</li>
              <li>Dolby Cinema 2D & 64-Ch Atmos</li>
              <li>4DX Environmental Motion</li>
              <li>ScreenX 270° Panoramic</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Theater Locations</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>CineVerse CyberPlex, Velachery, Chennai</li>
              <li>Luxe IMAX Grand, Express Avenue</li>
              <li>Palazzo Dolby Screen, Vadapalani</li>
              <li>PVR VR Mall Superplex, Anna Nagar</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Core Technology</h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Three.js WebGL 3D Auditorium</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Web Audio Synthesizer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Express Real-Time Engine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prominent Developer Showcase Badge */}
        <div className="my-8 p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-[#0d1322] to-slate-950 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full bg-[#07090e] rounded-[14px] flex items-center justify-center text-cyan-400">
                <Code2 className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="text-[11px] text-cyan-400 font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>Project Credits & Architecture</span>
              </div>
              <div className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                Designed & Developed by{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-400 font-display">
                  Kombaiya & Ashik Chandru
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Engineered with custom WebGL 3D spatial auditorium shaders, procedural lighting, and high-performance cinema reservation architecture.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
              v2.5 High-Tech Edition
            </span>
          </div>
        </div>

        {/* Copyright & Signoff */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © 2026 CineVerse 3D Systems. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>by</span>
            <span className="font-bold text-white">Kombaiya & Ashik Chandru</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

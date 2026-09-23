import React, { useRef, useState } from 'react';
import { Sparkles, Cpu, Award, Code2, ShieldCheck, Heart, Star, Compass } from 'lucide-react';
import { sound } from '../../services/soundEngine';

export default function DeveloperCard3D() {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, shineX, shineY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto my-12 px-4">
      {/* 3D Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => sound.playClick()}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out'
        }}
        className="relative group rounded-3xl p-8 sm:p-10 overflow-hidden cursor-pointer shadow-2xl transition-all duration-300 border-2 border-amber-400/40 bg-gradient-to-br from-[#0c1220] via-[#080d18] to-[#04060c]"
      >
        {/* Holographic Glitter Shimmer Foil Layer */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-70 group-hover:opacity-100 z-10"
          style={{
            background: `radial-gradient(circle at ${tilt.shineX}% ${tilt.shineY}%, rgba(255, 215, 0, 0.22) 0%, rgba(0, 245, 255, 0.18) 35%, rgba(139, 92, 246, 0.15) 60%, transparent 80%)`
          }}
        />

        {/* Animated Sparkling Stars Background */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <span className="absolute top-4 left-10 w-2 h-2 rounded-full bg-amber-300 animate-ping" />
          <span className="absolute top-12 right-20 w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
          <span className="absolute bottom-6 left-1/4 w-2 h-2 rounded-full bg-yellow-200 animate-ping" style={{ animationDuration: '2.5s' }} />
          <span className="absolute bottom-12 right-12 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDuration: '3s' }} />
          <span className="absolute top-1/2 left-8 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="absolute top-1/3 right-8 w-2 h-2 rounded-full bg-purple-400 animate-ping" style={{ animationDuration: '3.5s' }} />
        </div>

        {/* Glowing Top Rainbow Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-cyan-400 to-purple-500 hologram-shimmer" />

        {/* Card Content (Preserve 3D depth) */}
        <div className="relative z-20" style={{ transform: 'translateZ(30px)' }}>
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/20">
                <Award className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>MASTER ARCHITECTS & DEVELOPERS</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  CineVerse 3D Core Engineering
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-cyan-500/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold">
                ★ CERTIFIED CREATORS ★
              </span>
            </div>
          </div>

          {/* Two Names Glittering Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {/* Creator 1: Kombaiya */}
            <div
              className="relative rounded-2xl p-6 bg-gradient-to-br from-amber-950/30 via-slate-900/60 to-slate-950/80 border border-amber-400/40 shadow-xl group-hover:border-amber-300 transition-all duration-300"
              style={{ transform: 'translateZ(20px)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/40 flex items-center justify-center">
                    <div className="w-full h-full bg-[#080d18] rounded-[14px] flex items-center justify-center font-black text-amber-400 text-xl font-display">
                      K
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                      Lead Creator
                    </div>
                    <div className="text-2xl font-black text-white tracking-tight font-display drop-shadow-sm">
                      Kombaiya
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
                  PRO VIP
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-500/20 text-xs text-slate-300 leading-relaxed">
                Lead Spatial & 3D WebGL Architect. Designed the interactive curved IMAX auditorium, volumetric light projection shaders, and first-person seat POV engine.
              </div>
            </div>

            {/* Creator 2: Ashik Chandru */}
            <div
              className="relative rounded-2xl p-6 bg-gradient-to-br from-cyan-950/30 via-slate-900/60 to-slate-950/80 border border-cyan-400/40 shadow-xl group-hover:border-cyan-300 transition-all duration-300"
              style={{ transform: 'translateZ(20px)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/40 flex items-center justify-center">
                    <div className="w-full h-full bg-[#080d18] rounded-[14px] flex items-center justify-center font-black text-cyan-400 text-xl font-display">
                      AC
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      Lead Creator
                    </div>
                    <div className="text-2xl font-black text-white tracking-tight font-display drop-shadow-sm">
                      Ashik Chandru
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 text-[10px] font-mono font-bold">
                  PRO VIP
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-cyan-500/20 text-xs text-slate-300 leading-relaxed">
                Lead Full-Stack Experience & UI/UX Engineer. Engineered the high-speed booking pipeline, Web Audio sound synthesis, holographic pass generator, and real-time theater control system.
              </div>
            </div>
          </div>

          {/* Footer Signature Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Official Release v2.5 • Verified Signature Authenticated</span>
            </div>

            <div className="text-amber-300 font-bold text-sm tracking-wide">
              Designed & Developed by Kombaiya & Ashik Chandru
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

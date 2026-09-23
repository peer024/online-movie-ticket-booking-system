import React, { useRef, useState } from 'react';
import { sound } from '../../services/soundEngine';
import { Star, Play, Ticket, Clock, Glasses, Film } from 'lucide-react';

export default function MovieCard({
  movie,
  onSelectMovie,
  onOpenTrailer
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glossX: 50, glossY: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max 10 deg rotation
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    const glossX = (x / rect.width) * 100;
    const glossY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glossX, glossY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glossX: 50, glossY: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: 'transform 0.15s ease-out'
      }}
      className="group relative rounded-3xl overflow-hidden bg-slate-900/70 border border-white/10 hover:border-cyan-500/60 transition-colors duration-300 hover:shadow-2xl hover:shadow-cyan-950/60 flex flex-col justify-between"
    >
      {/* Specular gloss reflection layer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
        style={{
          background: `radial-gradient(circle at ${tilt.glossX}% ${tilt.glossY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`
        }}
      />

      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5">
            {movie.isTamil && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/90 text-black text-[10px] font-black tracking-wider uppercase shadow-md">
                தமிழ்
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-bold">
              {movie.certificate}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md border border-amber-500/40 px-2 py-0.5 rounded-md text-amber-300 font-bold text-xs shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.rating}</span>
          </div>
        </div>

        {/* 3D Experience Flag Tag */}
        {movie.has3D && (
          <div className="absolute top-11 left-3 z-10">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-black text-[9px] font-black tracking-wider uppercase shadow-lg shadow-cyan-500/40 flex items-center gap-1">
              <Glasses className="w-3 h-3" />
              <span>3D Available</span>
            </span>
          </div>
        )}

        {/* Hover Trailer Overlay Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              onOpenTrailer(movie);
            }}
            className="w-13 h-13 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-xl shadow-cyan-400/50 hover:scale-110 transition-transform cursor-pointer"
            title="Watch Official Trailer"
          >
            <Play className="w-6 h-6 fill-black ml-0.5" />
          </button>
        </div>

        {/* Bottom format pill */}
        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 z-10">
          {movie.formats?.slice(0, 2).map(f => (
            <span
              key={f}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold backdrop-blur-md ${
                f.includes('3D')
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                  : 'bg-black/80 text-slate-300 border border-white/20'
              }`}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{movie.duration}</span>
            <span>•</span>
            <span className="truncate">{movie.language.split('/')[0]}</span>
          </div>

          <h3 className="font-black text-white text-base leading-snug group-hover:text-cyan-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          {movie.tamilTitle && (
            <p className="text-[11px] text-cyan-300 font-medium line-clamp-1 mt-0.5">
              {movie.tamilTitle}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genre?.slice(0, 2).map(g => (
              <span key={g} className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <button
            onClick={() => {
              sound.playClick();
              onSelectMovie(movie);
            }}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-600 hover:text-black text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10 hover:border-transparent hover:shadow-lg hover:shadow-cyan-500/30"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Tickets (3D / 2D)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

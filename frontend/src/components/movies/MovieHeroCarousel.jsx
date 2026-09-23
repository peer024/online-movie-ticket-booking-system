import React, { useState, useEffect } from 'react';
import { sound } from '../../services/soundEngine';
import { Play, Ticket, Star, Sparkles, ChevronLeft, ChevronRight, Shield, Award } from 'lucide-react';

export default function MovieHeroCarousel({
  movies = [],
  onSelectMovie,
  onOpenTrailer
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredMovies = movies.filter(m => m.featured).length > 0
    ? movies.filter(m => m.featured)
    : movies;

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!featuredMovies.length) return null;
  const currentMovie = featuredMovies[currentIndex];

  const handlePrev = () => {
    sound.playClick();
    setCurrentIndex(prev => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const handleNext = () => {
    sound.playClick();
    setCurrentIndex(prev => (prev + 1) % featuredMovies.length);
  };

  return (
    <div className="relative w-full h-[520px] md:h-[600px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
      {/* Background Banner with Parallax / Fade */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out transform scale-105"
        style={{
          backgroundImage: `url('${currentMovie.bannerUrl}')`,
          filter: 'brightness(0.4) contrast(1.15)'
        }}
      />

      {/* Cyber Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-[#07090e]/70 to-transparent" />

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-12 z-10">
        <div className="max-w-2xl space-y-4">
          {/* Formats and Cert Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-wider uppercase">
              ★ PREMIERE EXPERIENCE
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white text-xs font-bold border border-white/15">
              {currentMovie.certificate}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {currentMovie.duration} • {currentMovie.language}
            </span>
          </div>

          {/* Title & Tagline */}
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
              {currentMovie.title}
            </h1>
            <p className="text-base md:text-lg text-cyan-300 font-medium italic mt-2">
              "{currentMovie.tagline}"
            </p>
          </div>

          {/* Ratings & Tags */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-xl text-amber-300 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{currentMovie.rating} / 10</span>
              <span className="text-xs text-amber-400/70 font-normal">({currentMovie.votes})</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {currentMovie.genre?.map(g => (
                <span
                  key={g}
                  className="px-2.5 py-0.5 rounded-lg bg-slate-900/80 border border-white/10 text-slate-300 text-xs font-medium"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-xs md:text-sm text-slate-300 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-xl">
            {currentMovie.synopsis}
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                onSelectMovie(currentMovie);
              }}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-black font-black text-sm shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/60 hover:scale-105 transition-all cursor-pointer"
            >
              <Ticket className="w-5 h-5" />
              <span>BOOK 3D TICKETS</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenTrailer(currentMovie);
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Trailer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide Navigation Buttons */}
      <div className="absolute bottom-6 right-6 md:right-12 flex items-center gap-2 z-20">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full bg-black/60 hover:bg-cyan-500 hover:text-black text-white border border-white/15 transition-all backdrop-blur-md cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5 px-2">
          {featuredMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.playClick();
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'w-8 bg-cyan-400 shadow-md shadow-cyan-400' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-black/60 hover:bg-cyan-500 hover:text-black text-white border border-white/15 transition-all backdrop-blur-md cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

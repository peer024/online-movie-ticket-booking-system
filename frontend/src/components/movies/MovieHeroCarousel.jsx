import React, { useState, useEffect } from 'react';
import { Play, Ticket, Star, ChevronLeft, ChevronRight } from 'lucide-react';

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
    }, 7000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!featuredMovies.length) return null;
  const currentMovie = featuredMovies[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % featuredMovies.length);
  };

  return (
    <div className="relative w-full h-[450px] md:h-[500px] overflow-hidden rounded-2xl border border-gray-200 shadow-md bg-gray-900">
      {/* Background Banner */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out transform scale-102"
        style={{
          backgroundImage: `url('${currentMovie.bannerUrl}')`,
          filter: 'brightness(0.4) contrast(1.1)'
        }}
      />

      {/* Gentle Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-end pb-10 z-10">
        <div className="max-w-2xl space-y-3.5">
          {/* Cert & Duration Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-rose-600 text-white text-xs font-bold uppercase tracking-wider">
              Now Showing
            </span>
            <span className="px-2 py-0.5 rounded bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
              {currentMovie.certificate}
            </span>
            <span className="text-xs text-gray-200 font-medium">
              {currentMovie.duration} • {currentMovie.language}
            </span>
          </div>

          {/* Title & Tagline */}
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {currentMovie.title}
            </h1>
            <p className="text-sm md:text-base text-gray-300 font-normal italic mt-1">
              "{currentMovie.tagline}"
            </p>
          </div>

          {/* Ratings & Genres */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 px-2.5 py-1 rounded-lg text-amber-300 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{currentMovie.rating} / 10</span>
              <span className="text-amber-200/70 font-normal">({currentMovie.votes})</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {currentMovie.genre?.map(g => (
                <span
                  key={g}
                  className="px-2.5 py-0.5 rounded bg-white/10 text-gray-200 text-xs font-medium"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-xs md:text-sm text-gray-300 line-clamp-2 leading-relaxed max-w-xl">
            {currentMovie.synopsis}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectMovie(currentMovie)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Tickets</span>
            </button>

            <button
              onClick={() => onOpenTrailer(currentMovie)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-sm backdrop-blur-xs border border-white/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Trailer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide Navigation Buttons */}
      <div className="absolute bottom-6 right-6 md:right-10 flex items-center gap-2 z-20">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-black/60 hover:bg-white hover:text-black text-white transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5 px-1.5">
          {featuredMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'w-6 bg-rose-500' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-black/60 hover:bg-white hover:text-black text-white transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

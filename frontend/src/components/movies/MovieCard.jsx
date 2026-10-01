import React from 'react';
import { Star, Play, Ticket, Clock } from 'lucide-react';

export default function MovieCard({
  movie,
  onSelectMovie,
  onOpenTrailer
}) {
  return (
    <div className="group rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-100">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1">
            {movie.isTamil && (
              <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                தமிழ்
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
              {movie.certificate}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-amber-300 font-bold text-xs shadow-xs">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{movie.rating}</span>
          </div>
        </div>

        {/* Hover Trailer Overlay Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenTrailer(movie);
            }}
            className="w-12 h-12 rounded-full bg-white text-rose-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
            title="Watch Official Trailer"
          >
            <Play className="w-5 h-5 fill-rose-600 ml-0.5" />
          </button>
        </div>

        {/* Bottom format pill */}
        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 z-10 pointer-events-none">
          {movie.formats?.slice(0, 2).map(f => (
            <span
              key={f}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-black/70 text-gray-200"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col justify-between flex-1 bg-white">
        <div>
          <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-rose-500" />
            <span>{movie.duration}</span>
            <span>•</span>
            <span className="truncate">{movie.language.split('/')[0]}</span>
          </div>

          <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-rose-600 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          {movie.tamilTitle && (
            <p className="text-xs text-gray-500 font-medium line-clamp-1 mt-0.5">
              {movie.tamilTitle}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genre?.slice(0, 2).map(g => (
              <span key={g} className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => onSelectMovie(movie)}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Tickets</span>
          </button>
        </div>
      </div>
    </div>
  );
}

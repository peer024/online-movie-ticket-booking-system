import React from 'react';
import { X, Film, ExternalLink, Play } from 'lucide-react';

export default function TrailerModal({ movie, onClose }) {
  if (!movie) return null;

  // Extract clean video ID
  let videoId = '';
  if (movie.trailerUrl?.includes('/embed/')) {
    videoId = movie.trailerUrl.split('/embed/')[1]?.split('?')[0];
  } else if (movie.trailerUrl?.includes('v=')) {
    videoId = movie.trailerUrl.split('v=')[1]?.split('&')[0];
  } else if (movie.trailerUrl?.includes('youtu.be/')) {
    videoId = movie.trailerUrl.split('youtu.be/')[1]?.split('?')[0];
  }

  // Clean embed URL
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  const directWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight">
                {movie.title} — Official Trailer
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {movie.language} {movie.tamilTitle ? `• ${movie.tamilTitle}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={directWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all text-xs font-semibold shadow-xs"
              title="Open in Official YouTube Player"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-600 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Area */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          <iframe
            src={embedUrl}
            title={`${movie.title} Official Trailer`}
            className="w-full h-full border-0 relative z-10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Footer info bar */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <div>
            Starring: <span className="text-gray-900 font-medium">{movie.cast?.join(', ')}</span> • Directed by <span className="text-gray-900 font-medium">{movie.director}</span>
          </div>

          <div className="text-gray-500 text-[11px]">
            Academic Cinema Booking Project
          </div>
        </div>
      </div>
    </div>
  );
}

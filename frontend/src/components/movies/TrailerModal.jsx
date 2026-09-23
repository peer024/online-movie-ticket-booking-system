import React, { useState } from 'react';
import { sound } from '../../services/soundEngine';
import { X, Film, ExternalLink, Play, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export default function TrailerModal({ movie, onClose }) {
  if (!movie) return null;

  const [hasError, setHasError] = useState(false);

  // Extract clean video ID
  let videoId = '';
  if (movie.trailerUrl?.includes('/embed/')) {
    videoId = movie.trailerUrl.split('/embed/')[1]?.split('?')[0];
  } else if (movie.trailerUrl?.includes('v=')) {
    videoId = movie.trailerUrl.split('v=')[1]?.split('&')[0];
  } else if (movie.trailerUrl?.includes('youtu.be/')) {
    videoId = movie.trailerUrl.split('youtu.be/')[1]?.split('?')[0];
  }

  // High-performance clean embed URL
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  const directWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-950 rounded-3xl border border-cyan-500/40 overflow-hidden shadow-2xl shadow-cyan-950/80">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base leading-tight">
                {movie.title} — Official Trailer
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                {movie.formats?.join(' • ')} {movie.tamilTitle ? `• ${movie.tamilTitle}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={directWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white transition-all text-xs font-black shadow-lg shadow-red-600/30"
              title="Open in Official YouTube Player"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Watch in 4K on YouTube</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all border border-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Stream Status Ribbon */}
        <div className="bg-cyan-950/30 border-b border-cyan-500/30 px-4 py-2 flex items-center justify-between text-xs text-cyan-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 animate-pulse" />
            <span>
              <strong className="text-white">Official Theatrical Trailer</strong> • Verified High-Definition Dolby Audio Master Stream
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE PLAYBACK ACTIVE
          </span>
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

          {/* Fallback Overlay if user prefers direct streaming */}
          <div className="absolute inset-0 bg-cover bg-center -z-0 opacity-30" style={{ backgroundImage: `url(${movie.bannerUrl})` }} />
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-slate-900/60 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            Starring: <span className="text-white font-medium">{movie.cast?.join(', ')}</span> • Directed by <span className="text-cyan-300 font-medium">{movie.director}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={directWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 hover:text-black text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all border border-cyan-500/30"
            >
              <span>Open on YouTube App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

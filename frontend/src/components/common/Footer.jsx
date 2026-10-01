import React from 'react';
import { Film, Heart, Code2, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-[#070a12] pt-12 pb-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-rose-500" />
              <span className="font-bold text-white text-base">
                Cine<span className="text-rose-500">Pass</span> Cinemas
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A comprehensive Full-Stack Online Movie Ticket Booking System designed for college academic mini-project submission. Features real-time seat selection, movie showtime catalog, food concessions, and digital E-Ticket generation.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Theater Locations</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Phoenix Marketcity, Velachery, Chennai</li>
              <li>Express Avenue Mall, Royapettah</li>
              <li>Forum Vijaya Mall, Vadapalani</li>
              <li>VR Mall Multiplex, Anna Nagar</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Technology Stack</h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div>• Frontend: React 18, Vite, Tailwind CSS</div>
              <div>• Backend: Node.js, Express REST API</div>
              <div>• Database: JSON Database Storage</div>
              <div>• Security: Admin Role Authentication</div>
            </div>
          </div>
        </div>

        {/* Project Team Card */}
        <div className="my-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center flex-shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-rose-400 font-medium">Academic Project Submission</div>
              <div className="text-sm font-bold text-white mt-0.5">
                Designed & Developed by <span className="text-rose-400">Kombaiya & Ashik Chandru</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Department of Computer Science & Engineering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
              College Mini-Project
            </span>
          </div>
        </div>

        {/* Copyright & Signoff */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © 2026 CinePass Movie Ticket Booking System. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Developed by</span>
            <span className="font-bold text-white">Kombaiya & Ashik Chandru</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

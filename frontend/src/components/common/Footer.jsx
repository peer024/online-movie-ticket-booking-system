import React from 'react';
import { Film, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-gray-50 pt-12 pb-10 text-gray-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-rose-600" />
              <span className="font-bold text-gray-900 text-base">
                Cine<span className="text-rose-600">Pass</span> Cinemas
              </span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed max-w-md">
              A comprehensive Full-Stack Online Movie Ticket Booking System designed for college academic mini-project submission. Features real-time seat selection, movie showtime catalog, food concessions, and digital E-Ticket generation.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">Theater Locations</h4>
            <ul className="space-y-1.5 text-xs text-gray-500">
              <li>Phoenix Marketcity, Velachery, Chennai</li>
              <li>Express Avenue Mall, Royapettah</li>
              <li>Forum Vijaya Mall, Vadapalani</li>
              <li>VR Mall Multiplex, Anna Nagar</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">Technology Stack</h4>
            <div className="space-y-1.5 text-xs text-gray-500">
              <div>• Frontend: React 18, Vite, Tailwind CSS</div>
              <div>• Backend: Node.js, Express REST API</div>
              <div>• Database: JSON Database Storage</div>
              <div>• Security: Role-Based Authentication</div>
            </div>
          </div>
        </div>

        {/* Project Team Card */}
        <div className="my-6 p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center flex-shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-rose-600 font-semibold uppercase">Academic Project Submission</div>
              <div className="text-sm font-bold text-gray-900 mt-0.5">
                Designed & Developed by <span className="text-rose-600">Kombaiya & Ashik Chandru</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Department of Computer Science & Engineering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200">
              College Mini-Project
            </span>
          </div>
        </div>

        {/* Copyright & Signoff */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            © 2026 CinePass Movie Ticket Booking System. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <span>Developed by</span>
            <span className="font-bold text-gray-900">Kombaiya & Ashik Chandru</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

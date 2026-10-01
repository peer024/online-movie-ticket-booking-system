import React from 'react';
import { Award, Code2, Database, Layers, ShieldCheck } from 'lucide-react';

export default function ProjectCredits() {
  return (
    <section className="relative w-full max-w-5xl mx-auto my-12 px-4">
      <div className="rounded-2xl p-6 sm:p-8 border border-gray-200 bg-white shadow-xs">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-rose-600">
                Engineering Team
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Online Movie Ticket Booking System
              </h3>
            </div>
          </div>
        </div>

        {/* Developers Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          {/* Developer 1: Kombaiya */}
          <div className="rounded-xl p-5 bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3.5 mb-2.5">
              <div className="w-11 h-11 rounded-xl bg-rose-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
                K
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">Kombaiya</h4>
                <div className="text-xs text-rose-600 font-medium">Frontend Developer</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Designed the user interface, 2D cinema seat matrix layout, movie catalog, search filters, and digital ticket rendering system.
            </p>
          </div>

          {/* Developer 2: Ashik Chandru */}
          <div className="rounded-xl p-5 bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3.5 mb-2.5">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
                AC
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">Ashik Chandru</h4>
                <div className="text-xs text-blue-600 font-medium">Backend & Database Developer</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Implemented the backend REST API endpoints, booking transaction pipeline, real-time database state, and administrative dashboard.
            </p>
          </div>
        </div>

        {/* Tech Stack & Core Modules */}
        <div className="pt-5 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-gray-700">
            <Code2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span><strong>Frontend:</strong> React 18, Vite, Tailwind CSS</span>
          </div>

          <div className="flex items-center gap-2.5 text-gray-700">
            <Database className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Backend:</strong> Node.js, Express REST API</span>
          </div>

          <div className="flex items-center gap-2.5 text-gray-700">
            <Layers className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span><strong>Database:</strong> JSON DB Storage</span>
          </div>

          <div className="flex items-center gap-2.5 text-gray-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span><strong>Admin Portal:</strong> Role-Based Access</span>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Department of Computer Science & Engineering
          </span>
          <span className="font-semibold text-gray-900">
            Designed & Developed by Kombaiya & Ashik Chandru
          </span>
        </div>
      </div>
    </section>
  );
}

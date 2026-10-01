import React from 'react';
import { Award, Code2, Users, Database, Layers, CheckCircle2, ShieldCheck, Film } from 'lucide-react';

export default function ProjectCredits() {
  return (
    <section className="relative w-full max-w-5xl mx-auto my-12 px-4">
      <div className="rounded-2xl p-6 sm:p-8 border border-slate-800 bg-[#0d121f] shadow-xl">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-bold">
                College Academic Project
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Online Movie Ticket Booking System
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
              🎓 Mini Project Submission
            </span>
          </div>
        </div>

        {/* Developers Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          {/* Developer 1: Kombaiya */}
          <div className="rounded-xl p-5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-rose-500/20">
                K
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Kombaiya</h4>
                <div className="text-xs text-rose-400 font-medium">Project Developer</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed the frontend responsive user interface, interactive 2D cinema seat matrix layout, movie catalog filters, and digital ticket rendering engine.
            </p>
          </div>

          {/* Developer 2: Ashik Chandru */}
          <div className="rounded-xl p-5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
                AC
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Ashik Chandru</h4>
                <div className="text-xs text-cyan-400 font-medium">Project Developer</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Implemented the backend REST API endpoints, booking transaction pipeline, real-time database state synchronization, and administrative dashboard.
            </p>
          </div>
        </div>

        {/* Tech Stack & Core Modules */}
        <div className="pt-5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Code2 className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span><strong>Frontend:</strong> React 18, Vite, Tailwind CSS</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-300">
            <Database className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span><strong>Backend:</strong> Node.js, Express REST API</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-300">
            <Layers className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span><strong>Database:</strong> JSON DB & Offline Storage</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span><strong>Admin Portal:</strong> Secure Role Authentication</span>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Department of Computer Science & Engineering
          </span>
          <span className="font-semibold text-white">
            Designed & Developed by Kombaiya & Ashik Chandru
          </span>
        </div>
      </div>
    </section>
  );
}

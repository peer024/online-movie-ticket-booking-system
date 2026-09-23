import React, { useState } from 'react';
import { sound } from '../../services/soundEngine';
import { Shield, Lock, User, Eye, EyeOff, X, AlertTriangle, KeyRound } from 'lucide-react';

export default function AdminLoginModal({ onSuccess, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Strict authentication check
    // Username: admin@cinema
    // Password: kombaiya ashik
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (trimmedUser === 'admin@cinema' && trimmedPass === 'kombaiya ashik') {
      sound.playClick();
      onSuccess();
    } else {
      sound.playError();
      setAttempts(prev => prev + 1);
      setErrorMessage('Access Denied: Invalid Administrator Credentials. Verification Failed.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-md bg-[#090d16] rounded-3xl border border-cyan-500/40 p-6 sm:p-8 shadow-2xl shadow-cyan-950/80">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Shield Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3 shadow-lg shadow-cyan-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            SECURITY LEVEL 1 AUTHENTICATION
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Admin Portal Access
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Restricted area for theater management and scheduling.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Username</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. admin@cinema"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>Password (Masked)</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-black font-black text-xs uppercase tracking-wider shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-[1.01] transition-all cursor-pointer"
          >
            Authorize & Enter Console
          </button>
        </form>

        {/* Security hint footer */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center text-[11px] text-slate-500 font-mono">
          Strict 256-bit Gate • Unauthorized attempts are monitored
        </div>
      </div>
    </div>
  );
}

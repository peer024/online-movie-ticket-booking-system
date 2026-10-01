import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, X, AlertTriangle, KeyRound } from 'lucide-react';

export default function AdminLoginModal({ onSuccess, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (trimmedUser === 'admin@cinema' && trimmedPass === 'kombaiya ashik') {
      onSuccess();
    } else {
      setErrorMessage('Access Denied: Invalid credentials.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Lock Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 mb-2.5">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Admin Portal Login
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Restricted area for theater management and booking stats.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-600" />
              <span>Username</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin@cinema"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-xs focus:border-rose-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-rose-600" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="kombaiya ashik"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-xs focus:border-rose-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer"
          >
            Sign In to Admin
          </button>
        </form>

        {/* Credentials reminder */}
        <div className="mt-5 pt-3 border-t border-gray-100 text-center text-[11px] text-gray-500">
          Demo: <span className="font-semibold text-gray-700">admin@cinema</span> / <span className="font-semibold text-gray-700">kombaiya ashik</span>
        </div>
      </div>
    </div>
  );
}

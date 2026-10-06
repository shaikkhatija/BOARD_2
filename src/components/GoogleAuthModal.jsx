import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, UserPlus, ShieldCheck } from 'lucide-react';

export const GoogleAuthModal = () => {
  const { isGoogleModalOpen, setIsGoogleModalOpen, loginWithGoogle } = useAuth();
  const [customMode, setCustomMode] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isGoogleModalOpen) return null;

  const handleSelectAccount = async (email, name) => {
    setIsSubmitting(true);
    await loginWithGoogle(email, name);
    setIsSubmitting(false);
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customEmail) return;
    setIsSubmitting(true);
    await loginWithGoogle(customEmail, customName || customEmail.split('@')[0]);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="google-auth-title"
      >
        {/* Top Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-medium text-sm text-slate-800">Sign in with Google</span>
          </div>
          <button
            onClick={() => setIsGoogleModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 id="google-auth-title" className="text-xl font-bold font-montserrat text-slate-900">
              Choose an account
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              to continue to <span className="font-semibold text-slate-800">Board. Analytics</span>
            </p>
          </div>

          {!customMode ? (
            <div className="space-y-3">
              {/* Account 1: User's provided email */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSelectAccount('sherishma@gmail.com', 'SHerishma')}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                  SH
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 truncate">
                    SHerishma
                  </div>
                  <div className="text-xs text-slate-500 truncate">sherishma@gmail.com</div>
                </div>
                <div className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Select
                </div>
              </button>

              {/* Account 2: Demo account */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSelectAccount('alex.product@gmail.com', 'Alex Taylor')}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                  AT
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 truncate">
                    Alex Taylor (Demo Analyst)
                  </div>
                  <div className="text-xs text-slate-500 truncate">alex.product@gmail.com</div>
                </div>
                <div className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Select
                </div>
              </button>

              {/* Option 3: Custom account */}
              <button
                type="button"
                onClick={() => setCustomMode(true)}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all text-left text-slate-600 hover:text-slate-900"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-sm font-medium">Use another Google account</div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomMode(false)}
                  className="flex-1 py-2.5 px-4 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !customEmail}
                  className="flex-1 py-2.5 px-4 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Signing in...' : 'Continue'}
                </button>
              </div>
            </form>
          )}

          {/* Privacy & Safety Note */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p>
              To continue, Google will share your name, email address, language preference, and profile picture with Board.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

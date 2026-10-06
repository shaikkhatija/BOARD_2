/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SignInScreen } from './components/SignInScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { ShieldAlert, ShieldCheck, Lock } from 'lucide-react';

const STORAGE_SESSION_KEY = 'board_dashboard_user';

const MainApp = () => {
  const { user, isLoading, logout } = useAuth();
  const [routeDeniedMessage, setRouteDeniedMessage] = useState('');

  // Helper to check if a valid session exists in memory or storage
  const isSessionActive = () => {
    if (user) return true;
    try {
      const stored = localStorage.getItem(STORAGE_SESSION_KEY);
      return Boolean(stored);
    } catch {
      return false;
    }
  };

  // Synchronize hash with auth status
  useEffect(() => {
    if (isLoading) return;

    const currentHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();

    if (user) {
      // User is logged in: keep on dashboard, do NOT redirect to login on path changes
      if (!currentHash.startsWith('dashboard')) {
        window.location.hash = '#/dashboard';
      }
      setRouteDeniedMessage('');
    } else {
      // User is NOT logged in: protect dashboard from unauthorized URL access
      if (currentHash.startsWith('dashboard')) {
        window.location.hash = '#/login';
        setRouteDeniedMessage('Access Denied: Only registered users can access the dashboard. Please sign in.');
      } else if (window.location.hash !== '#/login') {
        window.location.hash = '#/login';
      }
    }
  }, [user, isLoading]);

  // Listen to manual URL hash alterations by the user in browser address bar
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      const authenticated = isSessionActive();

      if (!authenticated && hash.startsWith('dashboard')) {
        // Block unauthorized entry by path altering
        window.location.hash = '#/login';
        setRouteDeniedMessage('Access Denied: Only registered users can access the dashboard. Please sign in.');
      } else if (authenticated && !hash.startsWith('dashboard')) {
        // In Dashboard, do NOT kick the user out to login page if path is altered
        window.location.hash = '#/dashboard';
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-3 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Loading Board...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative">
      {/* Route Security Status Bar */}
      <aside aria-label="Route and access security bar" className="sticky top-0 z-40 bg-[#090D16] text-white py-2 px-4 border-b border-white/10 flex flex-wrap items-center justify-between text-xs select-none gap-2">
        <div className="flex items-center gap-2">
          {user ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span className="font-montserrat font-bold tracking-tight">Board Security Guard:</span>
          <span className="font-mono text-[11px] text-slate-300 bg-white/10 px-2 py-0.5 rounded">
            Route: #{window.location.hash ? window.location.hash.replace(/^#/, '') : '/login'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 text-slate-300 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>
                Authorized as: <strong className="text-white">{user.name}</strong> ({user.email})
              </span>
              <button
                onClick={() => logout()}
                className="ml-2 px-2.5 py-0.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded font-semibold text-[10px] transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-300 text-[11px]">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Restricted: Dashboard requires registered login</span>
            </div>
          )}
        </div>
      </aside>

      {/* Access Denied Warning Toast (shown when an unauthorized user attempts to alter path) */}
      {routeDeniedMessage && !user && (
        <div className="bg-amber-500 text-black px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-black" />
            <span>{routeDeniedMessage}</span>
          </div>
          <button
            onClick={() => setRouteDeniedMessage('')}
            className="text-black/70 hover:text-black font-bold px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Screen Routing: Only registered, authenticated users can see the Dashboard */}
      {user ? (
        <DashboardScreen />
      ) : (
        <SignInScreen
          onSuccess={() => {
            setRouteDeniedMessage('');
          }}
        />
      )}

      {/* Google Authentication Dialog */}
      <GoogleAuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

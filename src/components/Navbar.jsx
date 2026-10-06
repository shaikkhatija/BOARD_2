import React, { useState } from 'react';
import { Search, Bell, Menu, RefreshCw, CheckCircle2, LogOut, LogIn, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({
  title,
  onOpenMobileMenu,
  onRefreshData,
  isRefreshing = false,
  lastUpdated,
  onSwitchToAuth,
}) => {
  const { user, logout, setIsGoogleModalOpen } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Schedule Reminder', text: 'Meeting with suppliers in 30 mins', time: '13:30' },
    { id: 2, title: 'Operations Alert', text: 'Giga Factory 1 report ready for review', time: '11:15' },
    { id: 3, title: 'Sales Milestone', text: 'Total revenues crossed $2.1M this quarter', time: '09:00' },
  ];

  return (
    <header className="flex items-center justify-between gap-4 py-2 sm:py-3 mb-4 sm:mb-6">
      {/* Title & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl bg-white shadow-xs border border-slate-200 text-slate-700 hover:text-black"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="font-montserrat font-bold text-xl sm:text-2xl text-black tracking-tight">
          {title}
        </h2>
      </div>

      {/* Right Controls: Search, Bell, Live Sync, Avatar */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Search Input */}
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-36 sm:w-48 lg:w-56 bg-white border border-slate-200/80 rounded-full pl-4 pr-9 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-2.5 pointer-events-none" />
        </div>

        {/* Live Axios Refresh Indicator */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            title={`Last synced via Axios at ${lastUpdated || 'just now'}`}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3 h-3 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Fetching...' : 'Axios Sync'}</span>
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 text-slate-700 hover:text-black hover:bg-white rounded-full transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-semibold text-xs text-slate-900">Notifications</span>
                <span className="text-[10px] text-blue-600 font-medium cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 px-1 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar / Auth Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 focus:outline-none"
            aria-label="User profile menu"
          >
            {user ? (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-200 shadow-2xs hover:ring-black transition-all">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-medium text-xs ring-2 ring-slate-200 hover:ring-slate-400 transition-all">
                <LogIn className="w-4 h-4" />
              </div>
            )}
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
              {user ? (
                <div>
                  <div className="pb-3 border-b border-slate-100">
                    <div className="font-bold text-sm text-slate-900 truncate">{user.name}</div>
                    <div className="text-xs text-slate-500 truncate">{user.email}</div>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{user.provider === 'google' ? 'Google OAuth Active' : 'Authenticated'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 space-y-3">
                  <p className="text-xs text-slate-600">You are currently viewing as Guest.</p>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setIsGoogleModalOpen(true);
                    }}
                    className="w-full py-2 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl"
                  >
                    Sign In with Google
                  </button>
                  {onSwitchToAuth && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onSwitchToAuth();
                      }}
                      className="w-full py-1.5 text-xs text-slate-600 hover:text-black font-medium"
                    >
                      Go to Sign In Screen
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

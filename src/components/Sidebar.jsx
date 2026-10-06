import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  CalendarCheck2,
  Users,
  Settings,
  X,
  HelpCircle,
  MessageSquareQuote,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  isOpenMobile = false,
  onCloseMobile,
  onSwitchToAuth,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'schedules', label: 'Schedules', icon: CalendarCheck2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const content = (
    <div className="flex flex-col justify-between h-full py-8 px-8 lg:px-10 text-white select-none">
      <div>
        {/* Brand Logo & Mobile Close */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-montserrat font-bold text-3xl lg:text-4xl tracking-tight text-white">
            Board.
          </h1>
          {isOpenMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isOpenMobile && onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-4 text-left transition-colors font-lato text-base ${
                  isActive
                    ? 'font-bold text-white'
                    : 'font-normal text-slate-300 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Links & Account */}
      <div className="pt-8 border-t border-white/10 space-y-3">
        <div className="flex flex-col space-y-2.5 text-xs text-slate-400">
          <button
            type="button"
            onClick={() => alert('Board Help Center: All documentation and guides available 24/7.')}
            className="flex items-center gap-2 hover:text-white transition-colors text-left"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </button>
          <button
            type="button"
            onClick={() => alert('Contact Board Support: support@board-analytics.internal')}
            className="flex items-center gap-2 hover:text-white transition-colors text-left"
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Contact Us</span>
          </button>
        </div>

        {/* User status & Switch screen action */}
        {user ? (
          <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <div className="truncate max-w-[140px]">
              <span className="block font-semibold text-white truncate">{user.name}</span>
              <span className="block text-[10px] text-slate-400 truncate">{user.email}</span>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="text-slate-400 hover:text-rose-400 p-1.5 transition-colors rounded-lg hover:bg-white/5"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : onSwitchToAuth ? (
          <div className="pt-3">
            <button
              onClick={onSwitchToAuth}
              className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white transition-colors text-center"
            >
              Sign In to Account
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[260px] lg:w-[280px] shrink-0 min-h-[calc(100vh-3rem)] sticky top-6 bg-[#000000] rounded-[30px] shadow-xl overflow-hidden my-3 ml-3">
        {content}
      </aside>

      {/* Mobile Drawer Modal */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-[280px] max-w-[80vw] h-full bg-[#000000] shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

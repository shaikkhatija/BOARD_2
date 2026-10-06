import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MetricCards } from './MetricCards';
import { ActivitiesChart } from './ActivitiesChart';
import { TopProductsCard } from './TopProductsCard';
import { ScheduleCard } from './ScheduleCard';
import { fetchDashboardData } from '../services/api';
import { Calendar } from 'lucide-react';

export const DashboardScreen = ({ onSwitchToAuth }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchDashboardData();
      setDashboardData(data);
    } catch (e) {
      console.error('Failed to load dashboard data via Axios', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'transactions':
        return 'Transactions & Orders';
      case 'schedules':
        return 'Executive Schedules';
      case 'users':
        return 'User Management';
      case 'settings':
        return 'System Settings';
      default:
        return 'Dashboard';
    }
  };

  const sampleTransactions = [
    { id: 'TX-9021', customer: 'Bali Supply Co.', item: 'Basic Tees (Bulk 500)', amount: '$12,500', status: 'Completed', date: 'Oct 04, 2026', isIncoming: true },
    { id: 'TX-9020', customer: 'Giga Factory Logistics', item: 'Super Hoodies (Batch 200)', amount: '$8,400', status: 'Processing', date: 'Oct 03, 2026', isIncoming: true },
    { id: 'TX-9019', customer: 'Jakarta Retailers Ltd', item: 'Custom Short Pants (300)', amount: '$6,200', status: 'Completed', date: 'Oct 02, 2026', isIncoming: true },
    { id: 'TX-9018', customer: 'Textile Raw Materials', item: 'Organic Cotton Bales', amount: '$4,150', status: 'Paid', date: 'Oct 01, 2026', isIncoming: false },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row p-2 sm:p-4 lg:p-6 gap-4 lg:gap-8">
      {/* Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onSwitchToAuth={onSwitchToAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 max-w-full px-2 sm:px-4 py-2">
        {/* Top Navbar */}
        <Navbar
          title={getTabTitle()}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onRefreshData={loadData}
          isRefreshing={isRefreshing}
          lastUpdated={dashboardData?.lastUpdated}
          onSwitchToAuth={onSwitchToAuth}
        />

        {isLoading || !dashboardData ? (
          <div className="space-y-6 animate-pulse pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-[20px]" />
              ))}
            </div>
            <div className="h-72 bg-slate-200 rounded-[24px]" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-slate-200 rounded-[24px]" />
              <div className="h-64 bg-slate-200 rounded-[24px]" />
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            {activeTab === 'dashboard' && (
              <>
                {/* 1. 4 Metric Cards */}
                <MetricCards metrics={dashboardData.metrics} />

                {/* 2. Activities Chart */}
                <ActivitiesChart activitiesData={dashboardData.activities} />

                {/* 3. Bottom Row: Top Products & Today's Schedule */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pb-8">
                  <TopProductsCard productsData={dashboardData.topProducts} />
                  <ScheduleCard initialSchedules={dashboardData.schedules} />
                </div>
              </>
            )}

            {/* Tab: Transactions */}
            {activeTab === 'transactions' && (
              <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-2xs border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-montserrat font-bold text-lg text-black">
                      Recent Transactions
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Live ledger sync fetched via Axios
                    </p>
                  </div>
                  <button
                    onClick={loadData}
                    className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
                  >
                    Refresh Table
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-3 px-3">Transaction ID</th>
                        <th className="pb-3 px-3">Entity</th>
                        <th className="pb-3 px-3">Item Details</th>
                        <th className="pb-3 px-3">Date</th>
                        <th className="pb-3 px-3 text-right">Amount</th>
                        <th className="pb-3 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sampleTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-mono font-medium text-slate-700">
                            {tx.id}
                          </td>
                          <td className="py-3 px-3 font-semibold text-black">{tx.customer}</td>
                          <td className="py-3 px-3 text-slate-600">{tx.item}</td>
                          <td className="py-3 px-3 text-slate-500 tabular-nums">{tx.date}</td>
                          <td className="py-3 px-3 text-right font-bold text-black tabular-nums">
                            {tx.amount}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                tx.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : tx.status === 'Processing'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-blue-50 text-blue-700'
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Schedules */}
            {activeTab === 'schedules' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScheduleCard initialSchedules={dashboardData.schedules} />
                <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-2xs border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h3 className="font-montserrat font-bold text-lg text-black mb-2">
                      Calendar Integration
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      All executive meetings, supplier walkthroughs in Bali, and Giga Factory inspections sync directly with your Google Workspace calendar.
                    </p>
                    <div className="mt-6 space-y-3">
                      <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-slate-700" />
                        <div className="text-xs">
                          <div className="font-bold text-black">Google Calendar Auto-Sync</div>
                          <div className="text-slate-400">Connected to authenticated profile</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Users */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-2xs border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-montserrat font-bold text-lg text-black">
                      Platform Users & Personnel
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Total active members: {dashboardData.metrics.find((m) => m.id === 'usr')?.value || '892'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Nithin Babu', role: 'Lead Frontend Developer', email: 'tnithinbabu@gmail.com', status: 'Online' },
                    { name: 'Alex Taylor', role: 'Operations Director', email: 'alex.product@gmail.com', status: 'Away' },
                    { name: 'Sarah Chen', role: 'Factory Floor Manager', email: 'schen@gigafactory.io', status: 'In Meeting' },
                    { name: 'Putu Wijaya', role: 'Bali Sourcing Specialist', email: 'pwijaya@kutasupplies.co.id', status: 'Online' },
                  ].map((u) => (
                    <div key={u.email} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-black truncate">{u.name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{u.role}</div>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="truncate">{u.email}</span>
                        <span className="font-semibold text-emerald-600 shrink-0">{u.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-2xs border border-slate-100 max-w-2xl">
                <h3 className="font-montserrat font-bold text-lg text-black mb-1">
                  Dashboard Preferences
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Configure authentication providers, data caching, and display tokens.
                </p>
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                    <div>
                      <div className="font-bold text-black">Google Single Sign-On</div>
                      <div className="text-slate-400">OAuth 2.0 Identity Platform enabled</div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-semibold text-[11px]">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                    <div>
                      <div className="font-bold text-black">Axios Data Polling</div>
                      <div className="text-slate-400">Periodic KPI metrics background fetch</div>
                    </div>
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md font-semibold text-[11px]">
                      Enabled
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

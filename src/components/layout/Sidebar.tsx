import React, { useState } from 'react';
import { 
  LayoutGrid, MessageSquare, ShoppingBag, Receipt, Users, 
  Settings, CheckSquare, Calendar, FileSpreadsheet, Bot, 
  ChevronDown, ChevronRight, X, Sparkles
} from 'lucide-react';
import { useNavigation, AppRoute } from '../../context/NavigationContext';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { currentRoute, navigate, isSidebarOpen, setSidebarOpen } = useNavigation();
  const { workspace } = useAuth();
  const { tasks, communications } = useCRM();

  const [isOverviewOpen, setIsOverviewOpen] = useState(true);

  const unreadMessagesCount = communications.length > 0 ? 8 : 0;
  const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;

  const handleNav = (route: AppRoute) => {
    navigate(route);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar container matching screenshot */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#18181b] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header: @ Your Company */}
        <div className="h-20 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-white/20 bg-zinc-800/90 flex items-center justify-center text-white font-bold text-sm">
              @
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              {workspace.name || 'Your Company'}
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 scrollbar-none">
          {/* Overview expandable section */}
          <div>
            <button
              onClick={() => setIsOverviewOpen(!isOverviewOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition group"
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                <span>Overview</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
                  isOverviewOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isOverviewOpen && (
              <div className="mt-1 ml-4 pl-3 border-l border-zinc-800 space-y-1">
                {/* Summary (Active pill in screenshot) */}
                <button
                  onClick={() => handleNav('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                    currentRoute === 'dashboard'
                      ? 'bg-[#27272a] text-white font-semibold shadow-xs'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400">›</span>
                    <span>Summary</span>
                  </div>
                </button>

                {/* Custom view */}
                <button
                  onClick={() => handleNav('analytics')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                    currentRoute === 'analytics'
                      ? 'bg-[#27272a] text-white font-semibold shadow-xs'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400">›</span>
                    <span>Custom view</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Messages */}
          <button
            onClick={() => handleNav('communications')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
              currentRoute === 'communications'
                ? 'bg-[#27272a] text-white font-semibold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-zinc-400" />
              <span>Messages</span>
            </div>
            <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-bold flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          </button>

          {/* Products (Deals/Services) */}
          <button
            onClick={() => handleNav('deals')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
              currentRoute === 'deals'
                ? 'bg-[#27272a] text-white font-semibold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-zinc-400" />
              <span>Products</span>
            </div>
          </button>

          {/* Orders (Invoices) */}
          <button
            onClick={() => handleNav('invoices')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
              currentRoute === 'invoices'
                ? 'bg-[#27272a] text-white font-semibold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Receipt className="w-4 h-4 text-zinc-400" />
              <span>Orders</span>
            </div>
          </button>

          {/* Customers (Leads & Contacts) */}
          <button
            onClick={() => handleNav('leads')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
              currentRoute === 'leads' || currentRoute === 'contacts' || currentRoute === 'companies'
                ? 'bg-[#27272a] text-white font-semibold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-zinc-400" />
              <span>Customers</span>
            </div>
          </button>

          {/* Secondary Features Divider */}
          <div className="pt-4 pb-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Workspace & AI
            </p>
          </div>

          {/* Tasks */}
          <button
            onClick={() => handleNav('tasks')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
              currentRoute === 'tasks'
                ? 'bg-[#27272a] text-white font-semibold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckSquare className="w-4 h-4 text-zinc-400" />
              <span>Tasks</span>
            </div>
            {pendingTasksCount > 0 && (
              <span className="text-[10px] text-zinc-400 font-mono">
                {pendingTasksCount}
              </span>
            )}
          </button>

          {/* Calendar */}
          <button
            onClick={() => handleNav('calendar')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
              currentRoute === 'calendar'
                ? 'bg-[#27272a] text-white font-semibold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span>Calendar</span>
            </div>
          </button>

          {/* Proposals */}
          <button
            onClick={() => handleNav('proposals')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
              currentRoute === 'proposals'
                ? 'bg-[#27272a] text-white font-semibold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-4 h-4 text-zinc-400" />
              <span>Proposals</span>
            </div>
          </button>

          {/* AI Copilot */}
          <button
            onClick={() => handleNav('ai')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
              currentRoute === 'ai'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Copilot</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
              AI
            </span>
          </button>
        </div>

        {/* Bottom: Settings */}
        <div className="p-4 border-t border-zinc-800/80">
          <button
            onClick={() => handleNav('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
              currentRoute === 'settings'
                ? 'bg-[#27272a] text-white font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Settings className="w-4 h-4 text-zinc-400" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};

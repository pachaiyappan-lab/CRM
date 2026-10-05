import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, Search, Plus, Bell, ChevronDown, 
  User, Settings, LogOut, RotateCcw, ShieldCheck,
  CheckCircle2, DollarSign, Calendar, FileText
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import { useCRM } from '../../context/CRMContext';

export const Header: React.FC = () => {
  const { 
    setSidebarOpen, 
    setCommandPaletteOpen, 
    openGlobalAddWithType,
    setNotificationsOpen,
    navigate,
    currentRoute
  } = useNavigation();

  const { currentUser, logout, loginWithGoogle } = useAuth();
  const { notifications, resetToMockData, isLiveDatabaseConnected, syncStatus } = useCRM();

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  const addMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleGoogleSignInFromHeader = async () => {
    try {
      setIsGoogleSigningIn(true);
      await loginWithGoogle();
      setIsProfileMenuOpen(false);
    } catch (err: any) {
      console.warn('Google sign-in from header:', err);
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setIsAddMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (currentRoute) {
      case 'dashboard':
        return `Welcome back, ${currentUser?.name?.split(' ')[0] || 'Matthew'}`;
      case 'leads':
        return 'Customer Leads';
      case 'deals':
        return 'Products & Pipelines';
      case 'tasks':
        return 'Tasks & Follow-ups';
      case 'calendar':
        return 'Calendar & Schedule';
      case 'projects':
        return 'Projects & Delivery';
      case 'proposals':
        return 'Client Proposals';
      case 'invoices':
        return 'Orders & Invoices';
      case 'communications':
        return 'Messages & Inbox';
      case 'documents':
        return 'Files & Paperwork';
      case 'analytics':
        return 'Analytics & Custom Views';
      case 'ai':
        return 'AI Business Copilot';
      case 'team':
        return 'Team Members';
      case 'settings':
        return 'Settings & Workspace';
      default:
        return 'Dashboard Overview';
    }
  };

  const getPageSubtitle = () => {
    switch (currentRoute) {
      case 'dashboard':
        return "Here are today's stats from your online store!";
      case 'leads':
        return 'Track prospective clients and conversions.';
      case 'deals':
        return 'Manage open pipelines and deals.';
      case 'invoices':
        return 'Monitor order billing and receipts.';
      case 'communications':
        return 'Client messaging and communication history.';
      default:
        return "Live records and operational controls.";
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#f4f4f6]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 border-b border-zinc-200/50">
      {/* Left section: Hamburger (mobile) + Page Title Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 shadow-2xs transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-zinc-900 tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            {getPageSubtitle()}
          </p>
        </div>
      </div>

      {/* Right section: Search pill, notification, and profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Live Database Sync Badge */}
        <button 
          onClick={() => navigate('settings', 'database')}
          title={isLiveDatabaseConnected ? "Connected to Live Google Cloud Firestore (Click to view database)" : "Working in Offline Mode"}
          className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200/80 text-[11px] shadow-2xs transition cursor-pointer"
        >
          <span className={`w-2 h-2 rounded-full ${
            syncStatus === 'syncing' 
              ? 'bg-amber-400 animate-pulse' 
              : isLiveDatabaseConnected 
              ? 'bg-emerald-500' 
              : 'bg-zinc-400'
          }`} />
          <span className="font-semibold text-zinc-700">
            {syncStatus === 'syncing' ? 'Syncing...' : 'Live DB'}
          </span>
        </button>

        {/* Search Input Pill */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/80 text-zinc-400 hover:text-zinc-600 text-xs shadow-2xs hover:shadow-xs transition"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden md:inline-flex px-1.5 py-0.5 text-[9px] font-mono text-zinc-400 bg-zinc-100 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Global "+ Add" quick button */}
        <div className="relative" ref={addMenuRef}>
          <button
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New</span>
          </button>

          {isAddMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-zinc-100 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Create
              </div>
              <button
                onClick={() => {
                  openGlobalAddWithType('lead');
                  setIsAddMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition"
              >
                <User className="w-4 h-4 text-zinc-500" />
                <span>New Lead</span>
              </button>
              <button
                onClick={() => {
                  openGlobalAddWithType('deal');
                  setIsAddMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition"
              >
                <DollarSign className="w-4 h-4 text-zinc-500" />
                <span>New Deal</span>
              </button>
              <button
                onClick={() => {
                  openGlobalAddWithType('task');
                  setIsAddMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition"
              >
                <CheckCircle2 className="w-4 h-4 text-zinc-500" />
                <span>New Task</span>
              </button>
              <button
                onClick={() => {
                  openGlobalAddWithType('event');
                  setIsAddMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition"
              >
                <Calendar className="w-4 h-4 text-zinc-500" />
                <span>Calendar Event</span>
              </button>
              <button
                onClick={() => {
                  openGlobalAddWithType('invoice');
                  setIsAddMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition"
              >
                <FileText className="w-4 h-4 text-zinc-500" />
                <span>New Invoice</span>
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative p-2 rounded-full bg-white border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 shadow-2xs transition"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-zinc-900 ring-2 ring-white" />
          )}
        </button>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white border border-zinc-200/80 shadow-2xs hover:bg-zinc-50 transition"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="text-xs font-semibold text-zinc-800 hidden sm:inline">
              {currentUser?.name || 'Matthew Parker'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-100 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div 
                onClick={() => {
                  navigate('settings', 'profile');
                  setIsProfileMenuOpen(false);
                }}
                className="px-4 py-2.5 border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer transition"
              >
                <div className="flex items-center justify-between gap-1">
                  <p className="font-bold text-zinc-900 truncate">{currentUser?.name || 'Matthew Parker'}</p>
                  {currentUser?.authProvider === 'google' && (
                    <span className="shrink-0 flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Google
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 truncate">{currentUser?.email || 'matthew@yourcompany.com'}</p>
                <span className="mt-1 inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                  {currentUser?.role || 'Admin'} • Edit Profile
                </span>
              </div>

              {/* Google Sign-in / Link action */}
              {currentUser?.authProvider !== 'google' ? (
                <button
                  onClick={handleGoogleSignInFromHeader}
                  disabled={isGoogleSigningIn}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-950 border-b border-indigo-100/60 transition font-semibold text-xs text-left"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>{isGoogleSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              ) : (
                <div className="px-4 py-1.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold flex items-center gap-1.5 border-b border-emerald-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Authenticated via Google</span>
                </div>
              )}

              <div className="py-1">
                <button
                  onClick={() => {
                    navigate('settings', 'profile');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition font-medium"
                >
                  <User className="w-4 h-4 text-zinc-400" />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={() => {
                    navigate('settings', 'workspace');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition"
                >
                  <Settings className="w-4 h-4 text-zinc-400" />
                  <span>Workspace Settings</span>
                </button>
                <button
                  onClick={() => {
                    resetToMockData();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition"
                >
                  <RotateCcw className="w-4 h-4 text-zinc-400" />
                  <span>Reload Demo Records</span>
                </button>
              </div>

              <div className="pt-1 border-t border-zinc-100">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 transition font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

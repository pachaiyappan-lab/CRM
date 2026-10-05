import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppRoute =
  | 'dashboard'
  | 'leads'
  | 'contacts'
  | 'companies'
  | 'deals'
  | 'tasks'
  | 'calendar'
  | 'projects'
  | 'proposals'
  | 'invoices'
  | 'communications'
  | 'documents'
  | 'analytics'
  | 'ai'
  | 'team'
  | 'settings'
  | 'auth'
  | 'onboarding';

interface NavigationContextType {
  currentRoute: AppRoute;
  selectedId: string | null;
  navigate: (route: AppRoute, id?: string | null) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isGlobalAddOpen: boolean;
  setGlobalAddOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  globalAddInitialType?: string;
  openGlobalAddWithType: (type: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('dashboard');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [isGlobalAddOpen, setGlobalAddOpen] = useState<boolean>(false);
  const [globalAddInitialType, setGlobalAddInitialType] = useState<string | undefined>(undefined);
  const [isNotificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle URL hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (!hash) {
        setCurrentRoute('dashboard');
        setSelectedId(null);
        return;
      }
      const parts = hash.split('/');
      const route = parts[0] as AppRoute;
      const id = parts[1] || null;
      if (route) {
        setCurrentRoute(route);
        setSelectedId(id);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (route: AppRoute, id: string | null = null) => {
    setCurrentRoute(route);
    setSelectedId(id);
    const hash = id ? `#/${route}/${id}` : `#/${route}`;
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openGlobalAddWithType = (type: string) => {
    setGlobalAddInitialType(type);
    setGlobalAddOpen(true);
  };

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        selectedId,
        navigate,
        isSidebarOpen,
        setSidebarOpen,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        isGlobalAddOpen,
        setGlobalAddOpen,
        isNotificationsOpen,
        setNotificationsOpen,
        globalAddInitialType,
        openGlobalAddWithType,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within a NavigationProvider');
  return context;
};

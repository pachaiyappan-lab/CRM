import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { CommandPalette } from './CommandPalette';
import { GlobalAddModal } from './GlobalAddModal';
import { NotificationDrawer } from './NotificationDrawer';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f4f4f6] text-zinc-900 flex antialiased">
      {/* Sidebar for desktop and drawer for mobile */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals & Drawers */}
      <CommandPalette />
      <GlobalAddModal />
      <NotificationDrawer />
    </div>
  );
};

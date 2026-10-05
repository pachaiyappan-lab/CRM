import React from 'react';
import { LayoutDashboard, Users, Kanban, CheckSquare, Bot, Plus } from 'lucide-react';
import { useNavigation, AppRoute } from '../../context/NavigationContext';

export const MobileNav: React.FC = () => {
  const { currentRoute, navigate, openGlobalAddWithType } = useNavigation();

  const navItems: { route: AppRoute; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { route: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { route: 'leads', label: 'Leads', icon: Users },
    { route: 'deals', label: 'Pipeline', icon: Kanban },
    { route: 'tasks', label: 'Tasks', icon: CheckSquare },
    { route: 'ai', label: 'Copilot', icon: Bot }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const isActive = currentRoute === item.route;
        const Icon = item.icon;
        const isAI = item.route === 'ai';

        return (
          <button
            key={item.route}
            onClick={() => navigate(item.route)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
              isActive
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isAI && !isActive ? 'text-indigo-500' : ''}`} />
              {isAI && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

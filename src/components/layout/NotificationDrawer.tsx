import React from 'react';
import { X, CheckCircle2, AlertTriangle, Sparkles, Info, Trash2, Check } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { useCRM } from '../../context/CRMContext';

export const NotificationDrawer: React.FC = () => {
  const { isNotificationsOpen, setNotificationsOpen, navigate } = useNavigation();
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useCRM();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        onClick={() => setNotificationsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Notifications & AI Alerts</h2>
              <p className="text-xs text-slate-500">Real-time alerts and business insight triggers</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={markAllNotificationsRead}
                title="Mark all as read"
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={clearNotifications}
                title="Clear all"
                className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700">All caught up!</p>
                <p className="text-xs text-slate-500 mt-1">No pending alerts or AI notifications.</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.link) {
                      const parts = notif.link.replace('/', '').split('/');
                      navigate(parts[0] as any, parts[1] || null);
                      setNotificationsOpen(false);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-white border-slate-200 text-slate-600 opacity-80'
                      : notif.type === 'ai'
                      ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950 shadow-xs ring-1 ring-indigo-400/20'
                      : notif.type === 'warning'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-950 shadow-xs'
                      : notif.type === 'success'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {notif.type === 'ai' && <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />}
                      {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                      {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {notif.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900 truncate">{notif.title}</p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                      {notif.link && (
                        <p className="text-[10px] font-semibold text-indigo-600 mt-2 hover:underline">
                          View details →
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
            <span className="text-[11px] text-slate-500">
              {notifications.filter(n => !n.read).length} unread notification(s)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

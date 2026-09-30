import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCheck, AlertTriangle, ShieldCheck, FileCheck, Clock } from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'EXPIRY_ALERT':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'CERTIFICATE_ISSUED':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'APPLICATION_UPDATE':
      case 'ASSIGNMENT':
        return <FileCheck className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-3xl 2xl:max-w-5xl 3xl:max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications & Expiry Alerts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated statutory alerts, inspection updates, and certificate notifications.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold transition-colors shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            No notifications on file.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => markAsRead(notif._id)}
              className={`p-4 text-xs cursor-pointer hover:bg-slate-50 transition-colors flex items-start gap-3.5 ${
                !notif.isRead ? 'bg-amber-50/30' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-800 text-sm">{notif.title}</span>
                  {!notif.isRead && (
                    <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                      New
                    </span>
                  )}
                </div>
                <p className="text-slate-600 mt-1 text-xs leading-relaxed">{notif.message}</p>
                <span className="text-slate-400 text-[11px] block mt-1">
                  {new Date(notif.createdAt).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

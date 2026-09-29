import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
import { Bell, X, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [latestToast, setLatestToast] = useState(null);

  const prevNotificationsRef = useRef([]);

  const fetchNotifications = async (silent = true) => {
    if (!user) return;
    try {
      if (!silent) setLoading(true);
      const res = await api.get('/notifications');
      const newItems = res.data.data || [];
      const newUnread = res.data.unreadCount || 0;

      // Detect if there's a new incoming notification
      if (prevNotificationsRef.current.length > 0 && newItems.length > 0) {
        const newest = newItems[0];
        const isAlreadyKnown = prevNotificationsRef.current.some((p) => p._id === newest._id);
        if (!isAlreadyKnown && !newest.isRead) {
          // Trigger real-time toast alert
          setLatestToast(newest);
          setTimeout(() => setLatestToast(null), 6000);
        }
      }

      prevNotificationsRef.current = newItems;
      setNotifications(newItems);
      setUnreadCount(newUnread);
    } catch (err) {
      console.error('[Notification Error]', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications(false);

      // Fast 3-second polling for real-time notification experience
      const timer = setInterval(() => fetchNotifications(true), 3000);

      // Real-time synchronization event listener
      const handleSync = () => fetchNotifications(true);
      window.addEventListener('metraverify_sync', handleSync);

      let bc;
      if (window.BroadcastChannel) {
        bc = new BroadcastChannel('metraverify_sync_channel');
        bc.onmessage = () => fetchNotifications(true);
      }

      return () => {
        clearInterval(timer);
        window.removeEventListener('metraverify_sync', handleSync);
        if (bc) bc.close();
      };
    } else {
      setNotifications([]);
      setUnreadCount(0);
      prevNotificationsRef.current = [];
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (latestToast?._id === id) setLatestToast(null);
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      setLatestToast(null);
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}

      {/* Real-time Floating Notification Toast */}
      {latestToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="p-2 bg-blue-600/30 text-amber-400 rounded-xl shrink-0 mt-0.5">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Real-Time Alert
              </span>
              <h4 className="text-xs font-bold text-white mt-0.5 truncate">
                {latestToast.title}
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                {latestToast.message}
              </p>
            </div>
            <button
              onClick={() => setLatestToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Just now</span>
            <button
              onClick={() => {
                markAsRead(latestToast._id);
                setLatestToast(null);
              }}
              className="text-blue-400 hover:text-blue-300 font-bold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;

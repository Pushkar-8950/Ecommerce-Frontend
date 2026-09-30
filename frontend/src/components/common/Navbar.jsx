import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import DemoQuickSwitcher from './DemoQuickSwitcher';
import {
  Scale,
  Bell,
  Search,
  LogOut,
  User,
  ShieldCheck,
  CheckCheck,
  ChevronDown,
} from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close menus when clicking outside - enforce one window at a time
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (!e.target.closest('#nav-notifications-btn') && !e.target.closest('#nav-notifications-popover')) {
        setShowNotifications(false);
      }
      if (!e.target.closest('#nav-profile-btn') && !e.target.closest('#nav-profile-menu')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (user?.role === 'BUSINESS_USER') {
      navigate(`/business/instruments?search=${encodeURIComponent(searchQuery)}`);
    } else if (user?.role === 'ADMIN') {
      navigate(`/admin/instruments?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/verify/${encodeURIComponent(searchQuery)}`);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded">HQ ADMIN</span>;
      case 'LMO_OFFICER':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded">LMO OFFICER</span>;
      case 'GATC':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">GATC TEST LAB</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">BUSINESS</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Official Government Prototype Top Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-[10px] sm:text-[11px] py-1 px-3 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="truncate">Legal Metrology Division | Department of Consumer Affairs</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] shrink-0">
          {/* Top navigation links */}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="px-3 sm:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 sm:p-2 text-slate-600 hover:bg-slate-100 rounded-lg shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <Link to={user ? (user.role === 'BUSINESS_USER' ? '/business/dashboard' : user.role === 'LMO_OFFICER' ? '/lmo/dashboard' : user.role === 'GATC' ? '/gatc/dashboard' : '/admin/dashboard') : '/'} className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center text-amber-400 shadow-md shrink-0">
              <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 font-sans truncate">
                  Metra<span className="text-amber-600">Verify</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded">
                  PORTAL
                </span>
              </div>
              <p className="hidden md:block text-[10px] font-medium text-slate-500 tracking-wide truncate">
                Digital Trust for Weights & Measures
              </p>
            </div>
          </Link>
        </div>

        {/* Global Search Box */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Instrument ID, Serial No, or Certificate ID..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </form>

        {/* Action Controls & User Section */}
        <div className="flex items-center gap-3">
          {/* Hackathon Demo Switcher */}
          <DemoQuickSwitcher />

          {/* Notifications Popover */}
          {user && (
            <div className="relative">
              <button
                id="nav-notifications-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Notifications & Alerts"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  id="nav-notifications-popover"
                  className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Notifications & Expiry Alerts</h4>
                      <p className="text-[11px] text-slate-500">{unreadCount} unread message(s)</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 8).map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => markAsRead(notif._id)}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                            !notif.isRead ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-800">{notif.title}</span>
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1">{notif.message}</p>
                          <span className="text-slate-400 text-[10px] mt-1 block">
                            {new Date(notif.createdAt).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-100 text-center">
                    <Link
                      to={
                        user?.role === 'BUSINESS_USER'
                          ? '/business/notifications'
                          : '#'
                      }
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View All Alerts
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Menu or Sign In */}
          {user ? (
            <div className="relative">
              <button
                id="nav-profile-btn"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <span className="text-xs font-bold text-slate-800 block leading-tight">
                    {user.fullName}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {getRoleBadge(user.role)}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div
                  id="nav-profile-menu"
                  className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-1.5rem)] bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50"
                >
                  <div
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (user.role === 'BUSINESS_USER') navigate('/business/profile');
                      else if (user.role === 'GATC') navigate('/gatc/profile');
                      else if (user.role === 'LMO_OFFICER') navigate('/lmo/profile');
                      else if (user.role === 'ADMIN') navigate('/admin/profile');
                    }}
                    className="px-4 py-2 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                    title="Click to view full profile details"
                  >
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {user.fullName}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {user.email}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                      {user.organizationName || user.department}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        if (user.role === 'BUSINESS_USER') navigate('/business/profile');
                        else if (user.role === 'GATC') navigate('/gatc/profile');
                        else if (user.role === 'LMO_OFFICER') navigate('/lmo/profile');
                        else if (user.role === 'ADMIN') navigate('/admin/profile');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Profile Details</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

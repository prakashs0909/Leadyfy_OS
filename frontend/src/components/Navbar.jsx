import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Bell, LogOut, User, CheckCheck, RefreshCw } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="h-16 bg-[#09090B] border-b border-zinc-800/80 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search / Subtitle */}
      <div className="flex items-center space-x-3">
        <span className="text-xs font-semibold text-zinc-400">LEADYFY OS</span>
        <span className="text-zinc-700">|</span>
        <span className="text-xs text-zinc-500 font-medium hidden sm:inline">
          Agency Management & Operations Platform
        </span>
      </div>

      {/* User Actions & Notifications */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition relative"
            title="In-app Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black font-extrabold text-[10px] flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#111111] border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200">System Alerts</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={fetchNotifications}
                    className="text-[11px] text-zinc-400 hover:text-amber-400 flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-amber-400 hover:underline flex items-center space-x-1"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/60">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-zinc-500">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`p-3 text-xs transition ${
                        n.isRead ? 'bg-[#111111] text-zinc-400' : 'bg-zinc-900/50 text-zinc-100 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-amber-400">{n.title}</span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-zinc-300 leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center space-x-3 bg-zinc-900/90 border border-zinc-800/80 pl-2 pr-3 py-1.5 rounded-full">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-amber-500/50" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
          )}
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-zinc-200 leading-none">{user?.name}</div>
            <div className="text-[10px] text-amber-400/90 font-mono mt-0.5">{user?.role}</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-900/50 transition"
          title="Log out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

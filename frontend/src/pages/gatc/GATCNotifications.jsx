import React from 'react';
import { Bell } from 'lucide-react';

export const GATCNotifications = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          System alerts and updates for the Test Centre.
        </p>
      </div>

      <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">No New Notifications</h2>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
          You are all caught up! New application assignments and system updates will appear here.
        </p>
      </div>
    </div>
  );
};

export default GATCNotifications;

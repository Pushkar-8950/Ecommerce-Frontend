import React from 'react';
import { BarChart3 } from 'lucide-react';

export const GATCReports = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate testing and verification reports for Government auditing.
        </p>
      </div>

      <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Reports Module Coming Soon</h2>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
          The comprehensive reports and analytics dashboard is currently under development. It will feature detailed metrics on testing volumes, pass/fail rates, and turnaround times.
        </p>
      </div>
    </div>
  );
};

export default GATCReports;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import StatsCard from '../../components/common/StatsCard';
import StatusBadge from '../../components/common/StatusBadge';
import {
  FileCheck,
  Clock,
  Calendar,
  Award,
  ArrowRight,
  ClipboardList,
  Eye,
  CheckCircle,
  Filter,
  Sparkles,
} from 'lucide-react';

export const LMODashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTimeRange, setActiveTimeRange] = useState('ALL'); // ALL, TODAY, WEEK, MONTH, YEAR

  const fetchDashboard = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get('/dashboard/lmo');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load LMO dashboard', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    // Real-time synchronization across roles
    const handleSync = () => fetchDashboard(true);
    window.addEventListener('metraverify_sync', handleSync);

    let bc;
    if (window.BroadcastChannel) {
      bc = new BroadcastChannel('metraverify_sync_channel');
      bc.onmessage = () => fetchDashboard(true);
    }

    const timer = setInterval(() => fetchDashboard(true), 4000);

    return () => {
      window.removeEventListener('metraverify_sync', handleSync);
      if (bc) bc.close();
      clearInterval(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs text-slate-500 font-medium">Loading Inspector Workstation...</span>
      </div>
    );
  }

  const { metrics = {}, assignedApplications = [] } = data || {};
  const tbm = metrics.timeBasedMetrics || {
    certificates: { today: 0, week: 0, month: 0, year: 0, total: 0 },
    completedInspections: { today: 0, week: 0, month: 0, year: 0, total: 0 },
    pendingInspections: { today: 0, week: 0, month: 0, year: 0, total: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
            Legal Metrology Officer (LMO) Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Field Verification & Stamping Workstation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Conduct 7-point digital inspections, verify standard weights, and issue digital certificates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Link
            to="/lmo/certificates"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors text-center"
          >
            <Award className="w-4 h-4 text-purple-600" />
            <span>Certificates</span>
          </Link>
          <Link
            to="/lmo/applications"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors shrink-0 text-center"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Cases Queue</span>
          </Link>
        </div>
      </div>

      {/* Time-Based Filter Toggles */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
          <Filter className="w-4 h-4 text-purple-600" />
          <span>Timeline Metrics Filter:</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
          {[
            { key: 'ALL', label: 'All-Time' },
            { key: 'TODAY', label: 'Today' },
            { key: 'WEEK', label: 'This Week' },
            { key: 'MONTH', label: 'This Month' },
            { key: 'YEAR', label: 'This Year' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTimeRange(tab.key)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTimeRange === tab.key
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Metrics Rows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Certificates Section */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-purple-700">
              <Award className="w-5 h-5" />
              <h3 className="font-bold text-slate-900">Certificates Issued</h3>
            </div>
            <span className="text-xl font-black text-purple-700">
              {activeTimeRange === 'TODAY'
                ? tbm.certificates?.today || 0
                : activeTimeRange === 'WEEK'
                ? tbm.certificates?.week || 0
                : activeTimeRange === 'MONTH'
                ? tbm.certificates?.month || 0
                : activeTimeRange === 'YEAR'
                ? tbm.certificates?.year || 0
                : tbm.certificates?.total || 0}
            </span>
          </div>

          <div className="space-y-2.5">
            <div
              className={`flex justify-between items-center text-xs p-2 rounded-lg transition-colors ${
                activeTimeRange === 'TODAY' ? 'bg-purple-50 font-bold text-purple-900' : 'text-slate-600'
              }`}
            >
              <span>Today (Daily)</span>
              <span className="font-bold">{tbm.certificates?.today || 0}</span>
            </div>
            <div
              className={`flex justify-between items-center text-xs p-2 rounded-lg transition-colors ${
                activeTimeRange === 'WEEK' ? 'bg-purple-50 font-bold text-purple-900' : 'text-slate-600'
              }`}
            >
              <span>This Week</span>
              <span className="font-bold">{tbm.certificates?.week || 0}</span>
            </div>
            <div
              className={`flex justify-between items-center text-xs p-2 rounded-lg transition-colors ${
                activeTimeRange === 'MONTH' ? 'bg-purple-50 font-bold text-purple-900' : 'text-slate-600'
              }`}
            >
              <span>This Month</span>
              <span className="font-bold">{tbm.certificates?.month || 0}</span>
            </div>
            <div
              className={`flex justify-between items-center text-xs p-2 rounded-lg transition-colors ${
                activeTimeRange === 'YEAR' ? 'bg-purple-50 font-bold text-purple-900' : 'text-slate-600'
              }`}
            >
              <span>This Year</span>
              <span className="font-bold">{tbm.certificates?.year || 0}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2 px-2">
              <span className="font-semibold text-slate-700">Total All-Time</span>
              <span className="font-black text-purple-700 text-sm">
                {tbm.certificates?.total || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Completed Inspections Section */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
              <h3 className="font-bold text-slate-900">Completed Inspections</h3>
            </div>
            <span className="text-xl font-black text-emerald-600">
              {activeTimeRange === 'TODAY'
                ? tbm.completedInspections?.today || 0
                : activeTimeRange === 'WEEK'
                ? tbm.completedInspections?.week || 0
                : activeTimeRange === 'MONTH'
                ? tbm.completedInspections?.month || 0
                : activeTimeRange === 'YEAR'
                ? tbm.completedInspections?.year || 0
                : tbm.completedInspections?.total || 0}
            </span>
          </div>

          <div className="space-y-2.5">
            <div
              className={`flex justify-between items-center text-xs p-2 rounded-lg transition-colors ${
                activeTimeRange === 'TODAY' ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-600'
              }`}
            >
              <span>Today (Daily)</span>
              <span className="font-bold">{tbm.completedInspections?.today || 0}</span>
            </div>
            <div
              className={`flex justify-between items-center text-xs p-2 rounded-lg transition-colors ${
                activeTimeRange === 'WEEK' ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-600'
              }`}
            >
              <span>This Week</span>
              <span className="font-bold">{tbm.completedInspections?.week || 0}</span>
            </div>
            <div
              className={`flex justify-between items-center text-xs p-2 rounded-lg transition-colors ${
                activeTimeRange === 'MONTH' ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-600'
              }`}
            >
              <span>This Month</span>
              <span className="font-bold">{tbm.completedInspections?.month || 0}</span>
            </div>
            <div
              className={`flex justify-between items-center text-xs p-2 rounded-lg transition-colors ${
                activeTimeRange === 'YEAR' ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-600'
              }`}
            >
              <span>This Year</span>
              <span className="font-bold">{tbm.completedInspections?.year || 0}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2 px-2">
              <span className="font-semibold text-slate-700">Total All-Time</span>
              <span className="font-black text-emerald-600 text-sm">
                {tbm.completedInspections?.total || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Pending Inspections Section */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-amber-500">
              <Clock className="w-5 h-5" />
              <h3 className="font-bold text-slate-900">Pending Inspections</h3>
            </div>
            <span className="text-xl font-black text-amber-600">
              {activeTimeRange === 'TODAY'
                ? tbm.pendingInspections?.today || 0
                : activeTimeRange === 'WEEK'
                ? tbm.pendingInspections?.week || 0
                : activeTimeRange === 'MONTH'
                ? tbm.pendingInspections?.month || 0
                : activeTimeRange === 'YEAR'
                ? tbm.pendingInspections?.year || 0
                : tbm.pendingInspections?.total || 0}
            </span>
          </div>

          <div className="space-y-2.5">
            <div
              className={`flex justify-between items-center text-xs p-2 rounded-lg transition-colors ${
                activeTimeRange === 'TODAY' ? 'bg-amber-50 font-bold text-amber-900' : 'text-slate-600'
              }`}
            >
              <span>Scheduled Today</span>
              <span className="font-bold">{tbm.pendingInspections?.today || 0}</span>
            </div>
            <div
              className={`flex justify-between items-center text-xs p-2 rounded-lg transition-colors ${
                activeTimeRange === 'WEEK' ? 'bg-amber-50 font-bold text-amber-900' : 'text-slate-600'
              }`}
            >
              <span>Scheduled This Week</span>
              <span className="font-bold">{tbm.pendingInspections?.week || 0}</span>
            </div>
            <div
              className={`flex justify-between items-center text-xs p-2 rounded-lg transition-colors ${
                activeTimeRange === 'MONTH' ? 'bg-amber-50 font-bold text-amber-900' : 'text-slate-600'
              }`}
            >
              <span>Scheduled This Month</span>
              <span className="font-bold">{tbm.pendingInspections?.month || 0}</span>
            </div>
            <div
              className={`flex justify-between items-center text-xs p-2 rounded-lg transition-colors ${
                activeTimeRange === 'YEAR' ? 'bg-amber-50 font-bold text-amber-900' : 'text-slate-600'
              }`}
            >
              <span>Scheduled This Year</span>
              <span className="font-bold">{tbm.pendingInspections?.year || 0}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2 px-2">
              <span className="font-semibold text-slate-700">Total Pending Queue</span>
              <span className="font-black text-amber-600 text-sm">
                {tbm.pendingInspections?.total || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Inspection Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Assigned Inspection Cases</h3>
            <p className="text-xs text-slate-500">Scheduled verification queue requiring on-site testing</p>
          </div>
          <Link
            to="/lmo/applications"
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[680px]">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Instrument Particulars</th>
                <th className="py-3 px-4">Commercial Business</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignedApplications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">
                    No cases assigned to your circle at present.
                  </td>
                </tr>
              ) : (
                assignedApplications.slice(0, 6).map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-purple-700">
                      {app.applicationId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {app.instrument?.instrumentType || 'Instrument'}
                      </span>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        {app.instrument?.instrumentId} (S/N: {app.instrument?.serialNumber})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900 block">
                        {app.owner?.organizationName || app.owner?.fullName}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {app.owner?.district}, {app.owner?.state}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {new Date(app.scheduledDate || app.preferredDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/lmo/inspect/${app._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs shadow-sm transition-colors"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Start Inspection</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LMODashboard;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import StatsCard from '../../components/common/StatsCard';
import StatusBadge from '../../components/common/StatusBadge';
import ExpiryAlertBanner from '../../components/common/ExpiryAlertBanner';
import {
  Scale,
  ShieldCheck,
  Clock,
  AlertTriangle,
  XCircle,
  PlusCircle,
  FileCheck,
  Award,
  ArrowRight,
  Eye,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

export const BusinessDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get('/dashboard/business');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load business dashboard', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

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
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  const { metrics, expiryAlerts, statusDistribution, monthlyActivity, recentApplications } =
    data || {
      metrics: {},
      expiryAlerts: [],
      statusDistribution: [],
      monthlyActivity: [],
      recentApplications: [],
    };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Commercial Stakeholder Portal
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Instrument Verification & Stamping Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time compliance monitoring for commercial weights and measuring instruments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/business/instruments/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Register Instrument</span>
          </Link>

          <Link
            to="/business/applications/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            <span>Apply for Verification</span>
          </Link>

          <Link
            to="/business/certificates"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
          >
            <Award className="w-4 h-4 text-slate-600" />
            <span>View Certificates</span>
          </Link>
        </div>
      </div>

      {/* Prominent Expiry Alert Banner (if any instruments <= 30 days or expired) */}
      <ExpiryAlertBanner expiringList={expiryAlerts} expiredCount={metrics.expired} />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Registered"
          value={metrics.totalInstruments || 0}
          icon={Scale}
          color="blue"
          onClick={() => navigate('/business/instruments')}
        />
        <StatsCard
          title="Verified & Active"
          value={metrics.verifiedInstruments || 0}
          icon={ShieldCheck}
          color="emerald"
          subtitle="Legally stamped"
          onClick={() => navigate('/business/instruments?status=VERIFIED')}
        />
        <StatsCard
          title="Pending Application"
          value={metrics.pendingApplications || 0}
          icon={Clock}
          color="amber"
          subtitle="In pipeline"
          onClick={() => navigate('/business/applications')}
        />
        <StatsCard
          title="Expiring Soon"
          value={metrics.expiringSoon || 0}
          icon={AlertTriangle}
          color="amber"
          subtitle="Within 30 days"
          onClick={() => navigate('/business/instruments?expiryFilter=EXPIRING_SOON')}
        />
        <StatsCard
          title="Stamping Expired"
          value={metrics.expired || 0}
          icon={XCircle}
          color="rose"
          subtitle="Action required"
          onClick={() => navigate('/business/instruments?expiryFilter=EXPIRED')}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Status Distribution (Donut Chart) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Instrument Verification Status</h3>
            <p className="text-xs text-slate-500">Distribution across active assets</p>
          </div>

          <div className="flex-1 min-h-[220px] flex items-center justify-center">
            {statusDistribution.length === 0 ? (
              <span className="text-xs text-slate-400">No instrument data</span>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-2 justify-center text-[11px]">
            {statusDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Verification & Applications Activity (Bar Chart) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Verification Lifecycle Activity</h3>
              <p className="text-xs text-slate-500">Applications submitted vs. certificates stamped ({new Date().getFullYear()})</p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
              Monthly Trends
            </span>
          </div>

          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={monthlyActivity.slice(0, 9)} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="applications" name="Applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="verifications" name="Certificates Issued" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Verification Cases</h3>
            <p className="text-xs text-slate-500">Track progress through inspection and certification</p>
          </div>
          <Link
            to="/business/applications"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All Cases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Instrument Details</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentApplications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    No verification applications found.
                  </td>
                </tr>
              ) : (
                recentApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {app.applicationId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {app.instrument?.instrumentType || 'Instrument'}
                      </span>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        {app.instrument?.instrumentId} ({app.instrument?.serialNumber})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-700">
                        {app.applicationType === 'RE_VERIFICATION'
                          ? 'Re-verification'
                          : 'New Verification'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(app.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {app.assignedOfficer ? (
                        <div>
                          <span className="font-medium text-slate-800 block">
                            {app.assignedOfficer.fullName}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {app.assignedOfficer.designation || 'LMO Inspector'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending Assignment</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/business/applications/${app._id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Track</span>
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

export default BusinessDashboard;

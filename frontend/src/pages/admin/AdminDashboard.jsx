import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import StatsCard from '../../components/common/StatsCard';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Scale,
  ShieldCheck,
  Clock,
  AlertTriangle,
  XCircle,
  FileCheck,
  Award,
  Users,
  Shield,
  ArrowRight,
  TrendingUp,
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

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminDashboard = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get('/dashboard/admin');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load admin dashboard', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDashboard();

    // Real-time synchronization
    const handleSync = () => fetchAdminDashboard(true);
    window.addEventListener('metraverify_sync', handleSync);

    let bc;
    if (window.BroadcastChannel) {
      bc = new BroadcastChannel('metraverify_sync_channel');
      bc.onmessage = () => fetchAdminDashboard(true);
    }

    const timer = setInterval(() => fetchAdminDashboard(true), 4000);

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
        <span className="text-xs text-slate-500 font-medium">Loading HQ Analytics & Operations Center...</span>
      </div>
    );
  }

  const { metrics = {}, charts = {}, recentApplications = [] } = data || {};
  const { statusDistribution = [], monthlyTrends = [] } = charts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            National Executive Command Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Legal Metrology Administration & Compliance Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Jurisdictional oversight, officer allocation, audit trails, and national instrument registries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <Link
            to="/admin/allocation"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors text-center"
          >
            <Clock className="w-4 h-4" />
            <span>Officer Allocation</span>
          </Link>

          <Link
            to="/admin/audit-logs"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors text-center"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Audit Trail</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Instruments"
          value={metrics.totalInstruments || 0}
          icon={Scale}
          color="blue"
          subtitle="Across all districts"
          onClick={() => navigate('/admin/instruments')}
        />
        <StatsCard
          title="Verified & Active"
          value={metrics.verified || 0}
          icon={ShieldCheck}
          color="emerald"
          subtitle="Valid stamping"
          onClick={() => navigate('/admin/instruments?status=VERIFIED')}
        />
        <StatsCard
          title="Pending Applications"
          value={metrics.pending || 0}
          icon={Clock}
          color="amber"
          subtitle="Awaiting action"
          onClick={() => navigate('/admin/applications')}
        />
        <StatsCard
          title="Expiring Soon"
          value={metrics.expiringSoon || 0}
          icon={AlertTriangle}
          color="amber"
          subtitle="Due within 30 days"
          onClick={() => navigate('/admin/instruments?expiryFilter=EXPIRING_SOON')}
        />
      </div>

      {/* Metrics Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Stamping Expired"
          value={metrics.expired || 0}
          icon={XCircle}
          color="rose"
          subtitle="Non-compliant scales"
          onClick={() => navigate('/admin/instruments?expiryFilter=EXPIRED')}
        />
        <StatsCard
          title="Applications This Month"
          value={metrics.applicationsThisMonth || 0}
          icon={FileCheck}
          color="blue"
          subtitle="Monthly inflow"
        />
        <StatsCard
          title="Certificates Issued"
          value={metrics.certificatesIssued || 0}
          icon={Award}
          color="purple"
          subtitle="Active QR stamps"
          onClick={() => navigate('/admin/certificates')}
        />
        <StatsCard
          title="Active Officers & GATCs"
          value={(metrics.officersCount || 0) + (metrics.gatcCount || 0)}
          icon={Users}
          color="emerald"
          subtitle={`${metrics.officersCount || 0} LMOs • ${metrics.gatcCount || 0} Labs`}
          onClick={() => navigate('/admin/officers')}
        />
      </div>

      {/* Charts Section: 4 Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Verification Status Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">National Instrument Stamping Status</h3>
            <p className="text-xs text-slate-500">Live breakdown of verified vs. pending and expired assets</p>
          </div>
          <div className="flex-1 min-h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
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

        {/* Chart 2: Monthly Trends */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Monthly Verification & Stamping Trends</h3>
            <p className="text-xs text-slate-500">Intake applications vs. official certificates stamped ({new Date().getFullYear()})</p>
          </div>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={monthlyTrends.slice(0, 9)} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="applications" name="Applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="certificates" name="Certificates Issued" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Applications Management Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Incoming Applications Awaiting Assignment</h3>
            <p className="text-xs text-slate-500">Allocate field officers or approved test laboratories</p>
          </div>
          <Link
            to="/admin/applications"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Manage All Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[680px]">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Enterprise</th>
                <th className="py-3 px-4">Instrument</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Officer Assigned</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentApplications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">
                    {app.applicationId}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">
                      {app.owner?.organizationName || app.owner?.fullName}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {app.owner?.district}, {app.owner?.state}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800 block">
                      {app.instrument?.instrumentType}
                    </span>
                    <span className="text-[11px] text-slate-500 block font-mono">
                      {app.instrument?.instrumentId}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {app.assignedOfficer?.fullName || (
                      <span className="text-amber-600 font-semibold italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/admin/allocation?case=${app.applicationId}`}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-sm transition-colors inline-block"
                    >
                      Allocate Officer
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

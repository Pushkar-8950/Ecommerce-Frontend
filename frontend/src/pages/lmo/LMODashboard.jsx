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
} from 'lucide-react';

export const LMODashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/lmo');
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to load LMO dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
            Legal Metrology Officer (LMO) Portal
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Field Verification & Stamping Workstation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Conduct 7-point digital inspections, verify standard weights, and issue digital certificates.
          </p>
        </div>

        <Link
          to="/lmo/applications"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors shrink-0"
        >
          <ClipboardList className="w-4 h-4" />
          <span>View Assigned Queue</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Scheduled"
          value={metrics.todaysInspections || 0}
          icon={Calendar}
          color="blue"
          subtitle="Field & bench visits"
        />
        <StatsCard
          title="Pending Inspections"
          value={metrics.pendingInspections || 0}
          icon={Clock}
          color="amber"
          subtitle="In your caseload"
        />
        <StatsCard
          title="Completed Inspections"
          value={metrics.completedInspections || 0}
          icon={CheckCircle}
          color="emerald"
          subtitle="Evaluated cases"
        />
        <StatsCard
          title="Certificates Issued"
          value={metrics.certificatesIssued || 0}
          icon={Award}
          color="purple"
          subtitle="Digitally stamped"
        />
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
          <table className="w-full text-left text-xs">
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

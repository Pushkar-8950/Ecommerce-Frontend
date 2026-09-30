import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import StatsCard from '../../components/common/StatsCard';
import StatusBadge from '../../components/common/StatusBadge';
import { Building2, ClipboardList, CheckCircle, Award, Eye, FileCheck } from 'lucide-react';

export const GATCDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/gatc');
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to load GATC dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs text-slate-500 font-medium">Loading GATC Testing Station...</span>
      </div>
    );
  }

  const { metrics = {}, assignedApplications = [] } = data || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            Government Approved Test Centre (GATC)
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Verification & Testing Workstation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Independent laboratory verification and accuracy testing under Legal Metrology accreditation.
          </p>
        </div>

        <Link
          to="/gatc/applications"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors shrink-0 w-full sm:w-auto text-center"
        >
          <ClipboardList className="w-4 h-4" />
          <span>Verification Queue</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatsCard
          title="Assigned"
          value={metrics.assignedCases || 0}
          icon={ClipboardList}
          color="amber"
          subtitle="Total referred"
        />
        <StatsCard
          title="Pending"
          value={metrics.pendingTests || 0}
          icon={Building2}
          color="blue"
          subtitle="Awaiting testing"
        />
        <StatsCard
          title="Completed"
          value={metrics.completedTests || 0}
          icon={CheckCircle}
          color="emerald"
          subtitle="Total finalized"
        />
        <StatsCard
          title="Passed"
          value={metrics.passed || 0}
          icon={Award}
          color="emerald"
          subtitle="Successfully passed"
        />
        <StatsCard
          title="Failed"
          value={metrics.failed || 0}
          icon={Eye}
          color="rose"
          subtitle="Rejected/Failed"
        />
        <StatsCard
          title="Certificates Generated"
          value={metrics.calibrationsIssued || 0}
          icon={FileCheck}
          color="purple"
          subtitle="Digital verified"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Verification Queue</h3>
            <p className="text-xs text-slate-500">Instruments scheduled for laboratory standard verification test</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Case Ref</th>
                <th className="py-3 px-4">Instrument Specification</th>
                <th className="py-3 px-4">Applicant Enterprise</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignedApplications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">
                    No verification cases assigned to this test centre.
                  </td>
                </tr>
              ) : (
                assignedApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-700">
                      {app.applicationId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {app.instrument?.instrumentType}
                      </span>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        {app.instrument?.instrumentId} • S/N: {app.instrument?.serialNumber}
                      </span>
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
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/gatc/inspect/${app._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shadow-sm transition-colors"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Conduct Inspection</span>
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

export default GATCDashboard;

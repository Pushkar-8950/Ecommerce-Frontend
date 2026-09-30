import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/common/StatusBadge';
import { FileCheck, Search } from 'lucide-react';

export const GATCApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications');
        setApplications(res.data.data || []);
      } catch (err) {
        console.error('Failed to load GATC cases', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Verification Queue</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Laboratory bench cases referred for precision measurement and verification.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading test cases...
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No verification cases assigned.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-700">
                      {app.applicationId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {app.instrument?.instrumentType}
                      </span>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        {app.instrument?.instrumentId}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {app.owner?.organizationName || app.owner?.fullName}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GATCApplications;

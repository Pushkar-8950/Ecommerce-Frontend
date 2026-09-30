import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/common/StatusBadge';
import { History, Eye } from 'lucide-react';

export const GATCHistory = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications');
        // Filter applications assigned to GATC
        const gatcApps = (res.data.data || []).filter(a => a.assignedToType === 'GATC' || a.assignedOfficer);
        setApplications(gatcApps);
      } catch (err) {
        console.error('Failed to load inspection history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredApps = applications.filter((app) => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return ['SUBMITTED', 'ASSIGNED'].includes(app.status);
    if (filter === 'SCHEDULED') return app.status === 'SCHEDULED';
    if (filter === 'COMPLETED') return ['VERIFIED', 'REJECTED', 'CERTIFICATE_ISSUED'].includes(app.status);
    if (filter === 'PASSED') return ['VERIFIED', 'CERTIFICATE_ISSUED'].includes(app.status);
    if (filter === 'FAILED') return app.status === 'REJECTED';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Verification History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Archived laboratory verification logs and physical testing records.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs">
          {['ALL', 'PENDING', 'SCHEDULED', 'COMPLETED', 'PASSED', 'FAILED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold transition-colors text-[11px] sm:text-xs ${
                filter === f ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading verification records...
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No verification records found for the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-4">Commercial Enterprise</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-700">
                      {app.applicationId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {app.instrument?.instrumentType}
                      </span>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        {app.instrument?.instrumentId} (S/N: {app.instrument?.serialNumber})
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
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(app.updatedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {app.certificate ? (
                        <Link
                          to={`/business/certificates/${app.certificate._id || app.certificate}`}
                          className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                        >
                          View Certificate
                        </Link>
                      ) : (
                        <span className="text-slate-400 italic">No Certificate</span>
                      )}
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

export default GATCHistory;

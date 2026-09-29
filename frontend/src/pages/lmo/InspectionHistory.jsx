import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/common/StatusBadge';
import { History, Eye, CheckCircle, XCircle } from 'lucide-react';

export const InspectionHistory = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications');
        // Filter applications that have completed inspection
        const completed = (res.data.data || []).filter((a) =>
          ['VERIFIED', 'REJECTED', 'CERTIFICATE_ISSUED'].includes(a.status)
        );
        setApplications(completed);
      } catch (err) {
        console.error('Failed to load inspection history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Completed Inspection Records</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Archived statutory verification logs and physical stamping records.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading inspection records...
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No completed inspection records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-4">Commercial Enterprise</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">Completion Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-purple-700">
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
                          className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                        >
                          View Certificate
                        </Link>
                      ) : (
                        <span className="text-slate-400 italic">No Certificate (Rejected)</span>
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

export default InspectionHistory;

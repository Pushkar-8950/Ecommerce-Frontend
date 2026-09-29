import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/common/StatusBadge';
import {
  ClipboardList,
  PlusCircle,
  Search,
  Eye,
  Calendar,
  User,
  ArrowRight,
} from 'lucide-react';

export const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await api.get('/applications', { params });
      setApplications(res.data.data || []);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Verification Cases & Applications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track status through scheduling, digital inspection, and certificate stamping.
          </p>
        </div>

        <Link
          to="/business/applications/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Apply for Verification</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex-1 w-full sm:max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Application ID or Instrument ID..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Application Statuses</option>
            <option value="SUBMITTED">Submitted / Under Review</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="INSPECTION">Under Inspection</option>
            <option value="CERTIFICATE_ISSUED">Certificate Issued</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading cases...
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No Applications Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't submitted any verification applications matching this filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Preferred / Scheduled Date</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Assigned Officer</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      <Link to={`/business/applications/${app._id}`} className="hover:underline">
                        {app.applicationId}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {app.instrument?.instrumentType || 'Instrument'}
                      </span>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        {app.instrument?.instrumentId} ({app.instrument?.model})
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {app.applicationType === 'RE_VERIFICATION' ? 'Re-verification' : 'New Verification'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(app.scheduledDate || app.preferredDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {app.assignedOfficer ? (
                        <div>
                          <span className="font-semibold text-slate-800 block">
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationList;

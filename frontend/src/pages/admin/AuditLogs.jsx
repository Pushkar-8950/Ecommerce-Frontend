import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { History, Search, Shield, Filter, Clock } from 'lucide-react';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (actionFilter) params.action = actionFilter;
      const res = await api.get('/audit-logs', { params });
      setLogs(res.data.data || []);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const getActionBadge = (action) => {
    let color = 'bg-slate-100 text-slate-800';
    if (action.includes('CERTIFICATE')) color = 'bg-emerald-100 text-emerald-800 font-bold';
    else if (action.includes('INSPECTION')) color = 'bg-purple-100 text-purple-800 font-bold';
    else if (action.includes('APPLICATION')) color = 'bg-blue-100 text-blue-800 font-bold';
    else if (action.includes('REVOKED') || action.includes('REJECTED')) color = 'bg-rose-100 text-rose-800 font-bold';

    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider ${color}`}>
        {action}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Tamper-Evident Audit Trail</h1>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
              IMMUTABLE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Full compliance record of system events, user registrations, officer actions, inspections, and stamping decisions.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex-1 w-full sm:max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, user name, or entity ID..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </form>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
        >
          <option value="">All Actions</option>
          <option value="CERTIFICATE_ISSUED">CERTIFICATE_ISSUED</option>
          <option value="INSPECTION_COMPLETED">INSPECTION_COMPLETED</option>
          <option value="INSPECTION_STARTED">INSPECTION_STARTED</option>
          <option value="APPLICATION_ASSIGNED">APPLICATION_ASSIGNED</option>
          <option value="APPLICATION_SUBMITTED">APPLICATION_SUBMITTED</option>
          <option value="INSTRUMENT_CREATED">INSTRUMENT_CREATED</option>
          <option value="USER_REGISTERED">USER_REGISTERED</option>
          <option value="STATUS_CHANGED">STATUS_CHANGED</option>
          <option value="CERTIFICATE_REVOKED">CERTIFICATE_REVOKED</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading audit trail...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Timestamp (IST)</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Actor / User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Details & Audit Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt || log.timestamp).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {log.userName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {log.userRole}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{log.entity}</span>
                      <span className="font-mono text-[10px] text-blue-600 block">{log.entityId}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {typeof log.details === 'object'
                        ? JSON.stringify(log.details)
                        : String(log.details)}
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

export default AuditLogs;

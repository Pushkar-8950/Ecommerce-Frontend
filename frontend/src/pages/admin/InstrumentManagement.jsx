import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/common/StatusBadge';
import { Scale, Search, Eye, Filter } from 'lucide-react';

export const InstrumentManagement = () => {
  const [searchParams] = useSearchParams();
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [stateFilter, setStateFilter] = useState('');
  const [expiryFilter, setExpiryFilter] = useState(searchParams.get('expiryFilter') || '');

  const fetchInstruments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (stateFilter) params.state = stateFilter;
      if (expiryFilter) params.expiryFilter = expiryFilter;

      const res = await api.get('/instruments', { params });
      setInstruments(res.data.data || []);
    } catch (err) {
      console.error('Failed to load global instrument registry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstruments();
  }, [statusFilter, stateFilter, expiryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInstruments();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">National Instrument Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central repository of all commercial, industrial, and precision weighing and measuring devices.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex-1 w-full md:max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Instrument ID, Serial No, Business, District..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="VERIFIED">Verified & Active</option>
            <option value="REGISTERED">Registered</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="UNDER_INSPECTION">Under Inspection</option>
            <option value="EXPIRED">Stamping Expired</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="">All States</option>
            <option value="Delhi">Delhi</option>
            <option value="Haryana">Haryana</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Rajasthan">Rajasthan</option>
          </select>

          <select
            value={expiryFilter}
            onChange={(e) => setExpiryFilter(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="">All Validity States</option>
            <option value="EXPIRING_SOON">Expiring Soon (&le; 30d)</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading registry...
          </div>
        ) : instruments.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No instruments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[720px]">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Instrument ID</th>
                  <th className="py-3 px-4">Type & Capacity</th>
                  <th className="py-3 px-4">Owner Enterprise</th>
                  <th className="py-3 px-4">Jurisdiction</th>
                  <th className="py-3 px-4">Stamping Status</th>
                  <th className="py-3 px-4">Validity</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {instruments.map((inst) => {
                  const expiry = inst.expiryCalculated;
                  return (
                    <tr key={inst._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">
                        {inst.instrumentId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {inst.instrumentType}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {inst.capacity} • {inst.manufacturer}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {inst.owner?.organizationName || inst.owner?.fullName}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {inst.owner?.phone}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {inst.district}, {inst.state}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={inst.status} />
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {inst.nextVerificationDueDate ? (
                          <div>
                            <span>
                              {new Date(inst.nextVerificationDueDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            {expiry && (
                              <span
                                className={`text-[10px] font-bold block ${
                                  expiry.status === 'EXPIRED'
                                    ? 'text-rose-600'
                                    : expiry.status === 'EXPIRING_SOON'
                                    ? 'text-amber-600'
                                    : 'text-emerald-600'
                                }`}
                              >
                                {expiry.label}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unstamped</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/business/instruments/${inst._id}`}
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg inline-block"
                          title="View Instrument"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstrumentManagement;

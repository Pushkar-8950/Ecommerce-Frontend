import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Scale,
  PlusCircle,
  Search,
  Filter,
  FileCheck,
  Eye,
  AlertTriangle,
  Calendar,
  Layers,
} from 'lucide-react';

export const InstrumentList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [expiryFilter, setExpiryFilter] = useState(searchParams.get('expiryFilter') || '');

  const fetchInstruments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (expiryFilter) params.expiryFilter = expiryFilter;

      const res = await api.get('/instruments', { params });
      setInstruments(res.data.data || []);
    } catch (err) {
      console.error('Failed to load instruments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstruments();
  }, [statusFilter, expiryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInstruments();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Registered Instruments</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Legal Metrology inventory registry for weighing and measuring devices.
          </p>
        </div>

        <Link
          to="/business/instruments/new"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors shrink-0 w-full sm:w-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Instrument</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full md:max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Instrument ID, Serial No, or Model..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Statuses</option>
            <option value="VERIFIED">Verified / Certified</option>
            <option value="REGISTERED">Registered (New)</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="UNDER_INSPECTION">Under Inspection</option>
            <option value="EXPIRED">Stamping Expired</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Expiry Filter */}
          <select
            value={expiryFilter}
            onChange={(e) => setExpiryFilter(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Expiry Status</option>
            <option value="EXPIRING_SOON">Expiring Soon (&le;30 Days)</option>
            <option value="EXPIRED">Already Expired</option>
          </select>

          {(search || statusFilter || expiryFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setExpiryFilter('');
              }}
              className="text-xs text-blue-600 hover:underline px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Instruments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading registry...
          </div>
        ) : instruments.length === 0 ? (
          <div className="py-16 text-center">
            <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No Instruments Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No registered weights or measures match the selected search criteria.
            </p>
            <Link
              to="/business/instruments/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Register an Instrument
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[720px]">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Instrument ID</th>
                  <th className="py-3 px-4">Type & Model</th>
                  <th className="py-3 px-4">Serial No.</th>
                  <th className="py-3 px-4">Capacity & Class</th>
                  <th className="py-3 px-4">Stamping Status</th>
                  <th className="py-3 px-4">Next Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {instruments.map((inst) => {
                  const expiry = inst.expiryCalculated;
                  return (
                    <tr key={inst._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">
                        <Link
                          to={`/business/instruments/${inst._id}`}
                          className="hover:underline"
                        >
                          {inst.instrumentId}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {inst.instrumentType}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {inst.manufacturer} - {inst.model}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {inst.serialNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 block">
                          {inst.capacity}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {inst.accuracyClass}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={inst.status} />
                      </td>
                      <td className="py-3 px-4">
                        {inst.nextVerificationDueDate ? (
                          <div>
                            <span className="text-slate-700 block font-medium">
                              {new Date(inst.nextVerificationDueDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            {expiry && (
                              <span
                                className={`text-[10px] font-semibold block ${
                                  expiry.status === 'EXPIRED'
                                    ? 'text-rose-600'
                                    : expiry.status === 'EXPIRING_SOON'
                                    ? 'text-amber-600 font-bold'
                                    : 'text-emerald-600'
                                }`}
                              >
                                {expiry.label}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not Verified Yet</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/business/instruments/${inst._id}`}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Instrument Particulars"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Quick Apply Button */}
                          {['REGISTERED', 'EXPIRED', 'VERIFIED'].includes(inst.status) && (
                            <Link
                              to={`/business/applications/new?instrumentId=${inst._id}&type=${
                                inst.status === 'REGISTERED' ? 'NEW_VERIFICATION' : 'RE_VERIFICATION'
                              }`}
                              className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                              title="Apply for Stamping"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                              <span>Apply</span>
                            </Link>
                          )}
                        </div>
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

export default InstrumentList;

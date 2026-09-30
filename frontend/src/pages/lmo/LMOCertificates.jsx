import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Award,
  Download,
  Eye,
  ExternalLink,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

export const LMOCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('ALL'); // ALL, TODAY, WEEK, MONTH, YEAR
  const [search, setSearch] = useState('');

  const fetchCerts = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get('/certificates');
      setCertificates(res.data.data || []);
    } catch (err) {
      console.error('Failed to load certificates', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();

    const handleSync = () => fetchCerts(true);
    window.addEventListener('metraverify_sync', handleSync);

    let bc;
    if (window.BroadcastChannel) {
      bc = new BroadcastChannel('metraverify_sync_channel');
      bc.onmessage = () => fetchCerts(true);
    }

    const timer = setInterval(() => fetchCerts(true), 4000);

    return () => {
      window.removeEventListener('metraverify_sync', handleSync);
      if (bc) bc.close();
      clearInterval(timer);
    };
  }, []);

  // Compute time counts
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const stats = {
    today: certificates.filter((c) => new Date(c.issueDate || c.verificationDate || c.createdAt) >= todayStart).length,
    week: certificates.filter((c) => new Date(c.issueDate || c.verificationDate || c.createdAt) >= weekStart).length,
    month: certificates.filter((c) => new Date(c.issueDate || c.verificationDate || c.createdAt) >= monthStart).length,
    year: certificates.filter((c) => new Date(c.issueDate || c.verificationDate || c.createdAt) >= yearStart).length,
    total: certificates.length,
  };

  // Filter list by search and timeFilter
  const filtered = certificates.filter((cert) => {
    const certDate = new Date(cert.issueDate || cert.verificationDate || cert.createdAt);

    if (timeFilter === 'TODAY' && certDate < todayStart) return false;
    if (timeFilter === 'WEEK' && certDate < weekStart) return false;
    if (timeFilter === 'MONTH' && certDate < monthStart) return false;
    if (timeFilter === 'YEAR' && certDate < yearStart) return false;

    if (search) {
      const s = search.toLowerCase();
      const matchNumber = cert.certificateNumber?.toLowerCase().includes(s);
      const matchInst = cert.instrumentId?.toLowerCase().includes(s) || cert.instrumentType?.toLowerCase().includes(s);
      const matchBiz = cert.businessName?.toLowerCase().includes(s);
      const matchStamp = cert.digitalStampCode?.toLowerCase().includes(s);
      if (!matchNumber && !matchInst && !matchBiz && !matchStamp) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
            Stamping Records & Output
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Issued Verification Certificates
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Periodic certificate issuance volume, digital seal stamps, and QR code audit repository.
          </p>
        </div>

        <Link
          to="/lmo/dashboard"
          className="w-full sm:w-auto text-center px-4 py-2.5 sm:py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors shrink-0"
        >
          Back to Workstation
        </Link>
      </div>

      {/* Time-Based Metrics Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          onClick={() => setTimeFilter('TODAY')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            timeFilter === 'TODAY'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-400/30'
              : 'bg-white text-slate-900 border-slate-200 hover:border-purple-300'
          }`}
        >
          <span className={`text-[10px] font-bold block ${timeFilter === 'TODAY' ? 'text-purple-200' : 'text-slate-400'}`}>
            TODAY
          </span>
          <span className="text-2xl font-black mt-1 block">{stats.today}</span>
          <span className={`text-[10px] block mt-0.5 ${timeFilter === 'TODAY' ? 'text-purple-100' : 'text-slate-500'}`}>
            Issued today
          </span>
        </div>

        <div
          onClick={() => setTimeFilter('WEEK')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            timeFilter === 'WEEK'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-400/30'
              : 'bg-white text-slate-900 border-slate-200 hover:border-purple-300'
          }`}
        >
          <span className={`text-[10px] font-bold block ${timeFilter === 'WEEK' ? 'text-purple-200' : 'text-slate-400'}`}>
            THIS WEEK
          </span>
          <span className="text-2xl font-black mt-1 block">{stats.week}</span>
          <span className={`text-[10px] block mt-0.5 ${timeFilter === 'WEEK' ? 'text-purple-100' : 'text-slate-500'}`}>
            Weekly output
          </span>
        </div>

        <div
          onClick={() => setTimeFilter('MONTH')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            timeFilter === 'MONTH'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-400/30'
              : 'bg-white text-slate-900 border-slate-200 hover:border-purple-300'
          }`}
        >
          <span className={`text-[10px] font-bold block ${timeFilter === 'MONTH' ? 'text-purple-200' : 'text-slate-400'}`}>
            THIS MONTH
          </span>
          <span className="text-2xl font-black mt-1 block">{stats.month}</span>
          <span className={`text-[10px] block mt-0.5 ${timeFilter === 'MONTH' ? 'text-purple-100' : 'text-slate-500'}`}>
            Monthly volume
          </span>
        </div>

        <div
          onClick={() => setTimeFilter('YEAR')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            timeFilter === 'YEAR'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-400/30'
              : 'bg-white text-slate-900 border-slate-200 hover:border-purple-300'
          }`}
        >
          <span className={`text-[10px] font-bold block ${timeFilter === 'YEAR' ? 'text-purple-200' : 'text-slate-400'}`}>
            THIS YEAR
          </span>
          <span className="text-2xl font-black mt-1 block">{stats.year}</span>
          <span className={`text-[10px] block mt-0.5 ${timeFilter === 'YEAR' ? 'text-purple-100' : 'text-slate-500'}`}>
            Yearly throughput
          </span>
        </div>

        <div
          onClick={() => setTimeFilter('ALL')}
          className={`p-4 rounded-xl border cursor-pointer transition-all col-span-2 sm:col-span-1 ${
            timeFilter === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className={`text-[10px] font-bold block ${timeFilter === 'ALL' ? 'text-amber-400' : 'text-slate-400'}`}>
            ALL-TIME
          </span>
          <span className="text-2xl font-black mt-1 block">{stats.total}</span>
          <span className={`text-[10px] block mt-0.5 ${timeFilter === 'ALL' ? 'text-slate-300' : 'text-slate-500'}`}>
            Total stamped
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Certificate No, Business, Instrument ID, Stamp Code..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Filter Period:</span>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-bold"
          >
            <option value="ALL">All-Time Certificates</option>
            <option value="TODAY">Issued Today</option>
            <option value="WEEK">Issued This Week</option>
            <option value="MONTH">Issued This Month</option>
            <option value="YEAR">Issued This Year</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading certificates...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No certificates match the selected time filter or search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[720px]">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Certificate Ref & QR</th>
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-4">Enterprise</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Validity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((cert) => (
                  <tr key={cert._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {cert.qrCodeDataUrl ? (
                          <img
                            src={cert.qrCodeDataUrl}
                            alt="QR"
                            className="w-8 h-8 rounded border border-slate-200 p-0.5 bg-white shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                            <Award className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <Link
                            to={`/business/certificates/${cert._id}`}
                            className="font-mono font-bold text-purple-700 hover:underline block"
                          >
                            {cert.certificateNumber}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {cert.digitalStampCode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{cert.instrumentType}</span>
                      <span className="text-[11px] text-slate-500 block font-mono">{cert.instrumentId}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{cert.businessName}</span>
                      <span className="text-[11px] text-slate-500 block">{cert.district}, {cert.state}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {new Date(cert.issueDate || cert.verificationDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>
                        <span>
                          {new Date(cert.validUntil).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        {cert.daysRemaining !== undefined && (
                          <span
                            className={`text-[10px] block font-semibold ${
                              cert.daysRemaining < 0
                                ? 'text-rose-600'
                                : cert.daysRemaining <= 30
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            {cert.daysRemaining < 0
                              ? `Expired`
                              : `${cert.daysRemaining} days left`}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={cert.computedStatus || cert.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/business/certificates/${cert._id}`}
                          className="p-1.5 text-slate-500 hover:text-purple-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <a
                          href={`/api/certificates/${cert.certificateNumber}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
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

export default LMOCertificates;

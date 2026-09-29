import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import {
  Award,
  Search,
  Download,
  Eye,
  Ban,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

export const CertificateManagement = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Revocation Modal
  const [selectedCert, setSelectedCert] = useState(null);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');
  const [revoking, setRevoking] = useState(false);

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/certificates', { params });
      setCertificates(res.data.data || []);
    } catch (err) {
      console.error('Failed to load certificates', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, [statusFilter]);

  const handleOpenRevoke = (cert) => {
    setSelectedCert(cert);
    setRevokeReason('Broken verification lead seal / physical tampering detected during audit inspection.');
    setRevokeModalOpen(true);
  };

  const handleConfirmRevoke = async (e) => {
    e.preventDefault();
    try {
      setRevoking(true);
      await api.post(`/certificates/${selectedCert._id}/revoke`, {
        reason: revokeReason,
      });
      setRevokeModalOpen(false);
      fetchCerts();
    } catch (err) {
      console.error('Failed to revoke certificate', err);
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">National Certificate Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central repository of all issued digital certificates, QR authentications, and revocation controls.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Certificate No, Business, S/N..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
        >
          <option value="">All Statuses</option>
          <option value="VALID">Valid</option>
          <option value="EXPIRING_SOON">Expiring Soon (&le; 30d)</option>
          <option value="EXPIRED">Expired</option>
          <option value="REVOKED">Revoked</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading certificate registry...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Certificate Ref</th>
                  <th className="py-3 px-4">Enterprise</th>
                  <th className="py-3 px-4">Instrument Particulars</th>
                  <th className="py-3 px-4">Validity Range</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Verified By</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certificates.map((cert) => (
                  <tr key={cert._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {cert.qrCodeDataUrl && (
                          <img
                            src={cert.qrCodeDataUrl}
                            alt="QR"
                            className="w-7 h-7 rounded border border-slate-200"
                          />
                        )}
                        <div>
                          <Link
                            to={`/business/certificates/${cert._id}`}
                            className="font-mono font-bold text-blue-600 hover:underline block"
                          >
                            {cert.certificateNumber}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {cert.digitalStampCode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {cert.businessName}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {cert.district}, {cert.state}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {cert.instrumentType}
                      </span>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        {cert.instrumentId} • S/N: {cert.serialNumber}
                      </span>
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
                          <span className="text-[10px] text-slate-400 block">
                            {cert.daysRemaining < 0
                              ? `Expired (${Math.abs(cert.daysRemaining)}d)`
                              : `${cert.daysRemaining}d left`}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={cert.computedStatus || cert.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {cert.verifiedByName}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/business/certificates/${cert._id}`}
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <a
                          href={`/api/certificates/${cert.certificateNumber}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        {cert.status !== 'REVOKED' && (
                          <button
                            onClick={() => handleOpenRevoke(cert)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                            title="Revoke Certificate"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Revocation Confirmation Modal */}
      <Modal
        isOpen={revokeModalOpen}
        onClose={() => setRevokeModalOpen(false)}
        title="Revoke Digital Verification Certificate"
        subtitle={`Certificate ${selectedCert?.certificateNumber} • ${selectedCert?.businessName}`}
      >
        <form onSubmit={handleConfirmRevoke} className="space-y-4 text-xs">
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Statutory Action Warning:</span>
              <p className="mt-0.5 leading-relaxed">
                Revoking this certificate immediately invalidates the stamping mark on the public registry. The instrument will be marked as EXPIRED and legally prohibited from commercial trade until re-inspected.
              </p>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Statutory Reason for Revocation *
            </label>
            <textarea
              rows="3"
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setRevokeModalOpen(false)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={revoking}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md transition-all"
            >
              {revoking ? 'Revoking...' : 'Confirm Revocation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CertificateManagement;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Scale,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  FileCheck,
  Download,
  QrCode,
  Building,
  User,
  Clock,
  ExternalLink,
  PlusCircle,
  Eye,
} from 'lucide-react';

export const InstrumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/instruments/${id}`);
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load instrument details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs text-slate-500 font-medium">Loading instrument profile...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-rose-200 text-center max-w-lg mx-auto">
        <h3 className="text-sm font-bold text-rose-700">Error Loading Instrument</h3>
        <p className="text-xs text-slate-500 mt-1">{error}</p>
        <Link
          to="/business/instruments"
          className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Instruments
        </Link>
      </div>
    );
  }

  const { instrument, applications = [], certificates = [] } = data;
  const activeCert = instrument.activeCertificate;
  const expiry = instrument.expiryCalculated;

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/business/instruments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Instruments Registry</span>
        </Link>

        {/* Action Button: Apply for Stamping / Re-verification */}
        {['REGISTERED', 'EXPIRED', 'VERIFIED'].includes(instrument.status) && (
          <Link
            to={`/business/applications/new?instrumentId=${instrument._id}&type=${
              instrument.status === 'REGISTERED' ? 'NEW_VERIFICATION' : 'RE_VERIFICATION'
            }`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            <span>Apply for Verification</span>
          </Link>
        )}
      </div>

      {/* Main Overview Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-900 text-amber-400 rounded-2xl shrink-0 shadow-md">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-blue-600">
                  {instrument.instrumentId}
                </span>
                <StatusBadge status={instrument.status} />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {instrument.instrumentType}
              </h1>
              <p className="text-xs text-slate-500">
                {instrument.manufacturer} • Model: {instrument.model} • S/N: {instrument.serialNumber}
              </p>
            </div>
          </div>

          {/* Next Due Date Card */}
          {instrument.nextVerificationDueDate && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-right">
              <span className="text-[11px] text-slate-500 block">Stamping Valid Until</span>
              <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                {new Date(instrument.nextVerificationDueDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              {expiry && (
                <span
                  className={`text-[11px] font-bold block mt-0.5 ${
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
          )}
        </div>

        {/* Detailed Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Category</span>
            <span className="text-slate-800 font-semibold mt-0.5 block">{instrument.category}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Capacity / Interval</span>
            <span className="text-slate-800 font-semibold mt-0.5 block">{instrument.capacity}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Accuracy Class</span>
            <span className="text-slate-800 font-semibold mt-0.5 block">{instrument.accuracyClass}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Location</span>
            <span className="text-slate-800 font-semibold mt-0.5 block">
              {instrument.district}, {instrument.state}
            </span>
          </div>
        </div>

        <div className="pt-4 text-xs">
          <span className="text-slate-400 font-medium block">Premises Address:</span>
          <span className="text-slate-700 mt-0.5 block font-medium">{instrument.locationAddress}</span>
        </div>
      </div>

      {/* Active Certificate Card (if verified) */}
      {activeCert && (
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {activeCert.qrCodeDataUrl && (
                <div className="bg-white p-2 rounded-xl shrink-0 shadow-md">
                  <img
                    src={activeCert.qrCodeDataUrl}
                    alt="Certificate QR"
                    className="w-20 h-20"
                  />
                </div>
              )}
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
                  Active Legal Metrology Certificate
                </span>
                <h3 className="text-lg font-black font-mono mt-0.5">
                  {activeCert.certificateNumber}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Issued by {activeCert.issuingAuthority || 'Legal Metrology Department'}
                </p>
                <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                  ✓ Digitally stamped and cryptographically verifiable
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to={`/verify/${activeCert.certificateNumber}`}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Public QR Page</span>
              </Link>

              <a
                href={`/api/certificates/${activeCert.certificateNumber}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Verification History & Past Applications */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          Verification Lifecycle History
        </h3>

        {applications.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No application records for this instrument yet.
          </p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app._id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600">{app.applicationId}</span>
                    <StatusBadge status={app.status} />
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    {app.applicationType === 'RE_VERIFICATION' ? 'Re-verification' : 'New Verification'} • Submitted on{' '}
                    {new Date(app.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <Link
                  to={`/business/applications/${app._id}`}
                  className="px-3 py-1 bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Case</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstrumentDetails;

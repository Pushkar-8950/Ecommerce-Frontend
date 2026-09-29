import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Search,
  Download,
  CheckCircle,
  Calendar,
  Building,
  User,
  Scale,
  Hash,
  Clock,
  ArrowRight,
  ExternalLink,
  Printer,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

export const PublicCertificateVerificationPage = () => {
  const { certificateNumber } = useParams();
  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState(certificateNumber || '');
  const [loading, setLoading] = useState(false);
  const [certData, setCertData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCertificate = async (num) => {
    if (!num) return;
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await axios.get(`/api/public/verify/${num.trim().toUpperCase()}`);
      setCertData(res.data.data);
    } catch (err) {
      setCertData(null);
      setErrorMsg(
        err.response?.data?.message ||
          `No certificate found with reference "${num}". Please check the ID and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateNumber) {
      setInputVal(certificateNumber);
      fetchCertificate(certificateNumber);
    }
  }, [certificateNumber]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      navigate(`/verify/${inputVal.trim().toUpperCase()}`);
    }
  };

  const getStatusBanner = (status) => {
    if (status === 'VALID') {
      return {
        bg: 'bg-emerald-600 text-white',
        icon: ShieldCheck,
        badgeText: 'GENUINE & ACTIVE CERTIFICATE',
        subtitle: 'Instrument is officially stamped and verified for commercial transactions.',
      };
    }
    if (status === 'EXPIRING_SOON') {
      return {
        bg: 'bg-amber-600 text-white',
        icon: AlertTriangle,
        badgeText: 'EXPIRING SOON - RE-VERIFICATION DUE',
        subtitle: 'This instrument is within 30 days of mandatory re-verification.',
      };
    }
    if (status === 'REVOKED') {
      return {
        bg: 'bg-red-700 text-white',
        icon: XCircle,
        badgeText: 'CERTIFICATE REVOKED',
        subtitle: 'This certificate has been revoked due to tampering or broken seal.',
      };
    }
    return {
      bg: 'bg-rose-600 text-white',
      icon: XCircle,
      badgeText: 'STAMPING EXPIRED / LAPSED',
      subtitle: 'Periodic verification period has elapsed. Commercial usage is unauthorized.',
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Search Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Public Verification Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Verify Instrument Stamping Certificate
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
            Scan the QR code printed on the instrument or enter the certificate registration number below to check authenticity in real time.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Certificate No. (e.g. CERT-2026-001001)"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shrink-0 shadow-sm"
            >
              {loading ? 'Verifying...' : 'Verify Now'}
            </button>
          </form>

          {/* Quick Demo links */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span>Quick test IDs:</span>
            <button
              onClick={() => navigate('/verify/CERT-2026-001001')}
              className="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 font-medium"
            >
              CERT-2026-001001 (Valid)
            </button>
            <button
              onClick={() => navigate('/verify/CERT-2025-000844')}
              className="px-2 py-0.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded border border-amber-200 font-medium"
            >
              CERT-2025-000844 (Expiring Soon)
            </button>
            <button
              onClick={() => navigate('/verify/CERT-2025-000412')}
              className="px-2 py-0.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded border border-rose-200 font-medium"
            >
              CERT-2025-000412 (Expired)
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Querying National Metrology Registry...</p>
          </div>
        )}

        {/* Error State */}
        {errorMsg && !loading && (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <XCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Certificate Verification Failed</h3>
            <p className="text-xs text-rose-600 mt-1 max-w-md mx-auto">{errorMsg}</p>
          </div>
        )}

        {/* Certificate Result Card */}
        {certData && !loading && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden printable-certificate">
            {/* Top Status Banner */}
            {(() => {
              const banner = getStatusBanner(certData.status);
              const BannerIcon = banner.icon;
              return (
                <div className={`${banner.bg} p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left`}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shrink-0">
                      <BannerIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-xs font-bold tracking-widest uppercase opacity-90 block">
                        CERTIFICATE VERIFIED
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                        {banner.badgeText}
                      </h2>
                      <p className="text-xs opacity-90 mt-1">{banner.subtitle}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 no-print">
                    <a
                      href={`/api/certificates/${certData.certificateNumber}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                      Download Official PDF
                    </a>
                  </div>
                </div>
              );
            })()}

            {/* Verification Metadata Header */}
            <div className="px-6 sm:px-8 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Certificate Ref:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {certData.certificateNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Verification Timestamp:</span>
                <span className="text-slate-700 font-semibold">
                  {new Date(certData.verificationTimestamp).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Main Details Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Instrument Information Box */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-600" />
                  Instrument Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/70 rounded-xl p-4 border border-slate-200/80">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Instrument Type</span>
                    <span className="text-xs font-bold text-slate-800">{certData.instrumentType}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Instrument ID</span>
                    <span className="text-xs font-bold font-mono text-blue-600">{certData.instrumentId}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Serial Number</span>
                    <span className="text-xs font-bold font-mono text-slate-800">{certData.serialNumber}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Manufacturer / Model</span>
                    <span className="text-xs font-semibold text-slate-800">
                      {certData.manufacturer} - {certData.model}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Capacity / Verification Scale Interval</span>
                    <span className="text-xs font-bold text-slate-800">{certData.capacity}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Accuracy Class</span>
                    <span className="text-xs font-semibold text-slate-800">{certData.accuracyClass}</span>
                  </div>
                </div>
              </div>

              {/* Stakeholder & Jurisdiction */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  Stakeholder & Stamping Jurisdiction
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 rounded-xl p-4 border border-slate-200/80">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Registered Business / Enterprise</span>
                    <span className="text-xs font-bold text-slate-900">{certData.businessName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Enforcement Jurisdiction</span>
                    <span className="text-xs font-semibold text-slate-800">
                      {certData.jurisdictionDistrict}, {certData.jurisdictionState}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Issuing Authority</span>
                    <span className="text-xs font-semibold text-slate-800">{certData.issuingAuthority}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Inspecting Officer</span>
                    <span className="text-xs font-bold text-slate-800">
                      {certData.verifiedByName} ({certData.verifiedByDesignation})
                    </span>
                  </div>
                </div>
              </div>

              {/* Validity & Stamping Dates */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Validity & Stamping Dates
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Verification Conducted</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">
                      {new Date(certData.verificationDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Valid Until (Next Due)</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">
                      {new Date(certData.validUntil).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Days Remaining</span>
                    <span
                      className={`text-sm font-extrabold mt-1 block ${
                        certData.daysRemaining < 0
                          ? 'text-rose-600'
                          : certData.daysRemaining <= 30
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {certData.daysRemaining < 0
                        ? `Expired ${Math.abs(certData.daysRemaining)} days ago`
                        : `${certData.daysRemaining} days remaining`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Digital Seal Stamp */}
              <div className="p-4 bg-slate-900 text-slate-300 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Digital Stamping Code: {certData.digitalStampCode}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Verified through MetraVerify digital verification portal.
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block text-right text-[11px] text-emerald-400 font-semibold">
                  Tamper-Evident Record
                </div>
              </div>

              {/* Official Disclaimer */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-center">
                <p className="text-[11px] text-amber-900 font-medium">
                  <span className="font-bold">Important Disclaimer: </span>
                  {certData.disclaimer}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicCertificateVerificationPage;

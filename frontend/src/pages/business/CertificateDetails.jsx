import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Award,
  ArrowLeft,
  Download,
  Printer,
  ExternalLink,
  ShieldCheck,
  Scale,
  CheckCircle2,
} from 'lucide-react';

export const CertificateDetails = () => {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCert = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/certificates/${id}`);
        setCert(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Certificate not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs text-slate-500 font-medium">Generating digital certificate view...</span>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-rose-200 text-center max-w-lg mx-auto">
        <h3 className="text-sm font-bold text-rose-700">Error Loading Certificate</h3>
        <p className="text-xs text-slate-500 mt-1">{error}</p>
        <Link
          to="/business/certificates"
          className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Certificates
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Action Ribbon (hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <Link
          to="/business/certificates"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Certificates</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/verify/${cert.certificateNumber}`}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public QR Page</span>
          </Link>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <a
            href={`/api/certificates/${cert.certificateNumber}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* Official Certificate Layout Frame */}
      <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 sm:p-12 shadow-2xl relative overflow-hidden printable-certificate">
        {/* Inner Ornamental Border */}
        <div className="border border-amber-600 p-6 sm:p-8 rounded-xl relative">
          {/* Header */}
          <div className="text-center pb-6 border-b border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto mb-2 shadow-md">
              <Scale className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wider font-sans uppercase">
              DIGITAL MACHINE
            </h1>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mt-0.5">
              Digital Trust for Weights & Measures
            </p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">
              {cert.issuingAuthority || 'LEGAL METROLOGY WING - GOVERNMENT OF INDIA (DEMO REGISTRY)'}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Issued in accordance with The Legal Metrology Act, 2009 & Enforcement Rules
            </span>

            {/* Title Box */}
            <div className="mt-4 py-2 px-6 bg-slate-50 border border-slate-200 rounded-lg inline-block">
              <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-widest uppercase">
                DIGITAL VERIFICATION CERTIFICATE
              </span>
            </div>
          </div>

          {/* Certificate Reference & Status Row */}
          <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Certificate Ref No:</span>
              <span className="font-mono font-black text-blue-700 text-sm">
                {cert.certificateNumber}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Status:</span>
              <StatusBadge status={cert.computedStatus || cert.status} size="md" />
            </div>
          </div>

          {/* Instrument Specs */}
          <div className="py-6 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              1. Instrument Particulars
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Instrument ID</span>
                <span className="font-mono font-bold text-slate-900 mt-0.5 block">{cert.instrumentId}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Instrument Type</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{cert.instrumentType}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Manufacturer / Model</span>
                <span className="font-medium text-slate-800 mt-0.5 block">{cert.manufacturer} - {cert.model}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Serial Number</span>
                <span className="font-mono font-bold text-slate-900 mt-0.5 block">{cert.serialNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Capacity / Interval</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{cert.capacity}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Accuracy Class</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">{cert.accuracyClass}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Application Reference</span>
                <span className="font-mono text-slate-700 mt-0.5 block">{cert.applicationId}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Category</span>
                <span className="font-medium text-slate-800 mt-0.5 block">{cert.category || 'Commercial'}</span>
              </div>
            </div>
          </div>

          {/* Stakeholder Details */}
          <div className="py-6 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              2. Stakeholder & Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Enterprise / Business Name</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{cert.businessName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Applicant / Owner</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{cert.ownerName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">State & District Jurisdiction</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {cert.district}, {cert.state}
                </span>
              </div>
            </div>
          </div>

          {/* Verification & Validity */}
          <div className="py-6 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              3. Verification & Validity Timeline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block">Date of Verification</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {new Date(cert.verificationDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block">Valid Until (Next Stamping Due)</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {new Date(cert.validUntil).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block">Inspecting Authority</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{cert.verifiedByName}</span>
                <span className="text-[10px] text-slate-500 block">
                  {cert.verifiedByDesignation || 'Legal Metrology Officer'}
                </span>
              </div>
            </div>
          </div>

          {/* Tamper-Evident QR Authentication & Digital Seal Box */}
          <div className="mt-6 p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {cert.qrCodeDataUrl ? (
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm shrink-0">
                  <img
                    src={cert.qrCodeDataUrl}
                    alt="Certificate QR"
                    className="w-24 h-24"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-slate-200 rounded-xl flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-slate-400" />
                </div>
              )}
              <div className="text-xs">
                <span className="font-bold text-slate-900 text-sm block">
                  Scan to Verify Authenticity
                </span>
                <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed max-w-sm">
                  This cryptographic QR code encodes the public verification URL. Anyone can scan it to check authenticity without logging in.
                </p>
                <div className="mt-2 text-[11px] font-mono text-blue-700">
                  Digital Stamping Code: {cert.digitalStampCode || 'LM-STAMP-2026-9921'}
                </div>
              </div>
            </div>

            <div className="text-center sm:text-right shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                Official Digital Seal
              </span>
              <div className="w-16 h-16 rounded-full border-2 border-emerald-600 bg-emerald-50 text-emerald-700 flex flex-col items-center justify-center mx-auto sm:ml-auto mt-1">
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-[8px] font-bold uppercase">STAMPED</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                Digitally Sealed & Recorded
              </span>
            </div>
          </div>

          {/* Legal Note */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <p className="text-[10px] text-slate-500">
              This certificate is digitally issued under the Legal Metrology Act, 2009 and is verifiable via the MetraVerify portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetails;

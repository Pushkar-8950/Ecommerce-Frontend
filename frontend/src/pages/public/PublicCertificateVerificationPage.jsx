import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Search,
  Download,
  CheckCircle,
  Calendar,
  Building,
  Scale,
  QrCode,
  Camera,
  UploadCloud,
  Printer,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const PublicCertificateVerificationPage = () => {
  const { certificateNumber } = useParams();
  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState(certificateNumber || '');
  const [loading, setLoading] = useState(false);
  const [certData, setCertData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Scanner state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [scannedMessage, setScannedMessage] = useState('');
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  // Helper to extract clean CERT-YYYY-XXXXXX from any scanned string or URL
  const extractCertificateNumber = (raw) => {
    if (!raw) return '';
    const trimmed = raw.trim();

    // Match CERT-YYYY-XXXXXX
    const match = trimmed.match(/(CERT-\d{4}-\d{6})/i);
    if (match) {
      return match[1].toUpperCase();
    }

    // Try parsing URL path /verify/:cert
    try {
      if (trimmed.includes('/verify/')) {
        const parts = trimmed.split('/verify/');
        if (parts[1]) {
          const seg = parts[1].split('/')[0].split('?')[0].split('#')[0];
          return seg.trim().toUpperCase();
        }
      }
    } catch (e) {
      console.warn('URL parsing failed', e);
    }

    return trimmed.toUpperCase();
  };

  const fetchCertificate = async (rawCode) => {
    const cleanCode = extractCertificateNumber(rawCode);
    if (!cleanCode) return;

    try {
      setLoading(true);
      setErrorMsg('');
      setScannedMessage('');
      const res = await axios.get(`/api/public/verify/${cleanCode}`);
      setCertData(res.data.data);
      setInputVal(cleanCode);
    } catch (err) {
      setCertData(null);
      setErrorMsg(
        err.response?.data?.message ||
          `No certificate found with reference "${cleanCode}". Please verify the QR code or ID and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateNumber) {
      const clean = extractCertificateNumber(certificateNumber);
      setInputVal(clean);
      fetchCertificate(clean);
    }
  }, [certificateNumber]);

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      stopCameraScanner();
    };
  }, []);

  const startCameraScanner = async () => {
    setCameraError('');
    setScannedMessage('');
    setIsCameraActive(true);

    // Wait for DOM element #reader to mount
    setTimeout(async () => {
      try {
        if (!html5QrCodeRef.current) {
          html5QrCodeRef.current = new Html5Qrcode('qr-reader-container');
        }

        const qrCodeSuccessCallback = (decodedText) => {
          const cleanCert = extractCertificateNumber(decodedText);
          setScannedMessage(`QR Code Scanned: ${cleanCert}`);
          stopCameraScanner();
          navigate(`/verify/${cleanCert}`);
        };

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        await html5QrCodeRef.current.start(
          { facingMode: 'environment' },
          config,
          qrCodeSuccessCallback
        );
      } catch (err) {
        console.error('Camera Scanner start error', err);
        setCameraError(
          'Could not access camera. Please allow camera permissions or upload a QR image instead.'
        );
        setIsCameraActive(false);
      }
    }, 150);
  };

  const stopCameraScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Error stopping scanner', err);
      }
    }
    setIsCameraActive(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setErrorMsg('');
      setCameraError('');

      let scanner = html5QrCodeRef.current;
      if (!scanner) {
        scanner = new Html5Qrcode('qr-reader-hidden');
        html5QrCodeRef.current = scanner;
      }

      const decodedText = await scanner.scanFile(file, true);
      const cleanCert = extractCertificateNumber(decodedText);
      setScannedMessage(`QR Image Decoded: ${cleanCert}`);
      navigate(`/verify/${cleanCert}`);
    } catch (err) {
      console.error('File scan error', err);
      setErrorMsg('Failed to detect or decode QR code in the uploaded image. Please ensure the QR is clear and well-lit.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const clean = extractCertificateNumber(inputVal);
    navigate(`/verify/${clean}`);
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
        subtitle: 'This instrument is within 30 days of mandatory statutory re-verification.',
      };
    }
    if (status === 'REVOKED') {
      return {
        bg: 'bg-red-700 text-white',
        icon: XCircle,
        badgeText: 'CERTIFICATE REVOKED',
        subtitle: 'This certificate has been revoked due to broken seal, tampering, or failed inspection.',
      };
    }
    return {
      bg: 'bg-rose-600 text-white',
      icon: XCircle,
      badgeText: 'STAMPING EXPIRED / LAPSED',
      subtitle: 'Periodic verification period has elapsed. Commercial usage is strictly unauthorized.',
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8">
      {/* Hidden container for file-based scanner */}
      <div id="qr-reader-hidden" className="hidden" />

      <div className="max-w-4xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto space-y-8 2xl:space-y-10">
        {/* Verification Command Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 2xl:p-10 shadow-sm text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs 2xl:text-sm font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" />
            National Legal Metrology Digital Verification Portal
          </div>
          <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-extrabold text-slate-900">
            Verify Instrument Stamping Certificate
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm 2xl:text-base mt-1 max-w-lg 2xl:max-w-2xl mx-auto">
            Scan the official QR code printed on the instrument stamping sticker or enter the certificate ID below to inspect authenticity and calibration status.
          </p>

          {/* Action Tabs: Camera Scanner, Image Upload, Manual Search */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {!isCameraActive ? (
              <button
                type="button"
                onClick={startCameraScanner}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Scan with Camera</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCameraScanner}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Stop Camera Scanner</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4 text-amber-400" />
              <span>Upload QR Image</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Live Camera Scanner Box */}
          {isCameraActive && (
            <div className="mt-6 max-w-md mx-auto p-4 bg-slate-900 rounded-2xl shadow-xl border border-slate-700 text-center animate-in fade-in zoom-in-95 duration-200">
              <span className="text-xs font-bold text-amber-400 block mb-2">
                Point your camera at the MetraVerify QR Code
              </span>
              <div
                id="qr-reader-container"
                className="overflow-hidden rounded-xl bg-black border border-slate-700"
              />
              <p className="text-[11px] text-slate-400 mt-2">
                Align the square QR code within the highlighted viewfinder.
              </p>
            </div>
          )}

          {cameraError && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl max-w-md mx-auto">
              {cameraError}
            </div>
          )}

          {scannedMessage && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl max-w-md mx-auto flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="font-bold">{scannedMessage}</span>
            </div>
          )}

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl 2xl:max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Certificate No. or paste QR URL (e.g. CERT-2026-001001)"
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

          {/* Quick Demo Test Buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-400">Quick Test Scans:</span>
            <button
              onClick={() => {
                setInputVal('CERT-2026-001001');
                fetchCertificate('CERT-2026-001001');
              }}
              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 font-bold transition-colors"
            >
              Scan CERT-2026-001001 (Valid)
            </button>
            <button
              onClick={() => {
                setInputVal('CERT-2025-000844');
                fetchCertificate('CERT-2025-000844');
              }}
              className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg border border-amber-200 font-bold transition-colors"
            >
              Scan CERT-2025-000844 (Expiring)
            </button>
            <button
              onClick={() => {
                setInputVal('CERT-2025-000412');
                fetchCertificate('CERT-2025-000412');
              }}
              className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-200 font-bold transition-colors"
            >
              Scan CERT-2025-000412 (Expired)
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Checking National Metrology Registry for Certificate Details...</p>
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

        {/* Scanned Certificate Result Details Card */}
        {certData && !loading && (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden printable-certificate animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Top Status Banner */}
            {(() => {
              const banner = getStatusBanner(certData.status);
              const BannerIcon = banner.icon;
              return (
                <div
                  className={`${banner.bg} p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left`}
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shrink-0">
                      <BannerIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-90 block">
                        AUTHENTICATED VERIFICATION RECORD
                      </span>
                      <h2 className="text-lg sm:text-2xl font-black tracking-tight mt-0.5">
                        {banner.badgeText}
                      </h2>
                      <p className="text-xs opacity-90 mt-1 max-w-md">{banner.subtitle}</p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto shrink-0 flex items-center justify-center sm:justify-end gap-2 no-print">
                    <a
                      href={`/api/certificates/${certData.certificateNumber}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-center"
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                      <span>Download Official PDF</span>
                    </a>
                  </div>
                </div>
              );
            })()}

            {/* Verification Metadata Header */}
            <div className="px-4 sm:px-8 py-3.5 sm:py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-slate-500 font-medium">Certificate Ref:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {certData.certificateNumber}
                </span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">
                  {certData.statusLabel || certData.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-slate-400">Verification Timestamp:</span>
                <span className="font-semibold">
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

            {/* Main Details Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Instrument & QR Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                {/* QR Display Card (1 col) */}
                <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center flex flex-col items-center justify-center space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Digital Stamping QR
                  </span>
                  {certData.qrCodeDataUrl ? (
                    <img
                      src={certData.qrCodeDataUrl}
                      alt="Verified QR"
                      className="w-36 h-36 rounded-xl border border-slate-300 shadow-inner p-1 bg-white"
                    />
                  ) : (
                    <div className="w-36 h-36 rounded-xl border border-slate-300 flex items-center justify-center bg-white">
                      <QrCode className="w-16 h-16 text-slate-400" />
                    </div>
                  )}
                  <span className="font-mono text-[10px] text-slate-500 font-bold block truncate max-w-[160px]">
                    {certData.digitalStampCode}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    QR Live & Validated
                  </span>
                </div>

                {/* Instrument Specifications (3 cols) */}
                <div className="lg:col-span-3 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-600" />
                    Instrument Specifications & Calibration Class
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Instrument Type</span>
                      <span className="text-xs font-bold text-slate-900">{certData.instrumentType}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Asset / Instrument ID</span>
                      <span className="text-xs font-bold font-mono text-blue-600">{certData.instrumentId}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Serial Number</span>
                      <span className="text-xs font-bold font-mono text-slate-800">{certData.serialNumber}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Manufacturer & Model</span>
                      <span className="text-xs font-semibold text-slate-800">
                        {certData.manufacturer} - {certData.model}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Capacity / Interval</span>
                      <span className="text-xs font-bold text-slate-900">{certData.capacity}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Accuracy Class</span>
                      <span className="text-xs font-semibold text-slate-800">{certData.accuracyClass}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stakeholder & Enforcement Jurisdiction */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  Commercial Enterprise & Enforcement Authority
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Registered Commercial Business</span>
                    <span className="text-xs font-bold text-slate-900">{certData.businessName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Enforcement Jurisdiction</span>
                    <span className="text-xs font-semibold text-slate-800">
                      {certData.jurisdictionDistrict}, {certData.jurisdictionState}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Issuing Legal Authority</span>
                    <span className="text-xs font-semibold text-slate-800">{certData.issuingAuthority}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Inspecting Officer</span>
                    <span className="text-xs font-bold text-slate-900">
                      {certData.verifiedByName} ({certData.verifiedByDesignation})
                    </span>
                  </div>
                </div>
              </div>

              {/* Validity & Stamping Schedule */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Validity & Expiry Countdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Date of Stamping Verification</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">
                      {new Date(certData.verificationDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Valid Until (Mandatory Due Date)</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">
                      {new Date(certData.validUntil).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Validity Status</span>
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

              {/* Tamper Seal Bar */}
              <div className="p-4 bg-slate-950 text-slate-300 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Digital Cryptographic Stamp: {certData.digitalStampCode}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Verified through MetraVerify National Digital Verification Architecture
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block text-right text-[11px] text-emerald-400 font-semibold">
                  Tamper-Evident Record
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicCertificateVerificationPage;

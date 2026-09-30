import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/common/StatusBadge';
import {
  ClipboardCheck,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  Download,
  ExternalLink,
  Shield,
  Sparkles,
  Building2,
  Cpu,
} from 'lucide-react';

export const GATCInspection = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  // 7 Statutory Checklist Items tailored for GATC Bench Testing
  const checklistItems = [
    {
      key: 'instrumentCondition',
      title: '1. Bench Mounting & Structural Integrity',
      desc: 'Verify vibration dampening, leveling bulb alignment, and structural stability on testing table.',
    },
    {
      key: 'display',
      title: '2. Digital Display & Signal Linearity',
      desc: 'Verify segment integrity, signal conversion linearity, and analog-to-digital converter stability.',
    },
    {
      key: 'zeroError',
      title: '3. Zero Point Return & Drift Rate',
      desc: 'Verify return to zero after multi-cycle full load cycling within +/- 0.25e statutory tolerance.',
    },
    {
      key: 'accuracy',
      title: '4. Precision Calibration & Eccentricity Test',
      desc: 'Conduct 4-quadrant corner loading with NABL-traceable Class E2/F1 standard masses.',
    },
    {
      key: 'calibration',
      title: '5. Repeatability & Hysteresis Standard',
      desc: 'Evaluate 10 consecutive load cycles at 50% and 100% capacity; verify hysteresis within MPE limits.',
    },
    {
      key: 'sealingStamping',
      title: '6. Tamper-evident Holographic Lab Sealing',
      desc: 'Affix GATC laboratory tamper hologram and lead-wire security seal over calibration jumper.',
    },
    {
      key: 'physicalCondition',
      title: '7. Laboratory Environmental Standards',
      desc: 'Testing environment strictly controlled at 20°C +/- 2°C, relative humidity 45-60%.',
    },
  ];

  const [checks, setChecks] = useState({
    instrumentCondition: 'PENDING',
    display: 'PENDING',
    zeroError: 'PENDING',
    accuracy: 'PENDING',
    calibration: 'PENDING',
    sealingStamping: 'PENDING',
    physicalCondition: 'PENDING',
  });

  const [remarks, setRemarks] = useState('');
  const [officerNotes, setOfficerNotes] = useState('');
  const [finalDecision, setFinalDecision] = useState('PASS');

  useEffect(() => {
    const initInspection = async () => {
      try {
        setLoading(true);
        // Start or retrieve active inspection session
        const res = await api.post('/inspections/start', { applicationId });
        setInspection(res.data.data);

        // Fetch application details
        const appRes = await api.get(`/applications/${applicationId}`);
        setApp(appRes.data.data);

        if (res.data.data.checks) {
          setChecks(res.data.data.checks);
        }
        if (res.data.data.remarks) setRemarks(res.data.data.remarks);
        if (res.data.data.officerNotes) setOfficerNotes(res.data.data.officerNotes);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to initialize lab calibration session.');
      } finally {
        setLoading(false);
      }
    };

    initInspection();
  }, [applicationId]);

  const handleSetCheck = (key, value) => {
    setChecks((prev) => ({ ...prev, [key]: value }));
  };

  const handlePassAll = () => {
    const allPass = {};
    checklistItems.forEach((item) => {
      allPass[item.key] = 'PASS';
    });
    setChecks(allPass);
    setRemarks('All 7 laboratory metrological parameters verified using Class F1 standard test weights. Error <= 0.05% MPE.');
    setOfficerNotes('GATC Tamper-Proof Hologram GATC-SEAL-2026 affixed to calibration potentiometer enclosure.');
    setFinalDecision('PASS');
  };

  const total = checklistItems.length;
  let passedCount = 0;
  let failedCount = 0;
  let pendingCount = 0;

  checklistItems.forEach((item) => {
    if (checks[item.key] === 'PASS') passedCount++;
    else if (checks[item.key] === 'FAIL') failedCount++;
    else pendingCount++;
  });

  const isComplete = pendingCount === 0;

  const handleSubmitDecision = async () => {
    if (!isComplete) {
      setError('Please evaluate all 7 mandatory laboratory test parameters before concluding.');
      return;
    }
    const isFail = failedCount > 0;
    const decisionToSubmit = isFail ? 'REJECTED' : 'VERIFIED'; // Updated to use the correct enum for backend
    
    if (isFail && !remarks) {
      setError('Failure reason and remarks are mandatory for a REJECTED outcome.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await api.post(`/inspections/${inspection._id}/complete`, {
        checks,
        remarks,
        officerNotes,
        finalDecision: decisionToSubmit,
      });

      if (window.BroadcastChannel) {
        const bc = new BroadcastChannel('metraverify_sync_channel');
        bc.postMessage({ type: 'GATC_INSPECTION_COMPLETED', decision: decisionToSubmit, timestamp: Date.now() });
      }
      window.dispatchEvent(new CustomEvent('metraverify_sync'));

      setSuccessResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to finalize laboratory testing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs text-slate-500 font-medium">Initializing GATC Bench Test Workstation...</span>
      </div>
    );
  }

  // Success Confirmation Screen
  if (successResult) {
    const cert = successResult.data.certificate;
    const insp = successResult.data.inspection;

    return (
      <div className="max-w-2xl 2xl:max-w-4xl mx-auto space-y-6 py-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 2xl:p-10 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            GATC Laboratory Verification Completed!
          </h2>

          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            {insp.finalResult === 'VERIFIED'
              ? 'All 7/7 precision parameters passed. Digital Verification Certificate generated and stamped in the registry.'
              : 'Testing marked as REJECTED due to tolerance deviation. Deficiency report dispatched.'}
          </p>

          {cert && (
            <div className="mt-8 p-6 bg-slate-900 text-white rounded-2xl text-left border border-slate-800 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {cert.qrCodeDataUrl && (
                    <img
                      src={cert.qrCodeDataUrl}
                      alt="QR"
                      className="w-20 h-20 rounded-xl bg-white p-1 shrink-0"
                    />
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase block">
                      New Digital Certificate
                    </span>
                    <span className="font-mono text-xl font-black text-white block mt-0.5">
                      {cert.certificateNumber}
                    </span>
                    <span className="text-xs text-slate-300 block mt-1">
                      Valid Until: {new Date(cert.validUntil).toLocaleDateString()}
                    </span>
                    <span className="text-[11px] text-emerald-400 block mt-0.5 font-medium">
                      Stamp Code: {cert.digitalStampCode}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <Link
                    to={`/verify/${cert.certificateNumber}`}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Public QR Page</span>
                  </Link>

                  <a
                    href={`/api/certificates/${cert.certificateNumber}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold text-center border border-white/20 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/gatc/applications"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              Return to Testing Queue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto space-y-6 2xl:space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/gatc/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Verification Queue</span>
        </Link>

        {/* 1-Click Pass All for Demonstration */}
        <button
          type="button"
          onClick={handlePassAll}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors shadow-sm text-center"
          title="Auto-fill 7/7 Pass for Fast Demo"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>⚡ Demo Fast Pass (All 7 Parameters)</span>
        </button>
      </div>

      {/* Case Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-700">
                {app?.applicationId}
              </span>
              <StatusBadge status={app?.status} />
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">
                GATC LAB BENCH
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Laboratory Verification: {app?.instrument?.instrumentType}
            </h1>
            <p className="text-xs text-slate-500">
              Enterprise: <span className="font-semibold text-slate-700">{app?.owner?.organizationName}</span> • Verification Mode: Laboratory Standard Verification
            </p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-right">
            <span className="text-[11px] text-amber-700 font-semibold block">Lab Session ID</span>
            <span className="font-mono text-xs font-bold text-amber-900 block mt-0.5">
              {inspection?.inspectionId}
            </span>
          </div>
        </div>

        {/* Quick specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block text-[11px]">Make / Model:</span>
            <span className="font-medium">{app?.instrument?.manufacturer} - {app?.instrument?.model}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Serial No:</span>
            <span className="font-mono font-medium">{app?.instrument?.serialNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Capacity:</span>
            <span className="font-medium">{app?.instrument?.capacity}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Accuracy Class:</span>
            <span className="font-medium">{app?.instrument?.accuracyClass}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 7-Point GATC Lab Checklist Form */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              7-Point GATC Digital Verification & Testing Workflow
            </h2>
            <p className="text-xs text-slate-500">
              Conducted in compliance with NABL accreditation and Legal Metrology Act parameters.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs shadow-sm font-bold shrink-0">
            <span className="text-slate-600">Calculated Summary:</span>
            <span className={passedCount === total ? 'text-emerald-600' : 'text-amber-600'}>
              {passedCount}/{total} Passed
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 p-2 sm:p-4">
          {checklistItems.map((item) => {
            const currentVal = checks[item.key] || 'PENDING';
            return (
              <div
                key={item.key}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 rounded-xl transition-colors"
              >
                <div className="max-w-xl">
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleSetCheck(item.key, 'PASS')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      currentVal === 'PASS'
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>PASS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetCheck(item.key, 'FAIL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      currentVal === 'FAIL'
                        ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-600/30'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>FAIL</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Remarks & Observations */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/30 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Laboratory Verification Notes & Traceable Standard Masses Applied *
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Certified Class F1 standard weights applied; corner load differential <= 0.02%. Required if failed."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              GATC Tamper Hologram & Stamping Details
            </label>
            <input
              type="text"
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
              placeholder="e.g. Hologram GATC-SEAL-2026 affixed to verification interface."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Final Determination Block */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Final Laboratory Verification Determination</span>
              <p className="text-[11px] text-slate-500">
                {passedCount === 7
                  ? 'All 7 mandatory checks passed. System will issue Digital Certificate + QR.'
                  : 'Notice: If any check failed, the case will be stamped REJECTED.'}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                disabled={submitting || !isComplete}
                onClick={handleSubmitDecision}
                className={`w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 ${
                  passedCount === 7
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                } ${(!isComplete || submitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {submitting ? (
                  <span>Processing Stamping...</span>
                ) : passedCount === 7 ? (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Pass & Generate Digital Verification Certificate</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Submit as REJECTED</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GATCInspection;

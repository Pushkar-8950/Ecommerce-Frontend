import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Scale,
  ShieldCheck,
  QrCode,
  BellRing,
  ClipboardCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  FileText,
  Clock,
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [certInput, setCertInput] = useState('');

  // Auto redirect logged in users to their workspace so they never land on login/signup page
  useEffect(() => {
    if (user) {
      if (user.role === 'BUSINESS_USER') navigate('/business/dashboard', { replace: true });
      else if (user.role === 'LMO_OFFICER') navigate('/lmo/dashboard', { replace: true });
      else if (user.role === 'GATC') navigate('/gatc/dashboard', { replace: true });
      else if (user.role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (certInput.trim()) {
      navigate(`/verify/${certInput.trim().toUpperCase()}`);
    }
  };

  const steps = [
    {
      num: '01',
      title: 'Register Instrument',
      desc: 'Onboard weighing scale, weighbridge, or dispenser with capacity, model, and serial number.',
      icon: Scale,
    },
    {
      num: '02',
      title: 'Apply Verification',
      desc: 'Submit new verification or annual re-verification request with preferred inspection date.',
      icon: FileText,
    },
    {
      num: '03',
      title: 'Digital Inspection',
      desc: 'Legal Metrology Officer conducts 7-point digital checklist and physical stamping.',
      icon: ClipboardCheck,
    },
    {
      num: '04',
      title: 'Get QR Certificate',
      desc: 'Instant digital certificate generated with cryptographically verifiable tamper-evident QR.',
      icon: QrCode,
    },
    {
      num: '05',
      title: 'Verify Anywhere',
      desc: 'Consumers, business partners, or enforcement officers scan QR to check validity instantly.',
      icon: ShieldCheck,
    },
  ];

  const features = [
    {
      title: 'Digital Verification & Stamping',
      desc: 'Eliminates paper trail and manual registers through standardized digital inspection forms.',
      icon: ShieldCheck,
    },
    {
      title: 'QR Code Authentication',
      desc: 'Every stamped instrument carries a public QR code linking to real-time verification status.',
      icon: QrCode,
    },
    {
      title: 'Automated Expiry Alerts',
      desc: '30-day proactive warnings prevent statutory non-compliance and avoid transactional disputes.',
      icon: BellRing,
    },
    {
      title: 'Centralized Registry',
      desc: 'Single source of truth tracking instruments, historical calibrations, and ownership across India.',
      icon: Layers,
    },
    {
      title: 'Role-Based Workflow',
      desc: 'Secure portals for Commercial Businesses, Legal Metrology Officers, GATCs, and State Admins.',
      icon: Lock,
    },
    {
      title: 'Transparent Audit Trail',
      desc: 'Complete immutable log of all officer inspections, approvals, rejections, and certificate issuances.',
      icon: Clock,
    },
  ];

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-16 pb-24 px-4 sm:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 text-xs font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Legal Metrology | Department of Consumer Affairs, GoI
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-sans max-w-4xl mx-auto leading-tight">
            Digital Trust for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              Weights & Measures
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            One unified national platform for instrument verification, digital certification, QR authentication, and lifecycle monitoring under Legal Metrology.
          </p>

          {/* Quick CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              Get Started / Login
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/verify"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              Verify Certificate
            </Link>
          </div>

          {/* Live Public Certificate Lookup Box */}
          <div className="mt-12 max-w-xl mx-auto bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-2xl">
            <form onSubmit={handleVerifySubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  placeholder="Enter Certificate No. (e.g. CERT-2026-001001)"
                  className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-md"
              >
                <span>Verify Now</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-2 text-left px-2 flex items-center justify-between text-[11px] text-slate-300">
              <span>Try seeded demo certificate:</span>
              <button
                type="button"
                onClick={() => navigate('/verify/CERT-2026-001001')}
                className="text-amber-300 underline font-medium hover:text-amber-200"
              >
                CERT-2026-001001 (Valid)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Verification Process Section */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            End-to-End Lifecycle
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
            How MetraVerify Works
          </h2>
          <p className="text-slate-600 text-sm mt-3">
            Transforming manual, fragmented physical stamping into an integrated, transparent digital workflow across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 relative">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col items-center text-center group"
              >
                <span className="text-3xl font-black text-slate-200 group-hover:text-blue-200 transition-colors mb-2">
                  {st.num}
                </span>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{st.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key System Features Grid */}
      <section className="py-16 bg-slate-100/70 border-y border-slate-200 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Robust Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Built for Legal Metrology Excellence
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              Engineered with tamper-detection, cryptographic verification, and strict statutory rules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex items-start gap-4 hover:border-blue-300 transition-colors"
                >
                  <div className="p-3 rounded-xl bg-slate-900 text-amber-400 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">{f.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stakeholder Roles Banner */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              Unified Stakeholder Experience
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Designed for Businesses, Inspectors, Labs & Citizens
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-8">
              Whether you are a mandi trader in Haryana, a jeweller in Delhi, an LMO officer verifying retail scales, or an accredited calibration laboratory, MetraVerify delivers tailored workflows.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xl font-bold text-amber-400 block">Business</span>
                <span className="text-[11px] text-slate-300">Self-registration & automated renewal</span>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xl font-bold text-amber-400 block">LMO Officer</span>
                <span className="text-[11px] text-slate-300">Field inspection & instant stamping</span>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xl font-bold text-amber-400 block">GATC Lab</span>
                <span className="text-[11px] text-slate-300">High-precision testing & reports</span>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xl font-bold text-amber-400 block">Public</span>
                <span className="text-[11px] text-slate-300">Open QR scanning verification</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

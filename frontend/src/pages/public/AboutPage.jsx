import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, CheckCircle2, Shield, Layers, QrCode, FileText, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="bg-slate-50 py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold mb-3">
            <Scale className="w-3.5 h-3.5" />
            Legal Metrology | Department of Consumer Affairs, GoI
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Unified Online Verification & Digital Certification System
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
            Digital Trust for Weights & Measures under Legal Metrology Regulations
          </p>
        </div>

        {/* Problem Statement Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            The Problem Statement
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In India, millions of weighing and measuring instruments used in trade, retail, petroleum dispensing, and industrial logistics are legally required to undergo periodic verification and stamping under the Legal Metrology Act, 2009. Historically, this involves paper forms, manual scheduling, physical inspection records, and offline certificates. This creates severe bottlenecks:
          </p>
          <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Difficult validity tracking:</strong> Consumers and traders cannot easily determine if a commercial scale has a valid, non-expired verification stamp.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Jurisdictional fragmentation:</strong> Physical records remain isolated in local circles, hindering national monitoring.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Vulnerability to tampering:</strong> Physical lead seals and paper certificates can be forged or altered without an instant digital audit trail.</span>
            </li>
          </ul>
        </div>

        {/* Solution Architecture */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            The MetraVerify Solution
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            MetraVerify provides a modern, cloud-native platform managing the entire lifecycle:
          </p>

          <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto">
            <div className="text-amber-400 font-bold mb-2">// Complete Digital Verification Flow</div>
            Stakeholder Registration<br />
            &nbsp;&nbsp;↓<br />
            Instrument Registration (Make, Model, Serial, Capacity, Class)<br />
            &nbsp;&nbsp;↓<br />
            Online Application (New Verification or Periodic Re-verification)<br />
            &nbsp;&nbsp;↓<br />
            Officer / GATC Centre Assignment & Scheduling<br />
            &nbsp;&nbsp;↓<br />
            Digital 7-Point Inspection Form (Instrument Condition, Display, Zero Error, Accuracy, Calibration, Sealing, Physical Condition)<br />
            &nbsp;&nbsp;↓<br />
            Pass/Fail Decision (Enforces 7/7 checks)<br />
            &nbsp;&nbsp;↓<br />
            Digital Verification Certificate Generation + Tamper-evident QR<br />
            &nbsp;&nbsp;↓<br />
            Public Smartphone QR Verification (/verify/:certificateNumber)<br />
            &nbsp;&nbsp;↓<br />
            Proactive Expiry Tracking & Automated 30-Day Alerts
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <h3 className="text-sm font-bold text-blue-900 mb-1">
            Verify a Digital Certificate
          </h3>
          <p className="text-xs text-blue-800 leading-relaxed max-w-xl mx-auto">
            Citizens, traders, and enforcement officers can instantly verify the authenticity of any MetraVerify digital certificate by scanning the QR code or entering the certificate number below.
          </p>
          <div className="mt-4">
            <Link
              to="/verify/CERT-2026-001001"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <span>View Sample Digital Certificate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

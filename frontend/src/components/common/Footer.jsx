import React from 'react';
import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Metra<span className="text-amber-400">Verify</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A unified digital verification, calibration, and electronic stamping lifecycle platform for commercial and industrial weights &amp; measures under the Legal Metrology framework in India.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/verify" className="hover:text-amber-400 transition-colors">
                  Public Certificate Verification
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">
                  System Architecture &amp; Overview
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors">
                  Stakeholder &amp; Officer Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">
              Legal &amp; Compliance
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>The Legal Metrology Act, 2009</li>
              <li>General Rules &amp; Standards of Weights &amp; Measures</li>
              <li>State Enforcement Wings (Delhi, HR, UP, RJ)</li>
              <li>Department of Consumer Affairs, GoI</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} MetraVerify. All rights reserved.</p>
          <p className="text-slate-600">Legal Metrology Division | Department of Consumer Affairs</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

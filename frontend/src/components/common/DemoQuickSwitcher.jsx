import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, User, Shield, Briefcase, FileCheck, Check, ChevronDown, ExternalLink } from 'lucide-react';

export const DemoQuickSwitcher = () => {
  const { user, quickSwitchRole } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const roles = [
    {
      key: 'BUSINESS',
      label: 'Business User',
      desc: 'Apex Logistics (Apply, Track, Certificates)',
      icon: Briefcase,
      color: 'bg-emerald-500',
      home: '/business/dashboard',
    },
    {
      key: 'ADMIN',
      label: 'HQ Admin',
      desc: 'Director Rajesh Sharma (Assign, Manage, Audit)',
      icon: Shield,
      color: 'bg-blue-600',
      home: '/admin/dashboard',
    },
    {
      key: 'LMO',
      label: 'LMO Inspector',
      desc: 'Anita Deshmukh (Digital Inspection, Pass/Fail)',
      icon: FileCheck,
      color: 'bg-purple-600',
      home: '/lmo/dashboard',
    },
    {
      key: 'GATC',
      label: 'GATC Test Lab',
      desc: 'National Calibration Centre (Dr. Sandeep)',
      icon: User,
      color: 'bg-amber-600',
      home: '/gatc/dashboard',
    },
  ];

  const handleSwitch = async (roleKey, home) => {
    try {
      setSwitching(true);
      await quickSwitchRole(roleKey);
      setIsOpen(false);
      navigate(home);
    } catch (err) {
      console.error('Failed to switch role', err);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all border border-blue-500/30"
        title="Quick Role Switcher for Hackathon Demo"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
        <span>Demo Switcher</span>
        <ChevronDown className="w-3 h-3 text-blue-200" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Demo Mode
              </span>
              <span className="text-[11px] text-slate-500">
                1-Click role switch without typing
              </span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">
              MVP
            </span>
          </div>

          <div className="py-1 space-y-1">
            {roles.map((r) => {
              const Icon = r.icon;
              const isCurrent =
                (r.key === 'BUSINESS' && user?.role === 'BUSINESS_USER') ||
                (r.key === 'ADMIN' && user?.role === 'ADMIN') ||
                (r.key === 'LMO' && user?.role === 'LMO_OFFICER') ||
                (r.key === 'GATC' && user?.role === 'GATC');

              return (
                <button
                  key={r.key}
                  disabled={switching}
                  onClick={() => handleSwitch(r.key, r.home)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                    isCurrent
                      ? 'bg-blue-50 text-blue-900 font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${r.color} text-white shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{r.label}</span>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {r.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 mt-1 pt-1.5 px-2">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/verify/CERT-2026-001001');
              }}
              className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded transition-colors"
            >
              <span>Test Public QR Page (CERT-2026-001001)</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoQuickSwitcher;

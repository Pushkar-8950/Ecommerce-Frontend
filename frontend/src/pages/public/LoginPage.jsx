import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, DEMO_CREDENTIALS } from '../../context/AuthContext';
import { Scale, Lock, Mail, ArrowRight, Shield, Briefcase, FileCheck, User } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFillDemo = (key) => {
    const cred = DEMO_CREDENTIALS[key];
    if (cred) {
      setEmail(cred.email);
      setPassword(cred.password);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const loggedUser = await login(email, password);

      // Route to role-specific dashboard
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'LMO_OFFICER') {
        navigate('/lmo/dashboard');
      } else if (loggedUser.role === 'GATC') {
        navigate('/gatc/dashboard');
      } else {
        navigate('/business/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Authentication failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-8">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-900 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Scale className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Metra<span className="text-amber-600">Verify</span> Portal Login
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Department of Consumer Affairs & Legal Metrology
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-900">
              ⚡ 1-Click Demo Accounts
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded">
              Pre-filled
            </span>
          </div>
          <p className="text-[11px] text-amber-800 mb-3">
            Click any role to auto-populate credentials for instant testing:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('BUSINESS')}
              className="p-2 bg-white hover:bg-emerald-50 border border-amber-200 rounded-lg text-left text-xs transition-colors flex items-center gap-2 group"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-slate-800 block text-[11px] group-hover:text-emerald-700">
                  Business User
                </span>
                <span className="text-[10px] text-slate-500">Apex Logistics</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('ADMIN')}
              className="p-2 bg-white hover:bg-blue-50 border border-amber-200 rounded-lg text-left text-xs transition-colors flex items-center gap-2 group"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-slate-800 block text-[11px] group-hover:text-blue-700">
                  HQ Admin
                </span>
                <span className="text-[10px] text-slate-500">Director Sharma</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('LMO')}
              className="p-2 bg-white hover:bg-purple-50 border border-amber-200 rounded-lg text-left text-xs transition-colors flex items-center gap-2 group"
            >
              <FileCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-slate-800 block text-[11px] group-hover:text-purple-700">
                  LMO Officer
                </span>
                <span className="text-[10px] text-slate-500">Anita Deshmukh</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('GATC')}
              className="p-2 bg-white hover:bg-amber-50 border border-amber-200 rounded-lg text-left text-xs transition-colors flex items-center gap-2 group"
            >
              <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-slate-800 block text-[11px] group-hover:text-amber-700">
                  GATC Test Lab
                </span>
                <span className="text-[10px] text-slate-500">Dr. Sandeep</span>
              </div>
            </button>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. business@digital-machine.demo"
                  required
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <span className="text-xs text-slate-500">New stakeholder? </span>
            <Link
              to="/register"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
            >
              Register your business / instrument
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

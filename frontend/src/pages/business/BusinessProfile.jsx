import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Shield,
  Scale,
  Award,
  Clock,
  FileText,
  Save,
  Sparkles,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const BusinessProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    organizationName: user?.organizationName || '',
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    state: user?.state || 'Delhi',
    district: user?.district || 'Central Delhi',
    pincode: user?.pincode || '',
    gstin: user?.gstin || '',
    panNumber: user?.panNumber || '',
    businessType: user?.businessType || 'Retail & Commercial Trade',
    designation: user?.designation || 'Proprietor / Authorized Signatory',
  });

  const [stats, setStats] = useState({
    totalInstruments: 0,
    verifiedInstruments: 0,
    pendingApplications: 0,
    totalCertificates: 0,
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detectingLoc, setDetectingLoc] = useState(false);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const res = await api.get('/dashboard/business');
        if (res.data?.data?.metrics) {
          setStats(res.data.data.metrics);
        }
      } catch (err) {
        console.error('Failed to load business stats', err);
      }
    };
    fetchDashboardMetrics();
  }, []);

  const handleAutoDetectLocation = () => {
    setDetectingLoc(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            setFormData((prev) => ({
              ...prev,
              state: 'Delhi',
              district: 'South Delhi',
              address: 'Okhla Industrial Area Phase 3',
              pincode: '110020',
            }));
            setDetectingLoc(false);
          }, 600);
        },
        () => {
          setDetectingLoc(false);
        }
      );
    } else {
      setDetectingLoc(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.patch(`/users/${user._id}`, formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      window.dispatchEvent(new CustomEvent('metraverify_sync'));
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 rounded-2xl flex items-center justify-center font-black text-2xl shadow-md shrink-0">
              <Building className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black tracking-tight text-white font-sans">
                  {formData.organizationName || user?.fullName || 'Commercial Enterprise'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  VERIFIED STAKEHOLDER
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Legal Metrology Stakeholder ID: <span className="font-mono text-amber-300 font-bold">{user?._id?.slice(-8).toUpperCase()}</span> • {formData.businessType}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                <span>📍 {formData.district}, {formData.state}</span>
                <span>•</span>
                <span>📮 Pincode: {formData.pincode || '110020'}</span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Enforcement Circle</span>
            <span className="text-xs font-bold text-amber-400 block mt-0.5">
              {formData.district} Circle (LMO)
            </span>
            <span className="text-[10px] text-emerald-400 font-medium block mt-1">
              Active Legal Standing
            </span>
          </div>
        </div>
      </div>

      {/* Compliance Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/business/instruments" className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all">
          <div className="flex items-center gap-1.5 text-blue-600 mb-1">
            <Scale className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-500">Registered Instruments</span>
          </div>
          <span className="text-xl font-black text-slate-900">{stats.totalInstruments || 0}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Commercial scales</span>
        </Link>

        <Link to="/business/certificates" className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-400 transition-all">
          <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-500">Active Certificates</span>
          </div>
          <span className="text-xl font-black text-emerald-600">{stats.totalCertificates || 0}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Valid QR stamping</span>
        </Link>

        <Link to="/business/applications" className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-amber-400 transition-all">
          <div className="flex items-center gap-1.5 text-amber-600 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-500">Pending Requests</span>
          </div>
          <span className="text-xl font-black text-amber-600">{stats.pendingApplications || 0}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Awaiting inspection</span>
        </Link>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-purple-600 mb-1">
            <Shield className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-500">Compliance Health</span>
          </div>
          <span className="text-xl font-black text-slate-900">100%</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Fully Verified</span>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Business Profile details updated and saved successfully!</span>
        </div>
      )}

      {/* Main Profile Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Business & Facility Identification</h2>
            <p className="text-xs text-slate-500">
              Manage official enterprise credentials, tax registration, and physical verification premise
            </p>
          </div>
          <button
            type="button"
            onClick={handleAutoDetectLocation}
            disabled={detectingLoc}
            className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>{detectingLoc ? 'Detecting...' : 'Auto-Detect Location'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Section 1: Enterprise Credentials */}
          <div>
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5 text-blue-700">
              <Building className="w-3.5 h-3.5" />
              1. Commercial Entity Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Registered Enterprise / Legal Name *
                </label>
                <input
                  type="text"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  required
                  placeholder="e.g. Apex Logistics Solutions Pvt Ltd"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Business Activity / Sector
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs"
                >
                  <option value="Retail & Commercial Trade">Retail & Commercial Trade</option>
                  <option value="Logistics & Warehousing">Logistics & Warehousing</option>
                  <option value="Jewellery & Precious Metals">Jewellery & Precious Metals</option>
                  <option value="Petroleum & Fuel Dispensing">Petroleum & Fuel Dispensing</option>
                  <option value="Food, Grain & Mandi Trading">Food, Grain & Mandi Trading</option>
                  <option value="Manufacturing & Industrial Scales">Manufacturing & Industrial Scales</option>
                  <option value="Healthcare & Pharmaceutical">Healthcare & Pharmaceutical</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  GSTIN (Goods & Services Tax ID)
                </label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  PAN / Enterprise Tax Number
                </label>
                <input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. ABCDE1234F"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Authorized Signatory */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5 text-blue-700">
              <User className="w-3.5 h-3.5" />
              2. Authorized Signatory & Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Authorized Signatory Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Managing Director / Partner"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Contact Phone *
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Premise Address & Enforcement Circle */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5 text-blue-700">
              <MapPin className="w-3.5 h-3.5" />
              3. Physical Verification Facility & Jurisdiction
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Commercial Facility / Mandi / Shop Address *
                </label>
                <textarea
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  placeholder="Plot/Unit No, Street, Industrial Area"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Facility Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  required
                  placeholder="e.g. 110020"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs font-mono h-10 mt-0.5"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Used for local inspector matching
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jurisdiction State / UT
                </label>
                <input
                  type="text"
                  value={formData.state}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-slate-500 cursor-not-allowed text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Local Enforcement District Circle
                </label>
                <input
                  type="text"
                  value={formData.district}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-slate-500 cursor-not-allowed text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-2 text-xs"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessProfile;

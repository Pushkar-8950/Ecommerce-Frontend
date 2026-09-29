import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Building2,
  CheckCircle,
  Key,
  Shield,
  User,
  Activity,
  Layers,
  Award,
} from 'lucide-react';

export const AdminProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    designation: user?.designation || 'Central Enforcement Administrator',
    department: user?.department || 'Legal Metrology Division, DCA',
    address: user?.address || 'Krishi Bhawan, Dr. Rajendra Prasad Road',
    state: user?.state || 'Delhi',
    district: user?.district || 'Central Delhi',
    pincode: user?.pincode || '110001',
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.patch(`/users/${user._id}`, formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      window.dispatchEvent(new CustomEvent('metraverify_sync'));
    } catch (err) {
      console.error('Failed to update admin profile', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600/30 border border-blue-400/40 text-amber-400 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold mb-1">
                <Shield className="w-3 h-3 text-amber-400" />
                CENTRAL AUTHORITY • HQ ADMINISTRATION
              </div>
              <h1 className="text-2xl font-black text-white">{user?.fullName || 'HQ Administrator'}</h1>
              <p className="text-xs text-slate-300 mt-0.5">
                {user?.designation || 'Central Enforcement Administrator'} • {user?.department || 'Legal Metrology Division'}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Security Clearance</span>
            <span className="text-xs font-black text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle className="w-3.5 h-3.5" /> Level 4 - Full Executive
            </span>
          </div>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">HQ Administrator Profile details updated successfully!</span>
        </div>
      )}

      {/* Profile Details & Edit Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Administrator Credentials & Workstation Profile</h2>
            <p className="text-xs text-slate-500">Official administrative details and national jurisdiction identity</p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
            Active Central Session
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Readonly Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Official Government Email
              </span>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="font-mono font-bold text-slate-800">{user?.email}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                System Role & Rights
              </span>
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-slate-800">CENTRAL_ADMIN (National Command)</span>
              </div>
            </div>
          </div>

          {/* Editable Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Executive Full Name *
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Designation / Title
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Department / Authority
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                HQ Premise Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                State / UT
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
                Headquarters District Circle
              </label>
              <input
                type="text"
                value={formData.district}
                disabled
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-slate-500 cursor-not-allowed text-xs"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all text-xs"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Central Authority System Privileges */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          HQ Administrative System Privileges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Officer Allocation & Dispatch</span>
              <span className="text-[11px] text-slate-500">
                Authorized to assign submitted verification applications to field LMOs and GATCs.
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Tamper Audit Log Access</span>
              <span className="text-[11px] text-slate-500">
                Full cryptographic audit trail access for verification, revocation, and inspection logs.
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">National Certificate Registry</span>
              <span className="text-[11px] text-slate-500">
                Real-time oversight over all digital certificates, expiry dates, and stamping statuses.
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Jurisdiction & Officer Management</span>
              <span className="text-[11px] text-slate-500">
                Maintain active officer circles, testing laboratory accreditations, and stakeholder accounts.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

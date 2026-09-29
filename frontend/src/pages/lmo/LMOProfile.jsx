import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Mail, Phone, MapPin, Building2 } from 'lucide-react';

export const LMOProfile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Officer Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View your Legal Metrology Officer details and jurisdiction.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
          <div className="w-20 h-20 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center shrink-0">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.fullName}</h2>
            <p className="text-sm text-slate-500">{user?.designation || 'Legal Metrology Officer'}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded">
              LMO JURISDICTION
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Contact Information</h3>
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</span>
                <span className="text-sm font-medium text-slate-800">{user?.email || 'N/A'}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Phone Number</span>
                <span className="text-sm font-medium text-slate-800">{user?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Department Details</h3>
            <div className="flex items-start gap-3">
              <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Department</span>
                <span className="text-sm font-medium text-slate-800 block">{user?.department || user?.organizationName}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Jurisdiction Location</span>
                <span className="text-sm font-medium text-slate-800 block">{user?.address || 'N/A'}</span>
                <span className="text-xs text-slate-500 block mt-0.5">{user?.district}, {user?.state}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMOProfile;

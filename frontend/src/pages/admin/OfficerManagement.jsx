import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { ShieldCheck, Mail, Phone, MapPin, Award } from 'lucide-react';

export const OfficerManagement = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users/officers');
        setOfficers(res.data.data || []);
      } catch (err) {
        console.error('Failed to load officers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOfficers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Legal Metrology Officers Deployment</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Authorized inspecting officers across circles and districts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading officer records...
          </div>
        ) : officers.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-400 text-xs">
            No active officers registered.
          </div>
        ) : (
          officers.map((off) => (
            <div
              key={off._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-bold text-[10px]">
                    LMO ACTIVE
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3">{off.fullName}</h3>
                <span className="text-xs text-slate-500 block font-medium">
                  {off.designation || 'Legal Metrology Officer'}
                </span>
                <span className="text-[11px] text-purple-700 font-semibold block mt-0.5">
                  {off.department || 'Legal Metrology Department'}
                </span>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Jurisdiction: {off.district}, {off.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-[11px]">{off.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{off.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OfficerManagement;

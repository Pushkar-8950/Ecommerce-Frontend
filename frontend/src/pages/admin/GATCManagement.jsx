import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Building2, MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';

export const GATCManagement = () => {
  const [gatcs, setGatcs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGatcs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/gatcs');
        setGatcs(res.data.data || []);
      } catch (err) {
        console.error('Failed to load GATCs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGatcs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Government Approved Test Centres (GATC)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Accredited independent testing laboratories authorized to conduct calibration and standard tests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading test centre records...
          </div>
        ) : gatcs.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-400 text-xs">
            No GATC centres recorded.
          </div>
        ) : (
          gatcs.map((g) => (
            <div
              key={g._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {g.centreCode}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3">{g.centreName}</h3>
                <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                  Accreditation: {g.accreditationNo}
                </span>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{g.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-[11px]">{g.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{g.phone} ({g.contactPerson})</span>
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

export default GATCManagement;

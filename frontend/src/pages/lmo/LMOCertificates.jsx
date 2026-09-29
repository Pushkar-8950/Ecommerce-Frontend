import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/common/StatusBadge';
import { Award, Download, Eye, ExternalLink } from 'lucide-react';

export const LMOCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/certificates');
        setCertificates(res.data.data || []);
      } catch (err) {
        console.error('Failed to load certificates', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Issued Verification Certificates</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Digital verification certificates stamped by this Legal Metrology officer circle.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading certificates...
          </div>
        ) : certificates.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No certificates stamped yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Certificate Ref</th>
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-4">Enterprise</th>
                  <th className="py-3 px-4">Validity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certificates.map((cert) => (
                  <tr key={cert._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {cert.qrCodeDataUrl && (
                          <img src={cert.qrCodeDataUrl} alt="QR" className="w-7 h-7 rounded border border-slate-200" />
                        )}
                        <div>
                          <Link
                            to={`/business/certificates/${cert._id}`}
                            className="font-mono font-bold text-purple-700 hover:underline block"
                          >
                            {cert.certificateNumber}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {cert.digitalStampCode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{cert.instrumentType}</span>
                      <span className="text-[11px] text-slate-500 block font-mono">{cert.instrumentId}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{cert.businessName}</span>
                      <span className="text-[11px] text-slate-500 block">{cert.district}, {cert.state}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>
                        <span>
                          {new Date(cert.validUntil).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        {cert.daysRemaining !== undefined && (
                          <span className="text-[10px] text-slate-400 block">
                            {cert.daysRemaining} days left
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={cert.computedStatus || cert.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/business/certificates/${cert._id}`}
                          className="p-1.5 text-slate-500 hover:text-purple-600 rounded-lg"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <a
                          href={`/api/certificates/${cert.certificateNumber}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg"
                          title="PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LMOCertificates;

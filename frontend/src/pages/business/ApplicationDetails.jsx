import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/common/StatusBadge';
import Timeline from '../../components/common/Timeline';
import {
  FileCheck,
  ArrowLeft,
  Calendar,
  User,
  Scale,
  Award,
  Download,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const ApplicationDetails = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/applications/${id}`);
        setApp(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load application details.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs text-slate-500 font-medium">Loading application tracking...</span>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-rose-200 text-center max-w-lg mx-auto">
        <h3 className="text-sm font-bold text-rose-700">Application Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">{error}</p>
        <Link
          to="/business/applications"
          className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/business/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>

        {app.certificate && (
          <Link
            to={`/business/certificates/${app.certificate._id || app.certificate}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors text-center"
          >
            <Award className="w-4 h-4" />
            <span>View Issued Certificate</span>
          </Link>
        )}
      </div>

      {/* Case Overview Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-blue-600">
                {app.applicationId}
              </span>
              <StatusBadge status={app.status} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 break-words">
              {app.applicationType === 'RE_VERIFICATION'
                ? 'Re-verification & Stamping Case'
                : 'New Verification & Stamping Case'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Submitted on{' '}
              {new Date(app.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left sm:text-right shrink-0">
            <span className="text-[11px] text-slate-500 block">Inspection Date</span>
            <span className="text-sm font-bold text-slate-900 block mt-0.5">
              {new Date(app.scheduledDate || app.preferredDate).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <span className="text-[11px] text-blue-600 font-medium block">
              Slot: {app.scheduledSlot || '10:00 AM - 01:00 PM'}
            </span>
          </div>
        </div>

        {/* Visual Workflow Timeline */}
        <div className="py-6 border-b border-slate-100">
          <Timeline currentStatus={app.status} timelineEntries={app.timeline} />
        </div>

        {/* Rejection Alert if failed */}
        {app.status === 'REJECTED' && app.rejectionReason && (
          <div className="my-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-900">Inspection Non-Compliance Remarks</h4>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                {app.rejectionReason}
              </p>
              <span className="text-[11px] text-rose-600 block mt-1 font-medium">
                The instrument must be serviced or recalibrated before reapplying.
              </span>
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Instrument Box */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-blue-600" />
              Target Instrument
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                <span className="text-slate-500">Type:</span>
                <span className="font-semibold text-slate-800 break-words">{app.instrument?.instrumentType}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                <span className="text-slate-500">Instrument ID:</span>
                <span className="font-mono text-blue-600 font-semibold break-all">{app.instrument?.instrumentId}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                <span className="text-slate-500">Manufacturer & Model:</span>
                <span className="text-slate-800 break-words">{app.instrument?.manufacturer} ({app.instrument?.model})</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                <span className="text-slate-500">Serial Number:</span>
                <span className="font-mono text-slate-800 break-all">{app.instrument?.serialNumber}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                <span className="text-slate-500">Capacity / Class:</span>
                <span className="text-slate-800 break-words">{app.instrument?.capacity} ({app.instrument?.accuracyClass})</span>
              </div>
            </div>
          </div>

          {/* Officer & Location Box */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Assigned Legal Metrology Authority
            </h4>
            {app.assignedOfficer ? (
              <div className="space-y-1.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                  <span className="text-slate-500">Inspecting Officer:</span>
                  <span className="font-bold text-slate-900 break-words">{app.assignedOfficer.fullName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                  <span className="text-slate-500">Designation:</span>
                  <span className="text-slate-700 break-words">{app.assignedOfficer.designation || 'Legal Metrology Officer'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                  <span className="text-slate-500">Department:</span>
                  <span className="text-slate-700 break-words">{app.assignedOfficer.department || 'Enforcement Wing'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                  <span className="text-slate-500">Contact Email:</span>
                  <span className="text-slate-700 break-all">{app.assignedOfficer.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                  <span className="text-slate-500">Inspection Venue:</span>
                  <span className="text-slate-800 break-words">{app.preferredLocation}</span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 italic">
                Awaiting administrative officer allocation for this circle.
              </div>
            )}
          </div>
        </div>

        {app.notes && (
          <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
            <span className="font-semibold text-slate-700 block mb-0.5">Applicant Notes:</span>
            {app.notes}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetails;

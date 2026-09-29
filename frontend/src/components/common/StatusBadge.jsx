import React from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Calendar,
  FileCheck,
  ShieldCheck,
  Ban,
  Activity,
} from 'lucide-react';

const statusConfig = {
  VALID: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: ShieldCheck,
    label: 'Valid & Certified',
  },
  EXPIRING_SOON: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse',
    icon: AlertTriangle,
    label: 'Expiring Soon (<=30d)',
  },
  EXPIRED: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: XCircle,
    label: 'Expired / Lapsed',
  },
  REVOKED: {
    bg: 'bg-red-100 text-red-800 border-red-300',
    icon: Ban,
    label: 'Revoked',
  },
  REGISTERED: {
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: Clock,
    label: 'Registered (New)',
  },
  PENDING_VERIFICATION: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Clock,
    label: 'Pending Verification',
  },
  SUBMITTED: {
    bg: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: Clock,
    label: 'Submitted',
  },
  UNDER_REVIEW: {
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Activity,
    label: 'Under Review',
  },
  SCHEDULED: {
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Calendar,
    label: 'Scheduled',
  },
  INSPECTION: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Activity,
    label: 'Under Inspection',
  },
  UNDER_INSPECTION: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Activity,
    label: 'Under Inspection',
  },
  VERIFIED: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
    label: 'Verified & Passed',
  },
  REJECTED: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: XCircle,
    label: 'Rejected',
  },
  CERTIFICATE_ISSUED: {
    bg: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: FileCheck,
    label: 'Certificate Issued',
  },
};

export const StatusBadge = ({ status, size = 'sm', customLabel }) => {
  const normalized = (status || '').toUpperCase();
  const config = statusConfig[normalized] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
    label: status || 'Unknown',
  };

  const Icon = config.icon;
  const sizeClasses =
    size === 'lg'
      ? 'px-3 py-1.5 text-sm font-semibold'
      : size === 'md'
      ? 'px-2.5 py-1 text-xs font-medium'
      : 'px-2 py-0.5 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{customLabel || config.label}</span>
    </span>
  );
};

export default StatusBadge;

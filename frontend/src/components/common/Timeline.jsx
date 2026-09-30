import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

const stages = [
  { key: 'SUBMITTED', label: '1. Submitted' },
  { key: 'SCHEDULED', label: '2. Assigned & Scheduled' },
  { key: 'INSPECTION', label: '3. Digital Inspection' },
  { key: 'VERIFIED', label: '4. Decision (Pass/Fail)' },
  { key: 'CERTIFICATE_ISSUED', label: '5. Certificate & QR' },
];

export const Timeline = ({ currentStatus, timelineEntries = [] }) => {
  const getStageIndex = (status) => {
    switch (status) {
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return 0;
      case 'SCHEDULED':
        return 1;
      case 'INSPECTION':
      case 'UNDER_INSPECTION':
        return 2;
      case 'VERIFIED':
      case 'REJECTED':
        return 3;
      case 'CERTIFICATE_ISSUED':
        return 4;
      default:
        return 0;
    }
  };

  const activeIdx = getStageIndex(currentStatus);
  const isRejected = currentStatus === 'REJECTED';

  return (
    <div className="w-full py-4">
      {/* Visual Step Progress Bar (Scrollable on small mobile) */}
      <div className="overflow-x-auto pb-4 pt-2 -mx-2 px-2 sm:mx-0 sm:px-0 sm:pb-2">
        <div className="min-w-[460px] sm:min-w-0 flex items-center justify-between relative mb-4 sm:mb-6 px-4">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
          <div
            className={`absolute left-6 top-1/2 -translate-y-1/2 h-1 transition-all duration-500 z-0 ${
              isRejected ? 'bg-rose-500' : 'bg-emerald-600'
            }`}
            style={{ width: `${(activeIdx / (stages.length - 1)) * 88}%` }}
          />

          {stages.map((stage, idx) => {
            const isPassed = idx < activeIdx;
            const isCurrent = idx === activeIdx;

            let circleBg = 'bg-white border-slate-300 text-slate-400';
            let textColor = 'text-slate-500';

            if (isPassed) {
              circleBg = 'bg-emerald-600 border-emerald-600 text-white';
              textColor = 'text-emerald-700 font-medium';
            } else if (isCurrent) {
              if (isRejected && idx === 3) {
                circleBg = 'bg-rose-600 border-rose-600 text-white animate-pulse';
                textColor = 'text-rose-700 font-bold';
              } else {
                circleBg = 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100';
                textColor = 'text-blue-700 font-bold';
              }
            }

            return (
              <div key={stage.key} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${circleBg}`}
                >
                  {isPassed ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : isCurrent && isRejected && idx === 3 ? (
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className={`text-[11px] sm:text-xs mt-2 text-center max-w-[80px] sm:max-w-[90px] leading-tight ${textColor}`}>
                  {stage.key === 'VERIFIED' && isRejected ? '4. Rejected' : stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Chronological History Log */}
      {timelineEntries && timelineEntries.length > 0 && (
        <div className="mt-4 sm:mt-6 border-t border-slate-200 pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Workflow Activity Log
          </h4>
          <div className="space-y-3">
            {timelineEntries.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2">
                    <span className="font-semibold text-slate-800 break-words">{entry.title}</span>
                    <span className="text-slate-400 text-[11px] shrink-0">
                      {new Date(entry.timestamp).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {entry.comments && (
                    <p className="text-slate-600 mt-0.5 break-words">{entry.comments}</p>
                  )}
                  {entry.updatedByName && (
                    <span className="text-slate-400 text-[11px] block mt-0.5">
                      By: {entry.updatedByName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;

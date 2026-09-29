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
      {/* Visual Step Progress Bar */}
      <div className="flex items-center justify-between relative mb-8">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full z-0" />
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 transition-all duration-500 z-0 ${
            isRejected ? 'bg-rose-500' : 'bg-emerald-600'
          }`}
          style={{ width: `${(activeIdx / (stages.length - 1)) * 100}%` }}
        />

        {stages.map((stage, idx) => {
          const isPassed = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          const isFinalStage = idx === 4;

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
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${circleBg}`}
              >
                {isPassed ? (
                  <Check className="w-4 h-4" />
                ) : isCurrent && isRejected && idx === 3 ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  idx + 1
                )}
              </div>
              <span className={`text-xs mt-2 text-center max-w-[90px] ${textColor}`}>
                {stage.key === 'VERIFIED' && isRejected ? '4. Rejected' : stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed Chronological History Log */}
      {timelineEntries && timelineEntries.length > 0 && (
        <div className="mt-6 border-t border-slate-200 pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Workflow Activity Log
          </h4>
          <div className="space-y-3">
            {timelineEntries.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{entry.title}</span>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(entry.timestamp).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {entry.comments && (
                    <p className="text-slate-600 mt-0.5">{entry.comments}</p>
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

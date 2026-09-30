import React from 'react';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ExpiryAlertBanner = ({ expiringList = [], expiredCount = 0 }) => {
  if (expiringList.length === 0 && expiredCount === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-r-xl p-4 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              Legal Metrology Compliance Alert
              {expiredCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] bg-rose-100 text-rose-800 rounded-full font-semibold">
                  {expiredCount} Stamping Lapsed
                </span>
              )}
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              {expiringList.length > 0
                ? `${expiringList.length} instrument(s) require re-verification within 30 days to avoid statutory penalties.`
                : `${expiredCount} instrument(s) have expired verification stamping.`}
            </p>

            {/* List preview of expiring instruments */}
            {expiringList.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {expiringList.slice(0, 3).map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/80 border border-amber-200 text-amber-900 rounded text-[11px] font-medium"
                  >
                    <span className="font-semibold">{item.instrumentId}</span>: {item.instrumentType} (Due in {item.daysRemaining}d)
                  </span>
                ))}
                {expiringList.length > 3 && (
                  <span className="text-[11px] text-amber-700 font-semibold self-center">
                    +{expiringList.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
          <Link
            to="/business/applications/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors text-center"
          >
            <span>Apply for Re-verification</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExpiryAlertBanner;

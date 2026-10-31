import React from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { formatRelativeTime } from '../../utils/ledger';

export default function KidPendingBox() {
  const { data } = useStarbook();
  const pendingStars = data.pendingStars || [];

  const getTierIcon = (tier) => {
    if (tier === 'gold') return '🥇';
    if (tier === 'silver') return '🥈';
    return '🥉';
  };

  return (
    <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 md:p-6 shadow-md border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⏳</span>
          <h3 className="text-lg md:text-xl font-black text-slate-800 font-kid">
            Pending Approval Box
          </h3>
          {pendingStars.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
              {pendingStars.length}
            </span>
          )}
        </div>
        <span className="text-xs font-semibold text-slate-400">Waiting for Mom & Dad</span>
      </div>

      {/* Pending Stars List */}
      <div className="space-y-2.5">
        {pendingStars.length === 0 ? (
          <div className="empty-state">
            <span className="text-4xl anim-bounce-gentle">🌟</span>
            <p className="font-bold text-slate-700 mt-2">All caught up!</p>
            <p className="text-xs text-slate-500">Scan a barcode when you complete a chore to earn stars!</p>
          </div>
        ) : (
          pendingStars.map(star => (
            <div key={star.id} className={`pending-star-item tier-${star.tier}`}>
              <div className="star-left">
                <span className="star-icon">{getTierIcon(star.tier)}</span>
                <div>
                  <div className="font-bold text-slate-800 text-sm">
                    {star.icon} {star.reason}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 flex-wrap">
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600">
                      {star.barcodeName || star.barcode}
                    </span>
                    <span>• {formatRelativeTime(star.timestamp)}</span>
                  </div>
                </div>
              </div>
              <div className="pending-status-pill">
                <span className="pulse-dot"></span> Waiting for Approval
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}


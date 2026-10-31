import React, { useState } from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { formatRelativeTime } from '../../utils/ledger';

export default function ParentPendingTab() {
  const { data, approveStar, approveAllPending, rejectStar } = useStarbook();
  const pendingStars = data.pendingStars || [];
  const [tierAdjustments, setTierAdjustments] = useState({});

  const handleTierChange = (starId, newTier) => {
    setTierAdjustments(prev => ({
      ...prev,
      [starId]: newTier
    }));
  };

  const getTierIcon = (tier) => {
    if (tier === 'gold') return '🥇';
    if (tier === 'silver') return '🥈';
    return '🥉';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-bold text-slate-800 font-kid">Pending Star Requests</h3>
          <p className="text-xs text-slate-500">
            Review your child's scanned chores, change star tier if needed, and approve or reject.
          </p>
        </div>
        {pendingStars.length > 0 && (
          <button
            onClick={approveAllPending}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <span>✓</span> Approve All ({pendingStars.length})
          </button>
        )}
      </div>

      {pendingStars.length === 0 ? (
        <div className="empty-state py-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-5xl anim-bounce-gentle block mb-2">🎉</span>
          <h4 className="font-bold text-slate-700 text-base">No pending approvals!</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            When your child scans a chore barcode, it will appear here for your sign-off.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingStars.map(star => {
            const currentTier = tierAdjustments[star.id] || star.tier;

            return (
              <div key={star.id} className="approval-card bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getTierIcon(currentTier)}</span>
                    <span className={`star-badge-mini tier-${currentTier} uppercase text-[10px] font-black px-2 py-0.5 rounded-full`}>
                      {currentTier} Star
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      • {formatRelativeTime(star.timestamp)}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-lg mt-1 flex items-center gap-2">
                    <span>{star.icon}</span> <span>{star.reason}</span>
                  </h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Barcode: <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">{star.barcode}</span> • {star.barcodeName || 'Scanned item'}
                  </p>
                </div>

                <div className="card-actions flex items-center gap-2 flex-wrap sm:flex-nowrap w-full md:w-auto">
                  <select
                    value={currentTier}
                    onChange={(e) => handleTierChange(star.id, e.target.value)}
                    className="tier-adjust-select text-xs font-semibold rounded-xl px-3 py-2 border border-slate-300 bg-white flex-1 sm:flex-initial min-h-[42px]"
                  >
                    <option value="gold">🥇 Gold (4 pts)</option>
                    <option value="silver">🥈 Silver (2 pts)</option>
                    <option value="bronze">🥉 Bronze (1 pt)</option>
                  </select>

                  <button
                    onClick={() => approveStar(star.id, currentTier)}
                    className="btn-approve-star btn-action-approve text-xs font-bold px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition flex-1 sm:flex-initial text-center justify-center flex items-center min-h-[42px]"
                  >
                    ✓ Approve
                  </button>

                  <button
                    onClick={() => rejectStar(star.id)}
                    className="btn-reject-star btn-action-reject text-xs font-bold px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition flex-1 sm:flex-initial text-center justify-center flex items-center min-h-[42px]"
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


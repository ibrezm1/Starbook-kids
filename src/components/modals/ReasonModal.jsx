import React, { useState } from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';

export default function ReasonModal() {
  const { activeModal, modalPayload, closeModal, openModal } = useStarbook();
  const [customReason, setCustomReason] = useState('');

  const isOpen = activeModal === 'reason';
  if (!isOpen) return null;

  const currentBarcode = modalPayload?.barcode || 'CUSTOM-CHORE';
  const forcedTier = modalPayload?.forcedTier || null;

  const handleSelectReason = (reason, icon, tier) => {
    soundController.playPop();
    closeModal();
    openModal('starAward', {
      barcode: currentBarcode,
      reason,
      icon,
      tier: forcedTier || tier
    });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customReason.trim()) return;
    soundController.playPop();
    closeModal();
    openModal('starAward', {
      barcode: currentBarcode,
      reason: customReason.trim(),
      icon: '⭐',
      tier: forcedTier || 'gold'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-pop-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border-4 border-amber-300 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-black text-xl font-kid">What did you accomplish?</h3>
            <p className="text-xs text-amber-100 font-medium">Pick a chore or type what you did to earn your star!</p>
          </div>
          <button
            onClick={() => { soundController.playPop(); closeModal(); }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Custom Chore Input Form */}
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Or type your own awesome deed..."
              className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-slate-200 text-sm font-semibold focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!customReason.trim()}
              className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-900 font-black text-sm shadow-md transition font-kid"
            >
              Next ➔
            </button>
          </form>

          {/* Quick Chore Groups */}
          <div className="space-y-4 pt-2">
            {/* Bronze Chores */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-orange-700 uppercase tracking-wider mb-2">
                <span>🥉</span> Bronze Chores (Quick Tasks • 1 pt)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelectReason('Brushed Teeth 2 Minutes', '🪥', 'bronze')}
                  className="btn-chore-preset p-3 rounded-2xl border border-slate-200 hover:border-amber-400 text-left flex items-center gap-2.5 transition"
                >
                  <span className="text-2xl">🪥</span>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Brushed Teeth</span>
                    <span className="text-[10px] text-orange-600 font-extrabold">🥉 Bronze</span>
                  </div>
                </button>
                <button
                  onClick={() => handleSelectReason('Made My Bed Nicely', '🛏️', 'bronze')}
                  className="btn-chore-preset p-3 rounded-2xl border border-slate-200 hover:border-amber-400 text-left flex items-center gap-2.5 transition"
                >
                  <span className="text-2xl">🛏️</span>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Made My Bed</span>
                    <span className="text-[10px] text-orange-600 font-extrabold">🥉 Bronze</span>
                  </div>
                </button>
                <button
                  onClick={() => handleSelectReason('Put Away All Toys', '🧸', 'bronze')}
                  className="btn-chore-preset p-3 rounded-2xl border border-slate-200 hover:border-amber-400 text-left flex items-center gap-2.5 transition"
                >
                  <span className="text-2xl">🧸</span>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Put Toys Away</span>
                    <span className="text-[10px] text-orange-600 font-extrabold">🥉 Bronze</span>
                  </div>
                </button>
                <button
                  onClick={() => handleSelectReason('Drank Water / Healthy Snack', '💧', 'bronze')}
                  className="btn-chore-preset p-3 rounded-2xl border border-slate-200 hover:border-amber-400 text-left flex items-center gap-2.5 transition"
                >
                  <span className="text-2xl">💧</span>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Drank Water</span>
                    <span className="text-[10px] text-orange-600 font-extrabold">🥉 Bronze</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Silver Chores */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                <span>🥈</span> Silver Chores (Daily Milestones • 2 pts)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelectReason('Finished Homework', '📚', 'silver')}
                  className="btn-chore-preset p-3 rounded-2xl border border-slate-200 hover:border-amber-400 text-left flex items-center gap-2.5 transition"
                >
                  <span className="text-2xl">📚</span>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Finished Homework</span>
                    <span className="text-[10px] text-slate-600 font-extrabold">🥈 Silver</span>
                  </div>
                </button>
                <button
                  onClick={() => handleSelectReason('Read for 20 Minutes', '📖', 'silver')}
                  className="btn-chore-preset p-3 rounded-2xl border border-slate-200 hover:border-amber-400 text-left flex items-center gap-2.5 transition"
                >
                  <span className="text-2xl">📖</span>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Read 20 Mins</span>
                    <span className="text-[10px] text-slate-600 font-extrabold">🥈 Silver</span>
                  </div>
                </button>
                <button
                  onClick={() => handleSelectReason('Ate All My Veggies', '🥦', 'silver')}
                  className="btn-chore-preset p-3 rounded-2xl border border-slate-200 hover:border-amber-400 text-left flex items-center gap-2.5 transition"
                >
                  <span className="text-2xl">🥦</span>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Ate All Veggies</span>
                    <span className="text-[10px] text-slate-600 font-extrabold">🥈 Silver</span>
                  </div>
                </button>
                <button
                  onClick={() => handleSelectReason('Fed / Walked Pet', '🐕', 'silver')}
                  className="btn-chore-preset p-3 rounded-2xl border border-slate-200 hover:border-amber-400 text-left flex items-center gap-2.5 transition"
                >
                  <span className="text-2xl">🐕</span>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Pet Care Hero</span>
                    <span className="text-[10px] text-slate-600 font-extrabold">🥈 Silver</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Gold Chores */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 uppercase tracking-wider mb-2">
                <span>🥇</span> Gold Chores (Super Star Milestones • 4 pts)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelectReason('Cleaned My Bedroom', '🧹', 'gold')}
                  className="btn-chore-preset p-3 rounded-2xl border border-slate-200 hover:border-amber-400 text-left flex items-center gap-2.5 transition"
                >
                  <span className="text-2xl">🧹</span>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Cleaned Room</span>
                    <span className="text-[10px] text-amber-600 font-extrabold">🥇 Gold</span>
                  </div>
                </button>
                <button
                  onClick={() => handleSelectReason('Helped Family Member', '🤝', 'gold')}
                  className="btn-chore-preset p-3 rounded-2xl border border-slate-200 hover:border-amber-400 text-left flex items-center gap-2.5 transition"
                >
                  <span className="text-2xl">🤝</span>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Kind Helper</span>
                    <span className="text-[10px] text-amber-600 font-extrabold">🥇 Gold</span>
                  </div>
                </button>
                <button
                  onClick={() => handleSelectReason('Washed / Loaded Dishes', '🧽', 'gold')}
                  className="btn-chore-preset p-3 rounded-2xl border border-slate-200 hover:border-amber-400 text-left flex items-center gap-2.5 transition"
                >
                  <span className="text-2xl">🧽</span>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Kitchen Dishes</span>
                    <span className="text-[10px] text-amber-600 font-extrabold">🥇 Gold</span>
                  </div>
                </button>
                <button
                  onClick={() => handleSelectReason('Folded & Put Laundry Away', '🧺', 'gold')}
                  className="btn-chore-preset p-3 rounded-2xl border border-slate-200 hover:border-amber-400 text-left flex items-center gap-2.5 transition"
                >
                  <span className="text-2xl">🧺</span>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Fold Laundry</span>
                    <span className="text-[10px] text-amber-600 font-extrabold">🥇 Gold</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}


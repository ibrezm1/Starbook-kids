import React from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';

export default function CelebrationModal() {
  const { activeModal, modalPayload, closeModal } = useStarbook();

  const isOpen = activeModal === 'celebration';
  if (!isOpen) return null;

  const star = modalPayload || { reason: 'Cleaned Bedroom', icon: '🧹', tier: 'gold' };

  const getTierDetails = (tier) => {
    if (tier === 'gold') return { emoji: '🥇', label: 'Gold Star', pts: '4 Points' };
    if (tier === 'silver') return { emoji: '🥈', label: 'Silver Star', pts: '2 Points' };
    return { emoji: '🥉', label: 'Bronze Star', pts: '1 Point' };
  };

  const details = getTierDetails(star.tier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-pop-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-4 border-amber-400 p-8 text-center relative">
        
        <div className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2">
          ⭐ AWESOME JOB! ⭐
        </div>

        {/* Giant Animated Star */}
        <div className="my-4">
          <div className="text-7xl anim-bounce-gentle inline-block">{details.emoji}</div>
          <div className="text-sm font-extrabold text-amber-800 uppercase tracking-wider mt-2 font-kid">
            {details.label} ({details.pts})
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-black text-slate-800 font-kid mb-2">
          Star Request Sent! 🎉
        </h3>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-slate-700 text-sm mb-6">
          <strong>{star.icon} {star.reason}</strong><br />
          <span className="text-xs text-slate-500">Sent to Mom & Dad for Approval!</span>
        </div>

        <button
          onClick={() => { soundController.playPop(); closeModal(); }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-base shadow-lg shadow-indigo-300 font-kid transition transform active:scale-95"
        >
          Woohoo! Got It! 👍
        </button>

      </div>
    </div>
  );
}


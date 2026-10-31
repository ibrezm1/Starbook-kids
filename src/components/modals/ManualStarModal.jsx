import React, { useState } from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';

export default function ManualStarModal() {
  const { activeModal, closeModal, giftManualStar } = useStarbook();
  const [tier, setTier] = useState('gold');
  const [count, setCount] = useState(1);
  const [note, setNote] = useState('');

  const isOpen = activeModal === 'manualStar';
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    closeModal();
    giftManualStar(tier, parseInt(count || 1, 10), note.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-pop-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-400">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <h3 className="text-xl font-black text-slate-800 font-kid">Gift Bonus Stars</h3>
          </div>
          <button
            onClick={() => { soundController.playPop(); closeModal(); }}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-1 uppercase">Star Tier</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="gold">🥇 Gold Star (4 pts)</option>
              <option value="silver">🥈 Silver Star (2 pts)</option>
              <option value="bronze">🥉 Bronze Star (1 pt)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1 uppercase">Count</label>
            <input
              type="number"
              min="1"
              max="10"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-center"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1 uppercase">Reason / Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Excellent sharing with sister"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm shadow-md transition font-kid"
          >
            Deposit Bonus Stars ⭐
          </button>
        </form>

      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';

export default function CustomCashoutModal() {
  const { activeModal, closeModal, cashOutReward } = useStarbook();
  const [name, setName] = useState('');
  const [gold, setGold] = useState(0);
  const [silver, setSilver] = useState(0);
  const [bronze, setBronze] = useState(0);
  const [note, setNote] = useState('');

  const isOpen = activeModal === 'customCashout';
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const custom = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      icon: '🎁',
      cost: {
        gold: parseInt(gold || 0, 10),
        silver: parseInt(silver || 0, 10),
        bronze: parseInt(bronze || 0, 10)
      },
      note: note.trim() || 'Custom parent redemption'
    };

    closeModal();
    cashOutReward(custom.id, custom);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-pop-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-slate-900">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">➖</span>
            <h3 className="text-xl font-black text-slate-800 font-kid">Custom Cash Out</h3>
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
            <label className="block font-bold text-slate-600 mb-1 uppercase">Reward / Treat Description</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Extra 20 Mins Playground Time"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1 uppercase">Stars to Deduct</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block mb-0.5">🥇 Gold</span>
                <input
                  type="number"
                  min="0"
                  value={gold}
                  onChange={(e) => setGold(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-xl border border-slate-300 text-center font-bold"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block mb-0.5">🥈 Silver</span>
                <input
                  type="number"
                  min="0"
                  value={silver}
                  onChange={(e) => setSilver(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-xl border border-slate-300 text-center font-bold"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block mb-0.5">🥉 Bronze</span>
                <input
                  type="number"
                  min="0"
                  value={bronze}
                  onChange={(e) => setBronze(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-xl border border-slate-300 text-center font-bold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1 uppercase">Parent Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Redeemed on Saturday afternoon"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md transition font-kid"
          >
            Deduct Stars & Log Redemption 🍦
          </button>
        </form>

      </div>
    </div>
  );
}


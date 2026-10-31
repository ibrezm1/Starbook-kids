import React, { useState } from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';

export default function StarAwardModal() {
  const { activeModal, modalPayload, closeModal, startChore } = useStarbook();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const isOpen = activeModal === 'starAward';
  if (!isOpen) return null;

  const currentChore = modalPayload || { reason: 'Cleaned Bedroom', icon: '🧹', barcode: 'CHORE-01', tier: 'gold' };

  const handleAwardTier = (tier) => {
    soundController.playPop();
    closeModal();
    startChore(tier, currentChore.reason, currentChore.icon, currentChore.barcode);
  };

  const handleSpinWheel = () => {
    if (spinning) return;
    setSpinning(true);

    const extraSpins = 4 + Math.floor(Math.random() * 4); // 4 to 7 full rotations
    const randomStop = Math.floor(Math.random() * 360);
    const newRotation = rotation + (extraSpins * 360) + randomStop;
    setRotation(newRotation);

    let tickCount = 0;
    const interval = setInterval(() => {
      soundController.playTick();
      tickCount++;
      if (tickCount > 18) clearInterval(interval);
    }, 120);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);

      // Determine landed tier
      const normalized = (360 - (newRotation % 360)) % 360;
      let wonTier = 'bronze';
      if (normalized >= 0 && normalized < 120) {
        wonTier = 'gold';
      } else if (normalized >= 120 && normalized < 240) {
        wonTier = 'silver';
      } else {
        wonTier = 'bronze';
      }

      soundController.playFanfare();
      setTimeout(() => {
        closeModal();
        startChore(wonTier, currentChore.reason, currentChore.icon, currentChore.barcode);
      }, 700);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-pop-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-4 border-amber-300 p-6 text-center flex flex-col items-center">
        
        <div className="flex items-center justify-between w-full mb-3">
          <div className="text-left">
            <span className="text-xs uppercase font-extrabold text-amber-500 tracking-wider">Step 2 of 2</span>
            <h3 className="font-black text-xl text-slate-800 font-kid">Claim Your Star Reward!</h3>
          </div>
          <button
            onClick={() => { soundController.playPop(); closeModal(); }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Selected Chore Banner */}
        <div className="w-full p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3 mb-4 text-left">
          <span className="text-3xl">{currentChore.icon || '⭐'}</span>
          <div>
            <h4 className="font-extrabold text-sm text-slate-800">{currentChore.reason}</h4>
            <span className="text-[11px] font-mono text-slate-400">{currentChore.barcode}</span>
          </div>
        </div>

        {/* 🎰 Star Spinner Wheel */}
        <div className="relative my-3 flex items-center justify-center">
          <div className="wheel-pointer z-10 text-3xl">▼</div>
          <div
            className="spinner-wheel shadow-xl"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 2.4s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none'
            }}
          >
            <div className="wheel-segment segment-gold font-kid">🥇 GOLD</div>
            <div className="wheel-segment segment-silver font-kid">🥈 SILVER</div>
            <div className="wheel-segment segment-bronze font-kid">🥉 BRONZE</div>
            <div className="wheel-center-cap shadow-inner">⭐</div>
          </div>
        </div>

        <button
          onClick={handleSpinWheel}
          disabled={spinning}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-slate-950 font-black text-base shadow-lg shadow-amber-300 font-kid transition transform active:scale-95 mb-4"
        >
          {spinning ? 'Spinning the Wheel... 🎰' : '🎰 Spin the Reward Wheel!'}
        </button>

        {/* Or Select by Task Difficulty */}
        <div className="w-full pt-3 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Or Pick Star Tier Directly:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleAwardTier('bronze')}
              className="btn-difficulty-tier diff-bronze p-2.5 rounded-xl border border-orange-200 hover:bg-orange-50 transition flex flex-col items-center"
            >
              <span className="text-2xl">🥉</span>
              <span className="text-xs font-black">Bronze</span>
              <span className="text-[10px] text-slate-500">1 pt</span>
            </button>
            <button
              onClick={() => handleAwardTier('silver')}
              className="btn-difficulty-tier diff-silver p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition flex flex-col items-center"
            >
              <span className="text-2xl">🥈</span>
              <span className="text-xs font-black">Silver</span>
              <span className="text-[10px] text-slate-500">2 pts</span>
            </button>
            <button
              onClick={() => handleAwardTier('gold')}
              className="btn-difficulty-tier diff-gold p-2.5 rounded-xl border border-amber-200 hover:bg-amber-50 transition flex flex-col items-center"
            >
              <span className="text-2xl">🥇</span>
              <span className="text-xs font-black">Gold</span>
              <span className="text-[10px] text-slate-500">4 pts</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}


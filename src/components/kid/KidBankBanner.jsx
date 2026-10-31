import React from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';

export default function KidBankBanner() {
  const { data, calculatePoints } = useStarbook();
  const bank = data.bank || { gold: 0, silver: 0, bronze: 0 };
  const totalPoints = calculatePoints(bank);

  const handleJumpToPassbook = () => {
    soundController.playPop();
    const elem = document.getElementById('section-kid-passbook');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="kid-bank-card bg-white rounded-3xl p-5 md:p-6 shadow-xl border-4 border-amber-200/60 relative overflow-hidden">
      {/* Background decorative floating stars */}
      <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 pointer-events-none select-none anim-float-star star-1">⭐</div>
      <div className="absolute -left-4 -top-4 text-7xl opacity-5 pointer-events-none select-none anim-float-star star-2">🌟</div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-wider mb-2">
            <span>🏆</span> My Star Bank
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 font-kid">
            {data.settings.childName ? `${data.settings.childName}'s Star Rewards` : 'Your Approved Star Bank!'}
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Scan barcodes for chores to earn more stars!
          </p>
        </div>

        {/* Action & Points Badge */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
          <button
            onClick={handleJumpToPassbook}
            className="kid-banner-action-btn shadow-sm justify-center text-center py-2.5 px-4"
          >
            <span className="anim-wobble">📖</span> My Star Bank Book
          </button>
          
          <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-amber-200/50 anim-aura-pulse">
            <span className="text-2xl sm:text-3xl anim-bounce-gentle">✨</span>
            <div className="text-left">
              <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-amber-100">Total Points</div>
              <div className="text-2xl sm:text-3xl font-black leading-none font-kid">{totalPoints}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Star Counters (Gold, Silver, Bronze) */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mt-5 relative z-10">
        {/* Gold Star */}
        <div className="bank-star-pill gold">
          <div className="star-pill-icon anim-wobble">🥇</div>
          <div className="star-pill-info">
            <span className="star-pill-label">Gold</span>
            <span className="star-pill-val">{bank.gold || 0}</span>
            <span className="star-pill-pts">4 pts each</span>
          </div>
        </div>

        {/* Silver Star */}
        <div className="bank-star-pill silver">
          <div className="star-pill-icon anim-wobble">🥈</div>
          <div className="star-pill-info">
            <span className="star-pill-label">Silver</span>
            <span className="star-pill-val">{bank.silver || 0}</span>
            <span className="star-pill-pts">2 pts each</span>
          </div>
        </div>

        {/* Bronze Star */}
        <div className="bank-star-pill bronze">
          <div className="star-pill-icon anim-wobble">🥉</div>
          <div className="star-pill-info">
            <span className="star-pill-label">Bronze</span>
            <span className="star-pill-val">{bank.bronze || 0}</span>
            <span className="star-pill-pts">1 pt each</span>
          </div>
        </div>
      </div>
    </section>
  );
}


import React, { useState, useRef } from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { formatRelativeTime } from '../../utils/ledger';
import { soundController } from '../../utils/audio';

export default function KidPassbook() {
  const { data, openModal } = useStarbook();
  const [filter, setFilter] = useState('all');
  const ledger = data.ledger || [];
  const chipsTrackRef = useRef(null);

  // Calculate quick stats for kids
  let starsEarnedCount = 0;
  let treatsRedeemedCount = 0;
  let upgradesCount = 0;

  ledger.forEach(tx => {
    if (tx.type === 'CREDIT') {
      const g = (tx.delta && tx.delta.gold) || 0;
      const s = (tx.delta && tx.delta.silver) || 0;
      const b = (tx.delta && tx.delta.bronze) || 0;
      starsEarnedCount += (g + s + b);
    } else if (tx.type === 'DEBIT') {
      treatsRedeemedCount += 1;
    } else if (tx.type === 'TRANSFER' || tx.type === 'ADJUSTMENT') {
      upgradesCount += 1;
    }
  });

  const filtered = ledger.filter(tx => {
    if (filter === 'credits') return tx.type === 'CREDIT';
    if (filter === 'debits') return tx.type === 'DEBIT';
    if (filter === 'transfers') return tx.type === 'TRANSFER' || tx.type === 'ADJUSTMENT';
    return true;
  });

  const handleFilterClick = (newFilter, e) => {
    soundController.playPop();
    setFilter(newFilter);
    if (e && e.currentTarget && chipsTrackRef.current) {
      e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const handleEntryClick = (tx) => {
    soundController.playPop();
    openModal('kidReceipt', tx);
  };

  return (
    <section id="section-kid-passbook" className="kid-passbook-card relative overflow-hidden rounded-3xl p-5 md:p-7 shadow-xl border-4 border-amber-300/80">
      {/* Floating background animated sparkles/stars */}
      <div className="passbook-bg-stars pointer-events-none select-none">
        <span className="anim-float-star star-1">✨</span>
        <span className="anim-float-star star-2">⭐</span>
        <span className="anim-float-star star-3">🌟</span>
        <span className="anim-float-star star-4">💫</span>
      </div>

      {/* Passbook Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 flex items-center justify-center font-black text-2xl shadow-md border-2 border-amber-300 anim-bounce-gentle shrink-0">
            📖
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl md:text-2xl font-black text-slate-800 font-kid">
                {data.settings.childName || 'Alex'}'s Star Bank Book
              </h3>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 shadow-sm anim-pulse-glow">
                LIVE PASSBOOK
              </span>
            </div>
            <p className="text-xs font-semibold text-amber-900/80">
              Scroll through your official adventure records, stars earned, and treats unlocked! 📜
            </p>
          </div>
        </div>

        {/* Quick Stats Pills for Kids */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="passbook-mini-stat bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5">
            <span>⭐</span>
            <span>Earned:</span>
            <span className="text-emerald-700 font-black font-kid">+{starsEarnedCount}</span>
          </div>
          <div className="passbook-mini-stat bg-rose-50 border border-rose-200 text-rose-800 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5">
            <span>🍦</span>
            <span>Treats:</span>
            <span className="text-rose-700 font-black font-kid">{treatsRedeemedCount}</span>
          </div>
          <div className="passbook-mini-stat bg-purple-50 border border-purple-200 text-purple-800 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5">
            <span>🚀</span>
            <span>Upgrades:</span>
            <span className="text-purple-700 font-black font-kid">{upgradesCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Chips for Kid Transaction Book */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-amber-200/60 flex-wrap relative z-10">
        <div ref={chipsTrackRef} className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs no-scrollbar scroll-smooth">
          <button
            onClick={(e) => handleFilterClick('all', e)}
            className={`kid-passbook-filter-btn shrink-0 ${filter === 'all' ? 'active' : ''}`}
          >
            <span>🌟</span> All Activity
          </button>
          <button
            onClick={(e) => handleFilterClick('credits', e)}
            className={`kid-passbook-filter-btn shrink-0 ${filter === 'credits' ? 'active' : ''}`}
          >
            <span>⭐</span> Stars Won
          </button>
          <button
            onClick={(e) => handleFilterClick('debits', e)}
            className={`kid-passbook-filter-btn shrink-0 ${filter === 'debits' ? 'active' : ''}`}
          >
            <span>🍦</span> Treats Redeemed
          </button>
          <button
            onClick={(e) => handleFilterClick('transfers', e)}
            className={`kid-passbook-filter-btn shrink-0 ${filter === 'transfers' ? 'active' : ''}`}
          >
            <span>🚀</span> Level Ups & Changes
          </button>
        </div>

        {/* Total Entries & Scroll Hint */}
        <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800/80">
          <span className="anim-wobble">📜</span>
          <span>Showing {filtered.length} of {ledger.length} entries</span>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">(Scroll down 👇)</span>
        </div>
      </div>

      {/* Scrollable Transaction Stream */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 px-4">
          <div className="text-5xl mb-3 anim-bounce-gentle">⭐</div>
          <h4 className="font-kid text-lg font-black text-slate-700">
            Your Star Bank Book is Ready for Adventures!
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Scan your first chore barcode or pick a daily task above to earn your very first shiny star!
          </p>
          <button
            onClick={() => openModal('scan')}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs shadow-md transition transform hover:scale-105 font-kid"
          >
            🚀 Start My First Chore!
          </button>
        </div>
      ) : (
        <div className="kid-passbook-scrollable-container max-h-[460px] overflow-y-auto space-y-3 pr-1.5 relative z-10">
          {filtered.map((tx, idx) => {
            let typeBadgeClass = 'credit';
            let typeBadgeText = '⭐ Star Earned';
            let stampClass = 'stamp-approved';
            let stampText = '✓ APPROVED';
            let pointClass = 'text-emerald-600';

            if (tx.type === 'DEBIT') {
              typeBadgeClass = 'debit';
              typeBadgeText = '🍦 Treat Redeemed';
              stampClass = 'stamp-redeemed';
              stampText = '🎉 REDEEMED';
              pointClass = 'text-rose-600';
            } else if (tx.type === 'TRANSFER') {
              typeBadgeClass = 'transfer';
              typeBadgeText = '🚀 Level Up';
              stampClass = 'stamp-upgrade';
              stampText = '⚡ LEVEL UP';
              pointClass = 'text-purple-600';
            } else if (tx.type === 'ADJUSTMENT') {
              typeBadgeClass = 'transfer';
              typeBadgeText = '⚖️ Balance Update';
              stampClass = 'stamp-upgrade';
              stampText = '⚖️ ADJUSTED';
              pointClass = 'text-amber-600';
            }

            const deltas = [];
            if (tx.delta) {
              if (tx.delta.gold) deltas.push(`${tx.delta.gold > 0 ? '+' : ''}${tx.delta.gold} 🥇`);
              if (tx.delta.silver) deltas.push(`${tx.delta.silver > 0 ? '+' : ''}${tx.delta.silver} 🥈`);
              if (tx.delta.bronze) deltas.push(`${tx.delta.bronze > 0 ? '+' : ''}${tx.delta.bronze} 🥉`);
            }
            const deltaStr = deltas.length > 0 ? deltas.join(', ') : (tx.pointDelta > 0 ? `+${tx.pointDelta} pts` : `${tx.pointDelta} pts`);
            const pointSign = tx.pointDelta > 0 ? `+${tx.pointDelta}` : `${tx.pointDelta}`;
            const delay = Math.min(idx * 0.04, 0.45);

            return (
              <div
                key={tx.txId}
                onClick={() => handleEntryClick(tx)}
                className={`kid-passbook-item passbook-type-${tx.type.toLowerCase()}`}
                style={{ animationDelay: `${delay}s` }}
                title="Tap to view official certificate"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="kid-passbook-icon-wrapper">
                      <span className="kid-passbook-icon">{tx.icon || '⭐'}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`kid-passbook-badge ${typeBadgeClass}`}>{typeBadgeText}</span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                          {tx.barcode || 'N/A'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-bold">
                          {formatRelativeTime(tx.timestamp)}
                        </span>
                      </div>
                      <h4 className="font-black text-slate-800 text-base md:text-lg font-kid mt-1 leading-snug">
                        {tx.description}
                      </h4>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        {tx.notes || tx.action}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end shrink-0">
                    <div className={`kid-passbook-delta ${pointClass}`}>
                      {deltaStr}
                    </div>
                    <div className={`kid-passbook-pts ${pointClass}`}>
                      {pointSign} pts
                    </div>
                    <div className={`kid-passbook-stamp ${stampClass}`}>
                      {stampText}
                    </div>
                  </div>
                </div>

                <div className="kid-passbook-card-footer mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-600 bg-amber-50/70 px-2.5 py-1 rounded-xl border border-amber-200/60">
                    <span className="text-amber-600 font-black">🏦 Balance:</span>
                    <span>{tx.balanceAfter ? (tx.balanceAfter.gold || 0) : 0}🥇</span>
                    <span>{tx.balanceAfter ? (tx.balanceAfter.silver || 0) : 0}🥈</span>
                    <span>{tx.balanceAfter ? (tx.balanceAfter.bronze || 0) : 0}🥉</span>
                    <span className="text-amber-800 font-black">
                      ({tx.balanceAfter ? (tx.balanceAfter.points || 0) : 0} pts)
                    </span>
                  </div>
                  <button className="btn-view-receipt text-xs font-black text-amber-700 hover:text-amber-900 bg-amber-100/80 hover:bg-amber-200 px-2.5 py-1 rounded-xl flex items-center gap-1 transition transform active:scale-95">
                    <span>📜</span> <span>View Stamp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}


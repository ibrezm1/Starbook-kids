import React from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { formatDateTime } from '../../utils/ledger';
import { soundController } from '../../utils/audio';

export default function KidReceiptModal() {
  const { activeModal, modalPayload, closeModal, data } = useStarbook();

  const isOpen = activeModal === 'kidReceipt';
  if (!isOpen) return null;

  const tx = modalPayload || {};
  const deltas = [];
  if (tx.delta) {
    if (tx.delta.gold) deltas.push(`${tx.delta.gold > 0 ? '+' : ''}${tx.delta.gold} 🥇`);
    if (tx.delta.silver) deltas.push(`${tx.delta.silver > 0 ? '+' : ''}${tx.delta.silver} 🥈`);
    if (tx.delta.bronze) deltas.push(`${tx.delta.bronze > 0 ? '+' : ''}${tx.delta.bronze} 🥉`);
  }
  const deltaStr = deltas.length > 0 ? deltas.join(', ') : `${tx.pointDelta > 0 ? '+' : ''}${tx.pointDelta} pts`;
  const pointSign = tx.pointDelta > 0 ? `+${tx.pointDelta}` : `${tx.pointDelta}`;

  let stampClass = 'approved';
  let stampText = '✓ OFFICIAL CHORE APPROVED';
  let badgeMarkup = <span className="kid-passbook-badge credit">⭐ CHORE APPROVED BY PARENT</span>;

  if (tx.type === 'DEBIT') {
    stampClass = 'redeemed';
    stampText = '🎉 REWARD UNLOCKED';
    badgeMarkup = <span className="kid-passbook-badge debit">🍦 REWARD CASHED OUT</span>;
  } else if (tx.type === 'TRANSFER' || tx.type === 'ADJUSTMENT') {
    stampClass = 'upgrade';
    stampText = '⚡ STAR LEVEL UP';
    badgeMarkup = <span className="kid-passbook-badge transfer">🚀 LEVEL UP / BREAKDOWN</span>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-pop-in">
      <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-4 border-amber-400 p-6 sm:p-7 relative">
        
        {/* Close Button */}
        <button
          onClick={() => { soundController.playPop(); closeModal(); }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-lg flex items-center justify-center transition"
        >
          ✕
        </button>

        {/* Certificate Header Banner */}
        <div className="text-center pb-4 border-b-2 border-dashed border-amber-200">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-black tracking-wider uppercase mb-2 anim-pulse-glow">
            🌟 OFFICIAL STAR RECORD 🌟
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 font-kid">
            Star Bank Passbook Receipt
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Account: {data.settings?.accountNumber || `ACCT-7734-${(data.settings?.childName || 'ALEX').toUpperCase()}`}
          </p>
        </div>

        {/* Receipt Content */}
        <div className="py-4 text-center space-y-3.5">
          {/* Giant Animated Icon */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-5xl shadow-inner anim-bounce-gentle">
            {tx.icon || '⭐'}
          </div>

          <div>
            <div className="inline-block mb-1">{badgeMarkup}</div>
            <h4 className="text-xl font-black text-slate-800 font-kid">
              {tx.description}
            </h4>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Barcode: {tx.barcode || 'N/A'}
            </p>
          </div>

          {/* Receipt Details Box */}
          <div className="bg-white/90 rounded-2xl p-4 border border-amber-200/80 text-left space-y-2 text-xs shadow-sm">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500 font-bold">Transaction ID</span>
              <span className="font-mono font-bold text-slate-700">{tx.txId}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500 font-bold">Date & Time</span>
              <span className="font-bold text-slate-700">{formatDateTime(tx.timestamp)}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500 font-bold">Stars Earned / Spent</span>
              <span className={`font-extrabold text-sm ${tx.type === 'CREDIT' ? 'text-emerald-600' : (tx.type === 'DEBIT' ? 'text-rose-600' : 'text-purple-600')}`}>
                {deltaStr} ({pointSign} pts)
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 font-bold">Bank Balance After</span>
              <span className="font-extrabold text-amber-700">
                {tx.balanceAfter ? `${tx.balanceAfter.gold || 0}🥇 ${tx.balanceAfter.silver || 0}🥈 ${tx.balanceAfter.bronze || 0}🥉 (${tx.balanceAfter.points || 0} pts)` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Official Rubber Stamp */}
          <div className="pt-1">
            <div className={`kid-rubber-stamp ${stampClass}`}>
              {stampText}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => { soundController.playPop(); closeModal(); }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-black text-sm shadow-md font-kid transition transform active:scale-95"
        >
          ✨ Close & Back to Bank Book
        </button>

      </div>
    </div>
  );
}


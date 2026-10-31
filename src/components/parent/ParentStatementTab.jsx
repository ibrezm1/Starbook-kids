import React, { useState } from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { formatDateTime } from '../../utils/ledger';
import { soundController } from '../../utils/audio';

export default function ParentStatementTab() {
  const { data, calculatePoints } = useStarbook();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const ledger = data.ledger || [];
  const currentBank = data.bank || { gold: 0, silver: 0, bronze: 0 };
  const currentPoints = calculatePoints(currentBank);

  // Calculate lifetime earned & spent
  let totalEarnedPts = 0;
  let totalSpentPts = 0;
  ledger.forEach(tx => {
    if (tx.pointDelta > 0) totalEarnedPts += tx.pointDelta;
    if (tx.pointDelta < 0) totalSpentPts += Math.abs(tx.pointDelta);
  });

  const filtered = ledger.filter(tx => {
    if (filter === 'credits' && tx.type !== 'CREDIT') return false;
    if (filter === 'debits' && tx.type !== 'DEBIT') return false;
    if (filter === 'transfers' && tx.type !== 'TRANSFER' && tx.type !== 'ADJUSTMENT') return false;

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      const text = `${tx.txId} ${tx.description} ${tx.barcode} ${tx.action} ${tx.notes || ''}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });

  const handleFilterClick = (newFilter) => {
    soundController.playPop();
    setFilter(newFilter);
  };

  return (
    <div className="space-y-4">
      
      {/* Statement Account Summary Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <span className="text-xs font-extrabold tracking-wider text-amber-400 uppercase">
              Official Account Statement
            </span>
          </div>
          <h3 className="text-xl font-black font-kid mt-0.5">
            {data.settings.childName ? `${data.settings.childName}'s Star Savings` : "Child's Star Savings"}
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Account: {data.settings.accountNumber || 'ACCT-7734-ALEX'}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div>
            <div className="text-slate-400 text-[10px] uppercase">Lifetime Deposits</div>
            <div className="text-emerald-400 text-base font-black">+{totalEarnedPts} pts</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-slate-400 text-[10px] uppercase">Lifetime Withdrawals</div>
            <div className="text-rose-400 text-base font-black">-{totalSpentPts} pts</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-slate-400 text-[10px] uppercase">Current Balance</div>
            <div className="text-amber-400 text-base font-black">{currentPoints} pts</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => handleFilterClick('all')}
            className={`statement-filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All Activity
          </button>
          <button
            onClick={() => handleFilterClick('credits')}
            className={`statement-filter-btn ${filter === 'credits' ? 'active' : ''}`}
          >
            + Deposits
          </button>
          <button
            onClick={() => handleFilterClick('debits')}
            className={`statement-filter-btn ${filter === 'debits' ? 'active' : ''}`}
          >
            - Withdrawals
          </button>
          <button
            onClick={() => handleFilterClick('transfers')}
            className={`statement-filter-btn ${filter === 'transfers' ? 'active' : ''}`}
          >
            ⇄ Upgrades & Transfers
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transactions..."
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => window.print()}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition"
          >
            <span>🖨️</span> <span>Print</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Date / TX ID</th>
                <th className="px-4 py-3">Description & Barcode</th>
                <th className="px-4 py-3 text-center">Type</th>
                <th className="px-4 py-3 text-right">Stars & Points</th>
                <th className="px-4 py-3 text-right">Running Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">
                    No transactions match your search filter.
                  </td>
                </tr>
              ) : (
                filtered.map(tx => {
                  let typeBadge = null;
                  if (tx.type === 'CREDIT') {
                    typeBadge = <span className="tx-badge credit">+ DEPOSIT</span>;
                  } else if (tx.type === 'DEBIT') {
                    typeBadge = <span className="tx-badge debit">- WITHDRAWAL</span>;
                  } else if (tx.type === 'TRANSFER') {
                    typeBadge = <span className="tx-badge transfer">⇄ TRANSFER</span>;
                  } else {
                    typeBadge = <span className="tx-badge adjust">⚖️ ADJUSTMENT</span>;
                  }

                  const deltas = [];
                  if (tx.delta) {
                    if (tx.delta.gold) deltas.push(`${tx.delta.gold > 0 ? '+' : ''}${tx.delta.gold} 🥇`);
                    if (tx.delta.silver) deltas.push(`${tx.delta.silver > 0 ? '+' : ''}${tx.delta.silver} 🥈`);
                    if (tx.delta.bronze) deltas.push(`${tx.delta.bronze > 0 ? '+' : ''}${tx.delta.bronze} 🥉`);
                  }

                  const pointSign = tx.pointDelta > 0 ? `+${tx.pointDelta}` : `${tx.pointDelta}`;
                  const pointClass = tx.pointDelta > 0 ? 'text-emerald-600' : (tx.pointDelta < 0 ? 'text-rose-600' : 'text-slate-500');

                  return (
                    <tr key={tx.txId} className="statement-row hover:bg-slate-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                        <span className="font-bold text-slate-700 block">{formatDateTime(tx.timestamp)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{tx.txId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{tx.icon || '⭐'}</span>
                          <div>
                            <div className="font-black text-slate-800 text-sm">{tx.description}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600 font-bold">
                                {tx.barcode}
                              </span>
                              <span>{tx.notes || tx.action}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {typeBadge}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap font-bold">
                        <div className="text-slate-800 font-black">{deltas.join(', ') || 'N/A'}</div>
                        <div className={`text-[11px] ${pointClass}`}>{pointSign} pts</div>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap font-mono text-slate-700">
                        {tx.balanceAfter ? (
                          <>
                            <div className="font-bold">{tx.balanceAfter.gold || 0}🥇 {tx.balanceAfter.silver || 0}🥈 {tx.balanceAfter.bronze || 0}🥉</div>
                            <div className="text-[10px] text-slate-400">({tx.balanceAfter.points || 0} pts)</div>
                          </>
                        ) : 'N/A'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}


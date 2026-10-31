import React, { useState } from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { formatDateTime } from '../../utils/ledger';
import { soundController } from '../../utils/audio';

export default function ParentBankTab() {
  const { data, calculatePoints, cashOutReward, updateStartingBalances, openModal } = useStarbook();
  const bank = data.bank || { gold: 0, silver: 0, bronze: 0 };
  const totalPoints = calculatePoints(bank);
  const rewards = data.customRewards || [];
  const cashOutLog = data.cashOutLog || [];

  // Starting balance form state
  const [balanceForm, setBalanceForm] = useState({
    gold: bank.gold || 0,
    silver: bank.silver || 0,
    bronze: bank.bronze || 0
  });

  const handleBalanceSubmit = (e) => {
    e.preventDefault();
    updateStartingBalances(balanceForm);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Star Bank Account Summary */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
              Approved Star Bank
            </div>
            <h3 className="text-2xl font-black font-kid">
              {data.settings.childName ? `${data.settings.childName}'s Account` : "Child's Account"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Account: <span className="font-mono text-amber-200">{data.settings.accountNumber || 'ACCT-7734-ALEX'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-bold uppercase">Total Points</div>
              <div className="text-3xl font-black text-amber-400 font-kid">{totalPoints}</div>
            </div>
          </div>
        </div>

        {/* 3 Bank Stars Pills */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="text-center p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-2xl">🥇</span>
            <div className="text-lg font-black font-kid text-amber-400">{bank.gold || 0}</div>
            <div className="text-[11px] text-slate-400 font-bold">Gold Stars (4 pts)</div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-2xl">🥈</span>
            <div className="text-lg font-black font-kid text-slate-200">{bank.silver || 0}</div>
            <div className="text-[11px] text-slate-400 font-bold">Silver Stars (2 pts)</div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-2xl">🥉</span>
            <div className="text-lg font-black font-kid text-amber-600">{bank.bronze || 0}</div>
            <div className="text-[11px] text-slate-400 font-bold">Bronze Stars (1 pt)</div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { soundController.playPop(); openModal('customCashout'); }}
            className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black transition"
          >
            ➖ Custom Cash Out
          </button>
          <button
            onClick={() => { soundController.playPop(); openModal('manualStar'); }}
            className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            ➕ Gift Bonus Stars
          </button>
        </div>
      </div>

      {/* 2. Rewards Catalog */}
      <div>
        <div className="mb-3">
          <h4 className="font-extrabold text-slate-800 text-lg font-kid">Real-Life Rewards Catalog</h4>
          <p className="text-xs text-slate-500">
            Redeem rewards by deducting stars from your child's bank. All redemptions are logged in the ledger.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {rewards.map(reward => {
            const cost = reward.cost || {};
            const canAfford = (bank.gold || 0) >= (cost.gold || 0) &&
                              (bank.silver || 0) >= (cost.silver || 0) &&
                              (bank.bronze || 0) >= (cost.bronze || 0);

            const costParts = [];
            if (cost.gold) costParts.push(`${cost.gold} 🥇`);
            if (cost.silver) costParts.push(`${cost.silver} 🥈`);
            if (cost.bronze) costParts.push(`${cost.bronze} 🥉`);

            return (
              <div
                key={reward.id}
                className="reward-card bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-2xl">{reward.icon || '🎁'}</span>
                    <h5 className="font-extrabold text-slate-800 text-sm leading-snug">
                      {reward.name}
                    </h5>
                  </div>
                  <div className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg inline-block border border-amber-200/60 mb-3">
                    Cost: {costParts.join(', ') || 'Free'}
                  </div>
                </div>

                <button
                  onClick={() => cashOutReward(reward.id)}
                  disabled={!canAfford}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                    canAfford
                      ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 font-black shadow-sm'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Redeem Reward 🍦' : 'Need More Stars'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Starting & Current Balances Manager */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <h4 className="font-extrabold text-slate-800 text-base font-kid mb-1">
          Starting & Current Balances Manager
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Directly set or calibrate your child's star bank balances. Changes will be audited in the ledger.
        </p>

        <form onSubmit={handleBalanceSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Gold Stars</label>
            <input
              type="number"
              min="0"
              value={balanceForm.gold}
              onChange={(e) => setBalanceForm({ ...balanceForm, gold: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-center"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Silver Stars</label>
            <input
              type="number"
              min="0"
              value={balanceForm.silver}
              onChange={(e) => setBalanceForm({ ...balanceForm, silver: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-center"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Bronze Stars</label>
            <input
              type="number"
              min="0"
              value={balanceForm.bronze}
              onChange={(e) => setBalanceForm({ ...balanceForm, bronze: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-center"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
            >
              Update Balances ⚖️
            </button>
          </div>
        </form>
      </div>

      {/* 4. Cash-Out Log */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <h4 className="font-extrabold text-slate-800 text-base font-kid mb-1">
          Recent Reward Cash-Outs
        </h4>
        <p className="text-xs text-slate-500 mb-3">Audit history of treats and rewards redeemed.</p>

        {cashOutLog.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            No rewards cashed out yet!
          </div>
        ) : (
          <div className="space-y-2">
            {cashOutLog.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.rewardIcon || '🎁'}</span>
                  <div>
                    <div className="font-extrabold text-slate-800">{item.rewardName}</div>
                    <div className="text-slate-400 text-[10px]">{formatDateTime(item.timestamp)} • {item.note || 'Redeemed'}</div>
                  </div>
                </div>
                <div className="font-black text-rose-600">
                  -{item.pointCost || 0} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}


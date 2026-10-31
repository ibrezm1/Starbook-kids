import React, { useState } from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { formatDateTime } from '../../utils/ledger';
import { soundController } from '../../utils/audio';

const QUICK_EMOJIS = ['🎁', '🍦', '🎮', '🎬', '🌙', '🛝', '🍕', '🎳', '🎨', '🚲', '🧸', '🧁', '🏖️', '🍩', '⛺'];

export default function ParentBankTab() {
  const {
    data,
    calculatePoints,
    cashOutReward,
    updateStartingBalances,
    openModal,
    addReward,
    updateReward,
    deleteReward,
    resetRewards,
    showToast
  } = useStarbook();

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

  // Reward editor state
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [editingRewardId, setEditingRewardId] = useState(null);
  const [rewardForm, setRewardForm] = useState({
    name: '',
    icon: '🎁',
    gold: 1,
    silver: 0,
    bronze: 0
  });

  const handleBalanceSubmit = (e) => {
    e.preventDefault();
    updateStartingBalances(balanceForm);
  };

  const handleOpenAddReward = () => {
    soundController.playPop();
    setEditingRewardId(null);
    setRewardForm({
      name: '',
      icon: '🎁',
      gold: 1,
      silver: 0,
      bronze: 0
    });
    setRewardModalOpen(true);
  };

  const handleOpenEditReward = (reward) => {
    soundController.playPop();
    setEditingRewardId(reward.id);
    setRewardForm({
      name: reward.name,
      icon: reward.icon || '🎁',
      gold: reward.cost?.gold || 0,
      silver: reward.cost?.silver || 0,
      bronze: reward.cost?.bronze || 0
    });
    setRewardModalOpen(true);
  };

  const handleSaveReward = (e) => {
    e.preventDefault();
    if (!rewardForm.name.trim()) {
      showToast('Please enter a name for the reward!', 'error');
      return;
    }

    const g = Math.max(0, parseInt(rewardForm.gold || 0, 10));
    const s = Math.max(0, parseInt(rewardForm.silver || 0, 10));
    const b = Math.max(0, parseInt(rewardForm.bronze || 0, 10));

    if (g === 0 && s === 0 && b === 0) {
      showToast('Reward cost must be at least 1 star!', 'error');
      return;
    }

    if (editingRewardId) {
      updateReward(editingRewardId, {
        name: rewardForm.name,
        icon: rewardForm.icon,
        cost: { gold: g, silver: s, bronze: b }
      });
    } else {
      addReward({
        name: rewardForm.name,
        icon: rewardForm.icon,
        cost: { gold: g, silver: s, bronze: b }
      });
    }
    setRewardModalOpen(false);
  };

  const handleDeleteReward = (rewardId, name) => {
    if (confirm(`Remove "${name}" from the rewards catalog?`)) {
      deleteReward(rewardId);
    }
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h4 className="font-extrabold text-slate-800 text-lg font-kid">Real-Life Rewards Catalog</h4>
            <p className="text-xs text-slate-500">
              Customize treats and rewards your child can redeem with their stars.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddReward}
              className="text-xs font-black px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-sm transition flex items-center gap-1.5"
            >
              <span>➕</span> Add Reward
            </button>
            <button
              onClick={() => {
                if (confirm('Reset reward catalog back to default presets?')) {
                  resetRewards();
                }
              }}
              className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Reset default rewards"
            >
              🔄 Reset
            </button>
          </div>
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

            const pts = (cost.gold || 0) * 4 + (cost.silver || 0) * 2 + (cost.bronze || 0);

            return (
              <div
                key={reward.id}
                className="reward-card bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-amber-300 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{reward.icon || '🎁'}</span>
                      <div>
                        <h5 className="font-extrabold text-slate-800 text-sm leading-snug">
                          {reward.name}
                        </h5>
                        <div className="text-[11px] font-bold text-amber-700 mt-0.5">
                          {costParts.join(', ') || 'Free'} <span className="text-slate-400 font-normal">({pts} pts)</span>
                        </div>
                      </div>
                    </div>

                    {/* Edit & Delete Buttons for Parents */}
                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEditReward(reward)}
                        className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-600 hover:text-amber-900 text-xs transition"
                        title="Edit reward"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteReward(reward.id, reward.name)}
                        className="p-1.5 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 text-xs transition"
                        title="Delete reward"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => cashOutReward(reward.id)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 font-black shadow-sm'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>{canAfford ? 'Redeem Treat 🍦' : 'Need More Stars'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reward Edit/Add Modal Dialog */}
      {rewardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-pop-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{rewardForm.icon || '🎁'}</span>
                <h3 className="font-black text-slate-800 text-lg font-kid">
                  {editingRewardId ? 'Edit Reward' : 'Add New Reward'}
                </h3>
              </div>
              <button
                onClick={() => setRewardModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReward} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reward / Treat Name
                </label>
                <input
                  type="text"
                  value={rewardForm.name}
                  onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })}
                  placeholder="e.g. Pizza Night, 30m Screen Time, Lego Set"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Choose Icon / Emoji
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={rewardForm.icon}
                    onChange={(e) => setRewardForm({ ...rewardForm, icon: e.target.value })}
                    className="w-14 text-center text-2xl py-1 rounded-xl border border-slate-300"
                  />
                  <span className="text-[11px] text-slate-400">Tap below or type any emoji</span>
                </div>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 max-h-24 overflow-y-auto">
                  {QUICK_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setRewardForm({ ...rewardForm, icon: emoji })}
                      className={`text-xl p-1.5 rounded-lg hover:bg-amber-100 transition ${
                        rewardForm.icon === emoji ? 'bg-amber-200 ring-2 ring-amber-400' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cost in Stars
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80 text-center">
                    <span className="text-lg">🥇</span>
                    <div className="text-[10px] font-bold text-amber-900 mb-1">Gold (4 pts)</div>
                    <input
                      type="number"
                      min="0"
                      value={rewardForm.gold}
                      onChange={(e) => setRewardForm({ ...rewardForm, gold: e.target.value })}
                      className="w-full text-center font-black rounded-lg border border-amber-300 py-1 text-sm bg-white"
                    />
                  </div>
                  <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-lg">🥈</span>
                    <div className="text-[10px] font-bold text-slate-700 mb-1">Silver (2 pts)</div>
                    <input
                      type="number"
                      min="0"
                      value={rewardForm.silver}
                      onChange={(e) => setRewardForm({ ...rewardForm, silver: e.target.value })}
                      className="w-full text-center font-black rounded-lg border border-slate-300 py-1 text-sm bg-white"
                    />
                  </div>
                  <div className="bg-orange-50/70 p-2.5 rounded-xl border border-orange-200 text-center">
                    <span className="text-lg">🥉</span>
                    <div className="text-[10px] font-bold text-orange-900 mb-1">Bronze (1 pt)</div>
                    <input
                      type="number"
                      min="0"
                      value={rewardForm.bronze}
                      onChange={(e) => setRewardForm({ ...rewardForm, bronze: e.target.value })}
                      className="w-full text-center font-black rounded-lg border border-orange-300 py-1 text-sm bg-white"
                    />
                  </div>
                </div>
                <div className="text-right text-[11px] font-bold text-amber-700 mt-1.5">
                  Total points cost: {(parseInt(rewardForm.gold || 0, 10) * 4) + (parseInt(rewardForm.silver || 0, 10) * 2) + parseInt(rewardForm.bronze || 0, 10)} pts
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRewardModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-sm transition"
                >
                  {editingRewardId ? 'Save Changes ✨' : 'Add Reward 🎁'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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


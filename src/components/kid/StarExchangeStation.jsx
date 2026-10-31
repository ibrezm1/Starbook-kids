import React from 'react';
import { useStarbook } from '../../hooks/useStarbook';

export default function StarExchangeStation() {
  const { data, exchangeStars } = useStarbook();
  const bank = data.bank || { gold: 0, silver: 0, bronze: 0 };

  const canUpgradeBronze = (bank.bronze || 0) >= 2;
  const canUpgradeSilver = (bank.silver || 0) >= 2;
  const canBreakGold = (bank.gold || 0) >= 1;
  const canBreakSilver = (bank.silver || 0) >= 1;

  return (
    <section className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-50 rounded-3xl p-5 md:p-6 border-2 border-amber-300/80 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-lg shadow-sm">
            ✨
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black text-slate-800 font-kid">
              Star Upgrade & Exchange Station
            </h3>
            <p className="text-xs font-semibold text-amber-900/80">
              Turn your Bronze stars into Silver, and Silver into Gold!
            </p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-amber-800 bg-white/80 px-3 py-1 rounded-full border border-amber-300">
          Level Up Stars 🚀
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Trade 2 Bronze -> 1 Silver */}
        <div className={`exchange-card ${canUpgradeBronze ? 'ready' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-black text-xl">
              <span>🥉🥉</span>
              <span className="text-slate-400 font-sans mx-1 anim-arrow-shift">➔</span>
              <span>🥈</span>
            </div>
            <div>
              <div className="font-extrabold text-slate-800 text-sm">2 Bronze ➔ 1 Silver Star</div>
              <div className="text-xs">
                {canUpgradeBronze ? (
                  <span className="text-emerald-600 font-bold">Ready! You have {bank.bronze} Bronze stars.</span>
                ) : (
                  <span className="text-slate-500">Have {bank.bronze || 0}/2 Bronze ({2 - (bank.bronze || 0)} more needed)</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => exchangeStars('bronze-to-silver')}
            disabled={!canUpgradeBronze}
            className={`btn-exchange ${canUpgradeBronze ? 'ready' : 'disabled'}`}
          >
            {canUpgradeBronze ? 'Trade for Silver 🥈 (+1)' : 'Need 2 Bronze'}
          </button>
        </div>

        {/* Trade 2 Silver -> 1 Gold */}
        <div className={`exchange-card ${canUpgradeSilver ? 'ready' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-black text-xl">
              <span>🥈🥈</span>
              <span className="text-slate-400 font-sans mx-1 anim-arrow-shift">➔</span>
              <span>🥇</span>
            </div>
            <div>
              <div className="font-extrabold text-slate-800 text-sm">2 Silver ➔ 1 Gold Star</div>
              <div className="text-xs">
                {canUpgradeSilver ? (
                  <span className="text-emerald-600 font-bold">Ready! You have {bank.silver} Silver stars.</span>
                ) : (
                  <span className="text-slate-500">Have {bank.silver || 0}/2 Silver ({2 - (bank.silver || 0)} more needed)</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => exchangeStars('silver-to-gold')}
            disabled={!canUpgradeSilver}
            className={`btn-exchange ${canUpgradeSilver ? 'ready' : 'disabled'}`}
          >
            {canUpgradeSilver ? 'Trade for Gold 🥇 (+1)' : 'Need 2 Silver'}
          </button>
        </div>
      </div>

      {/* Currency Breakdown (Change Making) Row */}
      <div className="mt-4 pt-3.5 border-t border-amber-200/70">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-base">🔄</span>
          <span className="text-xs font-black uppercase tracking-wider text-amber-900/80">
            Make Change / Break Down Stars
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Break 1 Gold -> 2 Silver */}
          <div className={`exchange-card ${canBreakGold ? 'ready' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 font-black text-xl">
                <span>🥇</span>
                <span className="text-slate-400 font-sans mx-1 anim-arrow-shift">➔</span>
                <span>🥈🥈</span>
              </div>
              <div>
                <div className="font-extrabold text-slate-800 text-sm">Break 1 Gold ➔ 2 Silver</div>
                <div className="text-xs">
                  {canBreakGold ? (
                    <span className="text-emerald-600 font-bold">Ready! You have {bank.gold} Gold.</span>
                  ) : (
                    <span className="text-slate-500">Need 1 Gold star to break</span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => exchangeStars('gold-to-silver')}
              disabled={!canBreakGold}
              className={`btn-exchange ${canBreakGold ? 'ready' : 'disabled'}`}
            >
              {canBreakGold ? 'Break to 2 Silver 🥈' : 'Need 1 Gold'}
            </button>
          </div>

          {/* Break 1 Silver -> 2 Bronze */}
          <div className={`exchange-card ${canBreakSilver ? 'ready' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 font-black text-xl">
                <span>🥈</span>
                <span className="text-slate-400 font-sans mx-1 anim-arrow-shift">➔</span>
                <span>🥉🥉</span>
              </div>
              <div>
                <div className="font-extrabold text-slate-800 text-sm">Break 1 Silver ➔ 2 Bronze</div>
                <div className="text-xs">
                  {canBreakSilver ? (
                    <span className="text-emerald-600 font-bold">Ready! You have {bank.silver} Silver.</span>
                  ) : (
                    <span className="text-slate-500">Need 1 Silver star to break</span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => exchangeStars('silver-to-bronze')}
              disabled={!canBreakSilver}
              className={`btn-exchange ${canBreakSilver ? 'ready' : 'disabled'}`}
            >
              {canBreakSilver ? 'Break to 2 Bronze 🥉' : 'Need 1 Silver'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


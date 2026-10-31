import React from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';

export default function TierStarterCards() {
  const { startChore, openModal } = useStarbook();

  const handleQuickChip = (tier, reason, icon, code) => {
    soundController.playPop();
    startChore(tier, reason, icon, code);
  };

  const handleCustomChore = (tier) => {
    soundController.playPop();
    openModal('reason', { forcedTier: tier });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-800 font-kid flex items-center gap-2">
            <span>⭐</span> Start Earning by Star Tier
          </h3>
          <p className="text-xs font-semibold text-slate-500">
            Pick a Bronze, Silver, or Gold chore to start earning right now!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 1. BRONZE STAR TIER CARD */}
        <div className="tier-starter-card bronze">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="tier-badge-pill bronze">
                <span>🥉</span> BRONZE STAR
              </span>
              <span className="text-xs font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                1 Point
              </span>
            </div>
            <h4 className="font-black text-slate-800 text-lg font-kid">Quick Habits (5 Mins)</h4>
            <p className="text-xs text-slate-500 mb-3">Easy daily wins that keep you on track!</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <button
                onClick={() => handleQuickChip('bronze', 'Brushed My Teeth', '🪥', 'CHORE-TEETH-03')}
                className="tier-quick-chip"
              >
                <span>🪥</span> Brushed Teeth
              </button>
              <button
                onClick={() => handleQuickChip('bronze', 'Made My Bed', '🛏️', 'CHORE-BED-10')}
                className="tier-quick-chip"
              >
                <span>🛏️</span> Made Bed
              </button>
              <button
                onClick={() => handleQuickChip('bronze', 'Put Toys Away', '🧸', 'ITEM-TOY-09')}
                className="tier-quick-chip"
              >
                <span>🧸</span> Put Toys Away
              </button>
              <button
                onClick={() => handleQuickChip('bronze', 'Put Shoes by Door', '👟', 'CHORE-SHOES-11')}
                className="tier-quick-chip"
              >
                <span>👟</span> Shoes Away
              </button>
              <button
                onClick={() => handleQuickChip('bronze', 'Drank Water / Healthy Snack', '💧', 'CHORE-WATER-12')}
                className="tier-quick-chip"
              >
                <span>💧</span> Drank Water
              </button>
            </div>
          </div>

          <button
            onClick={() => handleCustomChore('bronze')}
            className="btn-start-tier-action bronze"
          >
            <span>🥉</span>
            <span>Start Bronze Chore</span>
          </button>
        </div>

        {/* 2. SILVER STAR TIER CARD */}
        <div className="tier-starter-card silver">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="tier-badge-pill silver">
                <span>🥈</span> SILVER STAR
              </span>
              <span className="text-xs font-extrabold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full">
                2 Points
              </span>
            </div>
            <h4 className="font-black text-slate-800 text-lg font-kid">Daily Milestones</h4>
            <p className="text-xs text-slate-500 mb-3">Great effort tasks that show responsibility!</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <button
                onClick={() => handleQuickChip('silver', 'Finished Homework', '📚', 'CHORE-HOMEWORK-02')}
                className="tier-quick-chip"
              >
                <span>📚</span> Homework Done
              </button>
              <button
                onClick={() => handleQuickChip('silver', 'Read for 20 Minutes', '📖', 'ITEM-BOOK-07')}
                className="tier-quick-chip"
              >
                <span>📖</span> Read 20 Mins
              </button>
              <button
                onClick={() => handleQuickChip('silver', 'Ate All My Veggies', '🥦', 'CHORE-VEGGIES-06')}
                className="tier-quick-chip"
              >
                <span>🥦</span> Ate Veggies
              </button>
              <button
                onClick={() => handleQuickChip('silver', 'Fed / Walked Pet', '🐕', 'CHORE-PET-05')}
                className="tier-quick-chip"
              >
                <span>🐕</span> Pet Care
              </button>
              <button
                onClick={() => handleQuickChip('silver', 'Practiced Instrument', '🎵', 'CHORE-MUSIC-13')}
                className="tier-quick-chip"
              >
                <span>🎵</span> Music Practice
              </button>
            </div>
          </div>

          <button
            onClick={() => handleCustomChore('silver')}
            className="btn-start-tier-action silver"
          >
            <span>🥈</span>
            <span>Start Silver Chore</span>
          </button>
        </div>

        {/* 3. GOLD STAR TIER CARD */}
        <div className="tier-starter-card gold">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="tier-badge-pill gold">
                <span>🥇</span> GOLD STAR
              </span>
              <span className="text-xs font-extrabold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                4 Points
              </span>
            </div>
            <h4 className="font-black text-slate-800 text-lg font-kid">Super Star Big Jobs!</h4>
            <p className="text-xs text-slate-500 mb-3">Big chores & extraordinary helpful acts!</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <button
                onClick={() => handleQuickChip('gold', 'Cleaned Entire Bedroom', '🧹', 'CHORE-ROOM-01')}
                className="tier-quick-chip"
              >
                <span>🧹</span> Deep Clean Room
              </button>
              <button
                onClick={() => handleQuickChip('gold', 'Helped Family Member', '🤝', 'CHORE-HELP-08')}
                className="tier-quick-chip"
              >
                <span>🤝</span> Kind Helper
              </button>
              <button
                onClick={() => handleQuickChip('gold', 'Washed / Loaded Dishes', '🧽', 'CHORE-DISHES-14')}
                className="tier-quick-chip"
              >
                <span>🧽</span> Kitchen Dishes
              </button>
              <button
                onClick={() => handleQuickChip('gold', 'Folded & Put Laundry Away', '🧺', 'CHORE-LAUNDRY-15')}
                className="tier-quick-chip"
              >
                <span>🧺</span> Fold Laundry
              </button>
            </div>
          </div>

          <button
            onClick={() => handleCustomChore('gold')}
            className="btn-start-tier-action gold"
          >
            <span>🥇</span>
            <span>Start Gold Chore</span>
          </button>
        </div>

      </div>
    </section>
  );
}


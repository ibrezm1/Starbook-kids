import React from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';
import { CHORE_BARCODES } from '../../utils/constants';

export default function QuickBarcodesShelf() {
  const { data, openModal, injectDebugBarcode } = useStarbook();
  const chores = data.customChores && data.customChores.length > 0 ? data.customChores : CHORE_BARCODES;

  const handleSimScan = (code) => {
    soundController.playScanBeep();
    injectDebugBarcode(code, 'pending');
  };

  const handleMysteryScan = () => {
    soundController.playScanBeep();
    injectDebugBarcode('MYSTERY-SCAN-99', 'pending');
  };

  // Display up to 6 quick simulator cards
  const displayChores = chores.slice(0, 6);

  return (
    <section className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-3xl p-5 md:p-6 border border-sky-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h3 className="text-lg font-bold text-slate-800 font-kid">Quick Barcode Simulator</h3>
          </div>
          <p className="text-xs text-slate-500">
            No camera? Tap any physical item below to simulate a real scan!
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { soundController.playPop(); openModal('barcodeBinder'); }}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-sm transition flex items-center gap-1.5"
          >
            <span>📚</span> Barcode Binder ({chores.length})
          </button>
          <button
            onClick={handleMysteryScan}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition flex items-center gap-1"
          >
            🎲 Mystery Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {displayChores.map(chore => {
          const tier = chore.tier || 'bronze';
          return (
            <button
              key={chore.code}
              onClick={() => handleSimScan(chore.code)}
              className="btn-sim-scan quick-sim-card relative overflow-hidden group"
              title={`Simulate scanning ${chore.title || chore.name}`}
            >
              <span className={`absolute top-1.5 right-1.5 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                tier === 'gold' ? 'bg-amber-100 text-amber-800' : (tier === 'silver' ? 'bg-slate-200 text-slate-800' : 'bg-orange-100 text-orange-800')
              }`}>
                {tier[0]}
              </span>
              <span className="text-2xl transform group-hover:scale-110 transition">{chore.icon || '⭐'}</span>
              <span className="font-bold text-xs text-slate-800 truncate max-w-full">
                {chore.title || chore.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono truncate max-w-full">
                {chore.code}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

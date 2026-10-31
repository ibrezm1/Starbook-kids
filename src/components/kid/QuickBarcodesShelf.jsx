import React from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';

export default function QuickBarcodesShelf() {
  const { openModal, injectDebugBarcode } = useStarbook();

  const handleSimScan = (code) => {
    soundController.playScanBeep();
    injectDebugBarcode(code, 'pending');
  };

  const handleMysteryScan = () => {
    soundController.playScanBeep();
    injectDebugBarcode('MYSTERY-SCAN-99', 'pending');
  };

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
        <div className="flex items-center gap-2">
          <button
            onClick={() => { soundController.playPop(); openModal('barcodeBinder'); }}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-sm transition flex items-center gap-1.5"
          >
            <span>📚</span> Chore Barcode Binder
          </button>
          <button
            onClick={handleMysteryScan}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition flex items-center gap-1"
          >
            🎲 Mystery Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <button
          onClick={() => handleSimScan('CHORE-ROOM-01')}
          className="btn-sim-scan quick-sim-card"
        >
          <span className="text-2xl">🧹</span>
          <span className="font-bold text-xs text-slate-800">Cleaned Room</span>
          <span className="text-[10px] text-slate-400 font-mono">CHORE-ROOM-01</span>
        </button>

        <button
          onClick={() => handleSimScan('CHORE-HOMEWORK-02')}
          className="btn-sim-scan quick-sim-card"
        >
          <span className="text-2xl">📚</span>
          <span className="font-bold text-xs text-slate-800">Math Homework</span>
          <span className="text-[10px] text-slate-400 font-mono">CHORE-HW-02</span>
        </button>

        <button
          onClick={() => handleSimScan('CHORE-TEETH-03')}
          className="btn-sim-scan quick-sim-card"
        >
          <span className="text-2xl">🪥</span>
          <span className="font-bold text-xs text-slate-800">Brushed Teeth</span>
          <span className="text-[10px] text-slate-400 font-mono">CHORE-TEETH-03</span>
        </button>

        <button
          onClick={() => handleSimScan('ITEM-CEREAL-04')}
          className="btn-sim-scan quick-sim-card"
        >
          <span className="text-2xl">🥣</span>
          <span className="font-bold text-xs text-slate-800">Cereal Box</span>
          <span className="text-[10px] text-slate-400 font-mono">ITEM-CEREAL-04</span>
        </button>

        <button
          onClick={() => handleSimScan('CHORE-VEGGIES-06')}
          className="btn-sim-scan quick-sim-card"
        >
          <span className="text-2xl">🥦</span>
          <span className="font-bold text-xs text-slate-800">Ate All Veggies</span>
          <span className="text-[10px] text-slate-400 font-mono">CHORE-VEG-06</span>
        </button>
      </div>
    </section>
  );
}


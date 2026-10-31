import React from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { CHORE_BARCODES } from '../../utils/constants';
import { barcodeGenerator } from '../../utils/barcode';
import { soundController } from '../../utils/audio';

export default function BarcodeBinderModal() {
  const { activeModal, closeModal, injectDebugBarcode } = useStarbook();

  const isOpen = activeModal === 'barcodeBinder';
  if (!isOpen) return null;

  const handleTestScan = (code) => {
    soundController.playScanBeep();
    closeModal();
    injectDebugBarcode(code, 'pending');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-pop-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-4 border-amber-300 flex flex-col">
        
        {/* Binder Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <div>
              <h3 className="font-black text-xl font-kid">Chore Barcode Binder</h3>
              <p className="text-xs text-amber-100 font-medium">Scannable barcode cards for Bronze, Silver, & Gold chores!</p>
            </div>
          </div>
          <button
            onClick={() => { soundController.playPop(); closeModal(); }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Binder Cards Container */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {CHORE_BARCODES.map(card => {
              const svgMarkup = barcodeGenerator.generateSVG(card.code, { width: 220, height: 65 });

              return (
                <div key={card.code} className={`binder-card tier-${card.tier} bg-white p-3.5 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col justify-between`}>
                  <div>
                    <div className="binder-card-header flex items-start gap-2.5">
                      <span className="text-3xl">{card.icon}</span>
                      <div className="flex-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          card.tier === 'gold' ? 'bg-amber-100 text-amber-800' : (card.tier === 'silver' ? 'bg-slate-200 text-slate-800' : 'bg-orange-100 text-orange-800')
                        }`}>
                          {card.tier} ({card.points} pt{card.points > 1 ? 's' : ''})
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-sm mt-1 leading-snug">{card.title}</h4>
                        <p className="text-[11px] text-slate-500">{card.desc}</p>
                      </div>
                    </div>

                    <div
                      className="binder-barcode-svg my-2.5 bg-white p-1 rounded-lg border border-slate-100 flex justify-center"
                      dangerouslySetInnerHTML={{ __html: svgMarkup }}
                    />
                  </div>

                  <div className="binder-card-footer flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                    <span className="font-mono text-slate-400 text-[10px]">{card.code}</span>
                    <button
                      onClick={() => handleTestScan(card.code)}
                      className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 transition"
                    >
                      ⚡ Quick Tap Scan
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Point your camera at any barcode, or tap "Quick Tap Scan" to test!</span>
          <button
            onClick={() => { soundController.playPop(); closeModal(); }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
          >
            Close Binder
          </button>
        </div>

      </div>
    </div>
  );
}


import React from 'react';
import { CHORE_BARCODES } from '../../utils/constants';
import { barcodeGenerator } from '../../utils/barcode';
import { useStarbook } from '../../hooks/useStarbook';

export default function ParentTokensTab() {
  const { injectDebugBarcode } = useStarbook();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-800 font-kid">Printable Chore Tokens</h3>
          <p className="text-xs text-slate-500">
            Print and cut out physical barcode badges for the fridge, bedroom doors, and chore boards!
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <span>🖨️</span> Print All Chore Tokens
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {CHORE_BARCODES.map(card => {
          const svgMarkup = barcodeGenerator.generateSVG(card.code, { width: 220, height: 65 });

          return (
            <div key={card.code} className="printable-chore-token bg-white border-2 border-dashed border-slate-300 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="token-header flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{card.icon}</span>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{card.title}</h4>
                      <p className="text-[11px] text-slate-500">{card.desc}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                    card.tier === 'gold' ? 'bg-amber-100 text-amber-800' : (card.tier === 'silver' ? 'bg-slate-200 text-slate-800' : 'bg-orange-100 text-orange-800')
                  }`}>
                    {card.tier} ({card.points} pt{card.points > 1 ? 's' : ''})
                  </span>
                </div>

                <div
                  className="token-barcode-box my-3 bg-white p-1 rounded-lg border border-slate-100 flex justify-center"
                  dangerouslySetInnerHTML={{ __html: svgMarkup }}
                />
              </div>

              <div className="token-footer flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                <span className="font-mono">{card.code}</span>
                <button
                  onClick={() => injectDebugBarcode(card.code, 'pending')}
                  className="btn-test-scan-token text-indigo-600 hover:text-indigo-800 font-bold transition"
                >
                  ⚡ Test Scan
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


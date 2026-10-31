import React, { useState } from 'react';
import { CHORE_BARCODES } from '../../utils/constants';
import { barcodeGenerator } from '../../utils/barcode';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';

const CHORE_EMOJIS = ['🧹', '📚', '🪥', '🛏️', '🧸', '👟', '💧', '🧼', '🥦', '🐕', '🎵', '🍽️', '🧺', '🍂', '🪴', '🚲', '🎹', '🎨', '🎒', '🐱'];

export default function ParentTokensTab() {
  const {
    data,
    injectDebugBarcode,
    addChoreBarcode,
    updateChoreBarcode,
    deleteChoreBarcode,
    resetChoreBarcodes,
    showToast
  } = useStarbook();

  const chores = data.customChores || CHORE_BARCODES;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState(null); // null for new, string for edit
  const [choreForm, setChoreForm] = useState({
    title: '',
    code: '',
    tier: 'bronze',
    icon: '🧹',
    desc: ''
  });

  const handleOpenAdd = () => {
    soundController.playPop();
    setEditingCode(null);
    setChoreForm({
      title: '',
      code: '',
      tier: 'bronze',
      icon: '🧹',
      desc: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (chore) => {
    soundController.playPop();
    setEditingCode(chore.code);
    setChoreForm({
      title: chore.title || chore.name,
      code: chore.code,
      tier: chore.tier || 'bronze',
      icon: chore.icon || '🧹',
      desc: chore.desc || chore.reason || ''
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!choreForm.title.trim()) {
      showToast('Please enter a chore title!', 'error');
      return;
    }

    const cleanCode = (choreForm.code || `${choreForm.tier.toUpperCase()}-${choreForm.title.slice(0, 4).toUpperCase()}-${Math.floor(Math.random() * 90 + 10)}`)
      .toUpperCase()
      .replace(/[^A-Z0-9\-\.\$\/\+\%\*]/g, '-');

    if (editingCode) {
      updateChoreBarcode(editingCode, {
        title: choreForm.title,
        icon: choreForm.icon,
        tier: choreForm.tier,
        desc: choreForm.desc,
        reason: choreForm.title
      });
    } else {
      addChoreBarcode({
        code: cleanCode,
        title: choreForm.title,
        icon: choreForm.icon,
        tier: choreForm.tier,
        desc: choreForm.desc,
        reason: choreForm.title
      });
    }

    setModalOpen(false);
  };

  const handleDelete = (code, title) => {
    if (confirm(`Remove chore token "${title}" (${code})?`)) {
      deleteChoreBarcode(code);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Tab Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-800 font-kid">Printable Chore Tokens & Simulator</h3>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {chores.length} Chores
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Customize barcode chores for your home. Print them for the fridge or test-scan them instantly!
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenAdd}
            className="text-xs font-black px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-sm transition flex items-center gap-1.5"
          >
            <span>➕</span> Add Chore Barcode
          </button>
          <button
            onClick={() => {
              if (confirm('Reset all chore barcodes to default system presets?')) {
                resetChoreBarcodes();
              }
            }}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Reset defaults"
          >
            🔄 Reset
          </button>
          <button
            onClick={() => window.print()}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center gap-1.5 transition"
          >
            <span>🖨️</span> Print Cards
          </button>
        </div>
      </div>

      {/* Chore Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {chores.map(card => {
          const svgMarkup = barcodeGenerator.generateSVG(card.code, { width: 220, height: 65 });
          const tier = card.tier || 'bronze';
          const points = (data.settings?.starValues || { gold: 4, silver: 2, bronze: 1 })[tier] || 1;

          return (
            <div
              key={card.code}
              className="printable-chore-token bg-white border-2 border-dashed border-slate-300 rounded-2xl p-4 shadow-sm flex flex-col justify-between group hover:border-amber-400 transition"
            >
              <div>
                <div className="token-header flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{card.icon}</span>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{card.title || card.name}</h4>
                      <p className="text-[11px] text-slate-500">{card.desc || card.reason}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      tier === 'gold' ? 'bg-amber-100 text-amber-800' : (tier === 'silver' ? 'bg-slate-200 text-slate-800' : 'bg-orange-100 text-orange-800')
                    }`}>
                      {tier} ({points} pt{points > 1 ? 's' : ''})
                    </span>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEdit(card)}
                        className="p-1 rounded hover:bg-amber-100 text-slate-500 hover:text-amber-900 text-xs transition"
                        title="Edit chore"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(card.code, card.title || card.name)}
                        className="p-1 rounded hover:bg-rose-100 text-slate-400 hover:text-rose-600 text-xs transition"
                        title="Delete chore"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className="token-barcode-box my-3 bg-white p-1 rounded-lg border border-slate-100 flex justify-center"
                  dangerouslySetInnerHTML={{ __html: svgMarkup }}
                />
              </div>

              <div className="token-footer flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                <span className="font-mono font-bold text-slate-600">{card.code}</span>
                <button
                  onClick={() => injectDebugBarcode(card.code, 'pending')}
                  className="btn-test-scan-token text-indigo-600 hover:text-indigo-800 font-bold transition flex items-center gap-1"
                >
                  <span>⚡</span> Test Scan
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Barcode Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-pop-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{choreForm.icon || '🏷️'}</span>
                <h3 className="font-black text-slate-800 text-lg font-kid">
                  {editingCode ? 'Edit Chore Barcode' : 'Add New Chore Barcode'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chore Title
                </label>
                <input
                  type="text"
                  value={choreForm.title}
                  onChange={(e) => setChoreForm({ ...choreForm, title: e.target.value })}
                  placeholder="e.g. Practice Piano 15m, Feed the Dog"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Barcode Identifier
                  </label>
                  <input
                    type="text"
                    disabled={!!editingCode}
                    value={choreForm.code}
                    onChange={(e) => setChoreForm({ ...choreForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. PIANO-01"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 uppercase"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Code 39 barcode (auto-generated if empty)</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Star Reward Tier
                  </label>
                  <select
                    value={choreForm.tier}
                    onChange={(e) => setChoreForm({ ...choreForm, tier: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="bronze">🥉 Bronze Star (1 pt)</option>
                    <option value="silver">🥈 Silver Star (2 pts)</option>
                    <option value="gold">🥇 Gold Star (4 pts)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Choose Emoji Icon
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={choreForm.icon}
                    onChange={(e) => setChoreForm({ ...choreForm, icon: e.target.value })}
                    className="w-14 text-center text-2xl py-1 rounded-xl border border-slate-300"
                  />
                  <span className="text-[11px] text-slate-400">Pick from below or type emoji</span>
                </div>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 max-h-24 overflow-y-auto">
                  {CHORE_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setChoreForm({ ...choreForm, icon: emoji })}
                      className={`text-xl p-1.5 rounded-lg hover:bg-amber-100 transition ${
                        choreForm.icon === emoji ? 'bg-amber-200 ring-2 ring-amber-400' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Note
                </label>
                <input
                  type="text"
                  value={choreForm.desc}
                  onChange={(e) => setChoreForm({ ...choreForm, desc: e.target.value })}
                  placeholder="e.g. Practiced piano scales nicely"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-sm transition"
                >
                  {editingCode ? 'Save Changes ✨' : 'Add Barcode Token 🏷️'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

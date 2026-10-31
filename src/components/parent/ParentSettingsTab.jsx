import React, { useState } from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';

export default function ParentSettingsTab() {
  const { data, updateSettings, setChildName, showToast } = useStarbook();
  const settings = data.settings || {};

  const [childNameInput, setChildNameInput] = useState(settings.childName || 'Alex');
  const [pinInput, setPinInput] = useState(settings.parentPin || '1234');
  const [pinEnabled, setPinEnabled] = useState(settings.pinEnabled ?? true);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled ?? true);

  const handleSaveChildName = (e) => {
    e.preventDefault();
    if (!childNameInput.trim()) {
      showToast('Please enter a valid name for your child!', 'error');
      return;
    }
    setChildName(childNameInput.trim());
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (pinInput.length !== 4 || !/^\d{4}$/.test(pinInput)) {
      showToast('Parent PIN must be exactly 4 digits (e.g. 1234)!', 'error');
      return;
    }
    updateSettings({
      parentPin: pinInput,
      pinEnabled: pinEnabled
    });
    soundController.playPop();
    showToast('Parent PIN and security settings updated! 🔒', 'success');
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    updateSettings({ soundEnabled: next });
    soundController.enabled = next;
    if (next) soundController.playStarChime('gold');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Child Profile & Customization Card */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <span className="text-3xl">🧒</span>
          <div>
            <h3 className="font-extrabold text-slate-800 text-lg font-kid">Child Profile & Account</h3>
            <p className="text-xs text-slate-500">
              Customize your child's display name, star piggy bank title, and account ID.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveChildName} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Child's First Name
              </label>
              <input
                type="text"
                value={childNameInput}
                onChange={(e) => setChildNameInput(e.target.value)}
                placeholder="e.g. Emma, Liam, Alex, Sophia"
                maxLength={24}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Used in Kid View, Bank Book, and Adventure Certificates.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Star Bank Account Number
              </label>
              <input
                type="text"
                disabled
                value={`ACCT-7734-${(childNameInput || 'ALEX').trim().toUpperCase()}`}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 font-mono text-xs font-bold text-slate-500 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Auto-assigned unique ledger banking account identifier.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-sm transition flex items-center gap-2"
            >
              <span>💾</span> Save Child's Name
            </button>
          </div>
        </form>
      </div>

      {/* 2. Parent Security & PIN Settings */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <span className="text-3xl">🔒</span>
          <div>
            <h3 className="font-extrabold text-slate-800 text-lg font-kid">Parent PIN & Gatekeeper</h3>
            <p className="text-xs text-slate-500">
              Protect approvals, star adjustments, and rewards cash-outs from eager kid taps.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSecurity} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                4-Digit Parent PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="1234"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 font-mono tracking-widest text-lg text-center font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Default PIN is 1234. Adult math challenge (e.g. 7 × 8) is available as fallback.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pinEnabled}
                  onChange={(e) => setPinEnabled(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="font-extrabold text-xs text-slate-800">
                    Require PIN to Enter Parent Mode
                  </div>
                  <div className="text-[11px] text-slate-500">
                    If disabled, switches instantly to Parent Dashboard without prompt.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-sm transition flex items-center gap-2"
            >
              <span>🔒</span> Update Security PIN
            </button>
          </div>
        </form>
      </div>

      {/* 3. Audio & Sound Effects */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{soundEnabled ? '🔊' : '🔇'}</span>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm font-kid">Web Audio Sound Effects</h4>
            <p className="text-xs text-slate-500">
              Play cheerful synthesized chimes, scan beeps, and celebration fanfares for kids.
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleSound}
          className={`px-4 py-2 rounded-xl text-xs font-black transition ${
            soundEnabled
              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          {soundEnabled ? 'Sounds: ON 🎵' : 'Sounds: MUTED 🔇'}
        </button>
      </div>

    </div>
  );
}

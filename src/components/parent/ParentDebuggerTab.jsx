import React, { useState } from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { verifyLedgerIntegrity } from '../../utils/ledger';
import { soundController } from '../../utils/audio';

export default function ParentDebuggerTab() {
  const {
    data,
    setData,
    reconcileBalances,
    injectDebugBarcode,
    exportBackupJSON,
    importBackupJSON,
    generateSyncCode,
    applySyncCode,
    showToast
  } = useStarbook();

  const [barcodeInput, setBarcodeInput] = useState('GOLD-ROOM-01');
  const [syncCodeInput, setSyncCodeInput] = useState('');
  const [rawJSON, setRawJSON] = useState(() => JSON.stringify(data, null, 2));

  const integrity = verifyLedgerIntegrity(data.bank, data.ledger);

  const handleApplySyncCode = () => {
    if (!syncCodeInput.trim()) {
      showToast('Please enter a Starbook Sync Code!', 'error');
      return;
    }
    applySyncCode(syncCodeInput.trim());
    setSyncCodeInput('');
  };

  const handleCopySyncCode = () => {
    const code = generateSyncCode();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        showToast('Copied Sync Code to Clipboard! 📋', 'success');
      }).catch(() => {
        prompt('Copy your Sync Code:', code);
      });
    } else {
      prompt('Copy your Sync Code:', code);
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      importBackupJSON(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleSaveRawJSON = () => {
    try {
      const parsed = JSON.parse(rawJSON);
      if (!parsed.bank || !parsed.settings) {
        throw new Error('JSON is missing bank or settings');
      }
      setData(parsed);
      soundController.playPop();
      showToast('State updated from Raw JSON editor! 💾', 'success');
    } catch (e) {
      soundController.playReject();
      showToast(`Invalid JSON: ${e.message}`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Ledger Integrity Health Check */}
      <div className={`p-5 rounded-3xl border shadow-sm ${
        integrity.isHealthy
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
          : 'bg-rose-50/80 border-rose-200 text-rose-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{integrity.isHealthy ? '✅' : '⚠️'}</span>
            <div>
              <h4 className="font-black text-base font-kid">
                {integrity.isHealthy ? 'Double-Entry Ledger Integrity: Healthy!' : 'Ledger Integrity Discrepancy Detected'}
              </h4>
              <p className="text-xs opacity-80">
                {integrity.isHealthy
                  ? 'All bank star credits, withdrawals, and transfers exactly match the transaction audit log.'
                  : 'The bank balance does not match the sum of transactions. You can click reconcile to repair.'}
              </p>
            </div>
          </div>

          <button
            onClick={reconcileBalances}
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition whitespace-nowrap self-start sm:self-auto"
          >
            Force Reconcile Balances ⚖️
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-current/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="opacity-70 block text-[10px] uppercase font-bold">Ledger Net Gold</span>
            <span className="font-black">{integrity.ledgerTotal.gold} (Bank: {integrity.currentBank.gold})</span>
          </div>
          <div>
            <span className="opacity-70 block text-[10px] uppercase font-bold">Ledger Net Silver</span>
            <span className="font-black">{integrity.ledgerTotal.silver} (Bank: {integrity.currentBank.silver})</span>
          </div>
          <div>
            <span className="opacity-70 block text-[10px] uppercase font-bold">Ledger Net Bronze</span>
            <span className="font-black">{integrity.ledgerTotal.bronze} (Bank: {integrity.currentBank.bronze})</span>
          </div>
          <div>
            <span className="opacity-70 block text-[10px] uppercase font-bold">Total Audit Entries</span>
            <span className="font-black">{integrity.txCount} Records</span>
          </div>
        </div>
      </div>

      {/* 2. Phone-to-Phone Data Transfer */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h4 className="font-extrabold text-slate-800 text-base font-kid">
            📲 Phone-to-Phone Migration & Cloudless Backup
          </h4>
          <p className="text-xs text-slate-500">
            Export all child data, transactions, and settings to move to another phone or tablet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Method A: File Backup */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Method A: JSON File Backup</h5>
            <div className="flex items-center gap-2">
              <button
                onClick={exportBackupJSON}
                className="text-xs font-bold px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition flex items-center gap-1.5"
              >
                <span>💾</span> Export Backup JSON
              </button>
              
              <label className="text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 cursor-pointer shadow-sm transition flex items-center gap-1.5">
                <span>📥</span> Import File
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Method B: 1-Click Sync Code */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Method B: Base64 Sync Code</h5>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={syncCodeInput}
                onChange={(e) => setSyncCodeInput(e.target.value)}
                placeholder="Paste STARBOOK-SYNC:... code"
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs flex-1 font-mono"
              />
              <button
                onClick={handleApplySyncCode}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
              >
                Apply
              </button>
              <button
                onClick={handleCopySyncCode}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition"
                title="Copy my current sync code"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Barcode Injector Tool */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div>
          <h4 className="font-extrabold text-slate-800 text-base font-kid">⚡ Barcode Testing & Injector Tool</h4>
          <p className="text-xs text-slate-500">Inject any chore code directly into Pending or directly into Bank.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            placeholder="e.g. GOLD-ROOM-01"
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold w-48"
          />
          <button
            onClick={() => injectDebugBarcode(barcodeInput, 'pending')}
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 transition"
          >
            ⏳ Inject into Pending
          </button>
          <button
            onClick={() => injectDebugBarcode(barcodeInput, 'bank')}
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
          >
            ⭐ Inject Directly to Bank
          </button>
        </div>
      </div>

      {/* 4. Raw JSON Editor */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-slate-800 text-base font-kid">State Inspector & Raw JSON</h4>
          <button
            onClick={handleSaveRawJSON}
            className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition"
          >
            Save JSON Edits 💾
          </button>
        </div>
        <textarea
          value={rawJSON}
          onChange={(e) => setRawJSON(e.target.value)}
          rows="8"
          className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

    </div>
  );
}


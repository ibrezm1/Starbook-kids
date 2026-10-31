import React from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import ParentNavTabs from './ParentNavTabs';
import ParentPendingTab from './ParentPendingTab';
import ParentBankTab from './ParentBankTab';
import ParentStatementTab from './ParentStatementTab';
import ParentTokensTab from './ParentTokensTab';
import ParentSettingsTab from './ParentSettingsTab';
import ParentDebuggerTab from './ParentDebuggerTab';

export default function ParentDashboard() {
  const { activeParentTab, setActiveParentTab, setCurrentView, data } = useStarbook();
  const childName = data.settings?.childName || 'Alex';

  return (
    <div id="view-parent" className="space-y-6">
      
      {/* Parent Dashboard Top Banner */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-md border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-md">
            🔒
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-black text-slate-800 font-kid">Parent Control Center</h2>
              <button
                onClick={() => setActiveParentTab('settings')}
                className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 transition flex items-center gap-1"
                title="Click to edit child name & settings"
              >
                <span>🧒</span>
                <span>Child: <strong>{childName}</strong></span>
                <span>✏️</span>
              </button>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                Unlocked
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Managing <strong>{childName}</strong>'s star bank, chore approvals, and rewards.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('kid')}
          className="text-xs font-bold px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow-sm flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <span>🚀</span> Back to Kid View
        </button>
      </div>

      {/* Tabs Navigation */}
      <ParentNavTabs />

      {/* Active Tab Pane */}
      <div className="mt-4">
        {activeParentTab === 'pending' && <ParentPendingTab />}
        {activeParentTab === 'bank' && <ParentBankTab />}
        {activeParentTab === 'statement' && <ParentStatementTab />}
        {activeParentTab === 'tokens' && <ParentTokensTab />}
        {activeParentTab === 'settings' && <ParentSettingsTab />}
        {activeParentTab === 'debugger' && <ParentDebuggerTab />}
      </div>

    </div>
  );
}


import React from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';

export default function ParentNavTabs() {
  const { activeParentTab, setActiveParentTab, data } = useStarbook();
  const pendingCount = (data.pendingStars || []).length;

  const handleTabClick = (tab) => {
    soundController.playPop();
    setActiveParentTab(tab);
  };

  const tabs = [
    { id: 'pending', label: 'Pending Approvals', icon: '⏳', badge: pendingCount },
    { id: 'bank', label: 'Star Bank & Cash Out', icon: '🪙' },
    { id: 'statement', label: 'Bank Statement', icon: '🏛️' },
    { id: 'tokens', label: 'Printable Tokens', icon: '🖨️' },
    { id: 'debugger', label: 'Diagnostics & Health', icon: '🔧' }
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-b border-slate-200">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`parent-tab-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeParentTab === tab.id
              ? 'active bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 ml-0.5">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}


import React, { useRef, useEffect } from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';

export default function ParentNavTabs() {
  const { activeParentTab, setActiveParentTab, data } = useStarbook();
  const pendingCount = (data.pendingStars || []).length;
  
  const containerRef = useRef(null);
  const tabRefs = useRef({});

  const tabs = [
    { id: 'pending', label: 'Pending Approvals', icon: '⏳', badge: pendingCount },
    { id: 'bank', label: 'Star Bank & Cash Out', icon: '🪙' },
    { id: 'statement', label: 'Bank Statement', icon: '🏛️' },
    { id: 'tokens', label: 'Printable Tokens & Simulator', icon: '🖨️' },
    { id: 'settings', label: 'Kid Profile & Settings', icon: '⚙️' },
    { id: 'debugger', label: 'Diagnostics & Health', icon: '🔧' }
  ];

  // Smoothly center the selected tab in the horizontal scroll view
  const scrollToTab = (tabId, smooth = true) => {
    const container = containerRef.current;
    const el = tabRefs.current[tabId];
    if (!container || !el) return;

    const containerWidth = container.clientWidth;
    const elLeft = el.offsetLeft;
    const elWidth = el.offsetWidth;

    // Calculate center offset so the full tab is completely visible
    const targetScrollLeft = elLeft - (containerWidth / 2) + (elWidth / 2);

    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: smooth ? 'smooth' : 'auto'
    });
  };

  const handleTabClick = (tabId) => {
    soundController.playPop();
    setActiveParentTab(tabId);
    scrollToTab(tabId, true);
  };

  // Scroll active tab into view whenever activeParentTab changes or on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToTab(activeParentTab, true);
    }, 60);
    return () => clearTimeout(timer);
  }, [activeParentTab]);

  const handleScrollBy = (amount) => {
    if (containerRef.current) {
      soundController.playPop();
      containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative py-1 border-b border-slate-200">
      
      {/* Mobile/Tablet Quick Scroll Arrows */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => handleScrollBy(-160)}
          className="hidden sm:flex md:hidden p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg shrink-0 transition"
          title="Scroll tabs left"
          aria-label="Scroll tabs left"
        >
          ◀
        </button>

        {/* Scrollable Tabs Track */}
        <div
          ref={containerRef}
          className="flex items-center gap-2 overflow-x-auto py-2 px-3 sm:px-2 scroll-smooth no-scrollbar touch-pan-x w-full"
          style={{
            scrollSnapType: 'x proximity',
            WebkitOverflowScrolling: 'touch',
            scrollPadding: '0 24px'
          }}
        >
          {tabs.map(tab => {
            const isActive = activeParentTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={el => { tabRefs.current[tab.id] = el; }}
                onClick={() => handleTabClick(tab.id)}
                className={`parent-tab-btn flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition whitespace-nowrap shrink-0 shadow-sm ${
                  isActive
                    ? 'active bg-amber-500 text-slate-950 font-black shadow-md ring-2 ring-amber-400 scale-[1.02]'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80 hover:border-slate-300'
                }`}
                style={{ scrollSnapAlign: 'center', minHeight: '44px' }}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ml-1 transition ${
                    isActive ? 'bg-slate-950 text-amber-300' : 'bg-amber-400 text-slate-950 shadow-sm'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => handleScrollBy(160)}
          className="hidden sm:flex md:hidden p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg shrink-0 transition"
          title="Scroll tabs right"
          aria-label="Scroll tabs right"
        >
          ▶
        </button>
      </div>

    </div>
  );
}

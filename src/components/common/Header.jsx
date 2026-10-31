import React from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';

export default function Header() {
  const { currentView, setCurrentView, soundEnabled, toggleSound, openModal, data } = useStarbook();

  const handleSwitchToParent = () => {
    soundController.playPop();
    if (data.settings.pinEnabled) {
      openModal('pin');
    } else {
      setCurrentView('parent');
    }
  };

  const handleSwitchToKid = () => {
    soundController.playPop();
    setCurrentView('kid');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-amber-200/80 sticky top-0 z-30 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => setCurrentView('kid')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 flex items-center justify-center font-black text-xl shadow-md border-2 border-amber-300 anim-bounce-gentle shrink-0">
            ⭐
          </div>
          <div>
            <h1 className="font-kid font-black text-xl md:text-2xl text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
              <span>Starbook</span>
              <span className="text-xs uppercase bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full font-black tracking-wider">
                Kids
              </span>
            </h1>
            <p className="text-[10px] sm:text-[11px] font-semibold text-amber-800 hidden xs:block">
              Gold Star Barcode Reward System
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className={`sound-toggle-btn text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
              soundEnabled
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-slate-100 text-slate-400 border-slate-300'
            }`}
            title="Toggle Sound Effects"
          >
            <span>{soundEnabled ? '🔊' : '🔇'}</span>
            <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>

          {/* Mode Switcher */}
          {currentView === 'kid' ? (
            <button
              onClick={handleSwitchToParent}
              className="text-xs font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center gap-1.5 transition transform active:scale-95"
            >
              <span>🔒</span>
              <span className="hidden sm:inline">Parent Dashboard</span>
              <span className="sm:hidden font-extrabold">Parents</span>
            </button>
          ) : (
            <button
              onClick={handleSwitchToKid}
              className="text-xs font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow-sm flex items-center gap-1.5 transition transform active:scale-95"
            >
              <span>🚀</span>
              <span className="hidden sm:inline">Back to Kid View</span>
              <span className="sm:hidden">Kid View</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}


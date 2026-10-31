import React from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';

export default function BigScanButton() {
  const { openModal } = useStarbook();

  const handleScanClick = () => {
    soundController.playPop();
    openModal('scan');
  };

  return (
    <section className="text-center py-4 md:py-6">
      <div className="scan-button-wrapper inline-block">
        <div className="scan-ripple-ring"></div>
        <div className="scan-ripple-ring ring-2"></div>
        <button
          onClick={handleScanClick}
          className="big-scan-btn group"
          id="btn-kid-scan-big"
        >
          <div className="scan-btn-glow"></div>
          <div className="scan-btn-inner">
            <div className="scan-btn-icon-box">
              <span className="text-5xl md:text-6xl anim-camera-rock group-hover:scale-110 transition-transform duration-300">
                📷
              </span>
              <span className="barcode-overlay-icon">▌▌█║▌║█║</span>
            </div>
            <div className="scan-btn-text">
              <span className="scan-btn-title">SCAN BARCODE</span>
              <span className="scan-btn-sub">Tap to earn your Gold Star! ⭐</span>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
}


import React, { useState, useEffect, useRef } from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { ALL_RECOGNIZED_ITEMS } from '../../utils/constants';
import { soundController } from '../../utils/audio';

export default function ScanModal() {
  const { data, activeModal, closeModal, openModal, applySyncCode, showToast, getAllRecognizedItems } = useStarbook();
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  const isOpen = activeModal === 'scan';

  const handleBarcodeFound = (barcode) => {
    soundController.playScanBeep();
    stopCamera();

    // Check if phone-to-phone sync code
    if (barcode.startsWith('STARBOOK-SYNC:')) {
      closeModal();
      applySyncCode(barcode);
      return;
    }

    const allItems = getAllRecognizedItems ? getAllRecognizedItems() : ALL_RECOGNIZED_ITEMS;
    const matched = allItems.find(i => i.code.toLowerCase() === barcode.toLowerCase());
    const payload = {
      barcode,
      name: matched ? (matched.title || matched.name) : 'Scanned Barcode',
      icon: matched ? matched.icon : '🏷️',
      tier: matched ? matched.tier : 'bronze',
      reason: matched ? (matched.reason || matched.title || matched.name) : `Completed ${barcode}`
    };

    closeModal();
    openModal('reason', payload);
  };

  const startCamera = async () => {
    setErrorMessage('');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage('Camera access is not supported on this browser/device.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        startScanningLoop();
      }
    } catch (err) {
      console.warn('Camera access denied or failed:', err);
      setErrorMessage('Camera access blocked. Tap any simulated chore below to scan instantly!');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startScanningLoop = () => {
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        const detector = new window.BarcodeDetector({ formats: ['code_39', 'code_128', 'ean_13', 'qr_code'] });
        const checkFrame = async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) {
            animFrameRef.current = requestAnimationFrame(checkFrame);
            return;
          }
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0) {
              const code = barcodes[0].rawValue;
              handleBarcodeFound(code);
              return;
            }
          } catch (e) {
            // Frame detection error, continue
          }
          animFrameRef.current = requestAnimationFrame(checkFrame);
        };
        animFrameRef.current = requestAnimationFrame(checkFrame);
      } catch (e) {
        console.warn('BarcodeDetector initialization failed:', e);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-pop-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-amber-300 flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl anim-camera-rock">📷</span>
            <h3 className="font-black text-xl font-kid">Barcode Scanner</h3>
          </div>
          <button
            onClick={() => { soundController.playPop(); closeModal(); }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Viewfinder Video Area */}
        <div className="p-4 bg-slate-900 relative flex flex-col items-center justify-center min-h-[260px]">
          <video
            ref={videoRef}
            className={`w-full max-h-[280px] object-cover rounded-2xl ${cameraActive ? 'block' : 'hidden'}`}
            playsInline
            muted
          />

          {cameraActive && (
            <div className="scanner-target-box pointer-events-none">
              <div className="scanner-laser"></div>
            </div>
          )}

          {!cameraActive && (
            <div className="text-center p-6 text-slate-300">
              <span className="text-5xl mb-2 block anim-bounce-gentle">📷</span>
              <p className="text-sm font-bold text-white mb-1">
                {errorMessage || 'Camera initializing...'}
              </p>
              <p className="text-xs text-slate-400">
                You can also tap any quick chore badge below to test without a camera!
              </p>
            </div>
          )}
        </div>

        {/* Quick Simulator Barcode Drawer */}
        <div className="p-4 bg-amber-50/60 border-t border-amber-200">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>⚡ Instant Tap Simulation</span>
            <span className="text-[10px] text-slate-400 font-normal">Tap to simulate scan</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {((data?.customChores && data.customChores.length > 0) ? data.customChores.slice(0, 3) : [
              { code: 'BRONZE-TEETH-01', title: 'Brushed Teeth', icon: '🪥', tier: 'bronze' },
              { code: 'SILVER-HW-01', title: 'Homework', icon: '📚', tier: 'silver' },
              { code: 'GOLD-ROOM-01', title: 'Cleaned Room', icon: '🧹', tier: 'gold' }
            ]).map(item => (
              <button
                key={item.code}
                onClick={() => handleBarcodeFound(item.code)}
                className="p-2.5 bg-white rounded-xl border border-amber-200 text-left hover:border-amber-400 transition"
              >
                <span className="text-xl block mb-0.5">{item.icon || '⭐'}</span>
                <span className="font-extrabold text-xs text-slate-800 block truncate">{item.title || item.name}</span>
                <span className="text-[10px] text-amber-700 font-bold capitalize">
                  {item.tier === 'gold' ? '🥇 Gold (4 pts)' : (item.tier === 'silver' ? '🥈 Silver (2 pts)' : '🥉 Bronze (1 pt)')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-white border-t border-slate-200 text-center">
          <button
            onClick={() => { soundController.playPop(); closeModal(); }}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            Close Scanner
          </button>
        </div>

      </div>
    </div>
  );
}


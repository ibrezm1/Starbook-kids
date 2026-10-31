import React, { useState } from 'react';
import { useStarbook } from '../../hooks/useStarbook';
import { soundController } from '../../utils/audio';

export default function PinGateModal() {
  const { activeModal, closeModal, setCurrentView, data, showToast } = useStarbook();
  const [pin, setPin] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [showMathFallback, setShowMathFallback] = useState(false);
  const [mathAnswer, setMathAnswer] = useState('');

  const isOpen = activeModal === 'pin';
  if (!isOpen) return null;

  const expectedPin = data.settings?.parentPin || '1234';

  const handleKeyPress = (num) => {
    soundController.playTick();
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    soundController.playPop();
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    soundController.playPop();
    setPin('');
  };

  const verifyPin = (entered) => {
    if (entered === expectedPin) {
      soundController.playStarChime('gold');
      setPin('');
      closeModal();
      setCurrentView('parent');
      showToast('Welcome to the Parent Dashboard! 👨‍👩‍👧', 'success');
    } else {
      soundController.playReject();
      setErrorShake(true);
      setTimeout(() => {
        setErrorShake(false);
        setPin('');
      }, 500);
      showToast('Incorrect PIN! Try again or use the math challenge below.', 'error');
    }
  };

  const handleMathSubmit = (e) => {
    e.preventDefault();
    if (mathAnswer.trim() === '56') { // 7 x 8 = 56
      soundController.playStarChime('gold');
      setMathAnswer('');
      closeModal();
      setCurrentView('parent');
      showToast('Adult Math Verification Passed! 🎓', 'success');
    } else {
      soundController.playReject();
      showToast('Incorrect answer! 7 × 8 = ?', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-pop-in">
      <div className={`bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-4 border-slate-800 ${errorShake ? 'shake' : ''}`}>
        
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl mx-auto mb-2 shadow-md">
          🔒
        </div>
        <h3 className="text-2xl font-black text-slate-800 font-kid mb-1">Parent Access</h3>
        <p className="text-xs text-slate-500 mb-4">
          Enter 4-digit Parent PIN (Default: <strong>1234</strong>)
        </p>

        {/* PIN Dots Display */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 border-slate-300 transition-all ${
                pin.length > i ? 'bg-amber-400 border-amber-500 scale-110' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>

        {/* Tactile Numpad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-lg transition active:scale-90"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs uppercase"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-lg active:scale-90"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-base"
          >
            ⌫
          </button>
        </div>

        {/* Adult Math Bypass Fallback */}
        {!showMathFallback ? (
          <button
            onClick={() => setShowMathFallback(true)}
            className="text-[11px] text-slate-400 hover:text-slate-600 underline font-medium block mx-auto mb-3"
          >
            Forgot PIN? Verify with adult math
          </button>
        ) : (
          <form onSubmit={handleMathSubmit} className="p-3 bg-amber-50 rounded-2xl border border-amber-200 mb-3 text-xs">
            <div className="font-bold text-slate-700 mb-1">Adult Verification: What is 7 × 8?</div>
            <div className="flex gap-2">
              <input
                type="number"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                placeholder="Answer"
                className="w-20 px-2 py-1 rounded-xl border border-slate-300 text-center font-bold"
              />
              <button
                type="submit"
                className="flex-1 py-1 rounded-xl bg-slate-900 text-white font-bold"
              >
                Unlock
              </button>
            </div>
          </form>
        )}

        <button
          onClick={() => { soundController.playPop(); closeModal(); }}
          className="text-xs text-slate-400 hover:text-slate-600 font-bold"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}


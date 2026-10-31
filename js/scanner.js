// Barcode Scanner Controller (Webcam + Simulation Modes)
// Supports Native BarcodeDetector API, Html5Qrcode fallback, and Quick-Simulated Barcodes

class StarScanner {
  constructor() {
    this.videoElement = null;
    this.mediaStream = null;
    this.isScanning = false;
    this.barcodeDetector = null;
    this.html5QrCodeInstance = null;
    this.currentFacingMode = 'environment';
    this.hasFlashlight = false;
    this.isTorchOn = false;
    this.scanIntervalId = null;
    this.onBarcodeDetected = null; // Callback

    this.simulatedItems = [
      // Bronze Chore Barcodes (1 pt)
      { code: 'BRONZE-TEETH-01', name: 'Sparkly Teeth Badge', icon: '🪥', tier: 'bronze', points: 1, reason: 'Brushed Teeth 2 Minutes' },
      { code: 'BRONZE-BED-02', name: 'Made My Bed Token', icon: '🛏️', tier: 'bronze', points: 1, reason: 'Made My Bed Nicely' },
      { code: 'BRONZE-TOYS-03', name: 'Tidied Toy Box Tag', icon: '🧸', tier: 'bronze', points: 1, reason: 'Put Away All Toys' },
      { code: 'BRONZE-SHOES-04', name: 'Shoes Put Away Tag', icon: '👟', tier: 'bronze', points: 1, reason: 'Put Shoes by Front Door' },
      { code: 'BRONZE-WATER-05', name: 'Hydration Hero Badge', icon: '💧', tier: 'bronze', points: 1, reason: 'Drank Water / Healthy Snack' },
      { code: 'BRONZE-HANDS-06', name: 'Clean Hands Token', icon: '🧼', tier: 'bronze', points: 1, reason: 'Washed Hands with Soap' },

      // Silver Chore Barcodes (2 pts)
      { code: 'SILVER-HW-01', name: 'Homework Completed Tag', icon: '📚', tier: 'silver', points: 2, reason: 'Finished Homework' },
      { code: 'SILVER-READ-02', name: '20-Min Reading Token', icon: '📖', tier: 'silver', points: 2, reason: 'Read for 20 Minutes' },
      { code: 'SILVER-VEG-03', name: 'Veggie Champion Badge', icon: '🥦', tier: 'silver', points: 2, reason: 'Ate All My Veggies' },
      { code: 'SILVER-PET-04', name: 'Pet Care Hero Badge', icon: '🐕', tier: 'silver', points: 2, reason: 'Fed / Walked Pet' },
      { code: 'SILVER-MUSIC-05', name: 'Music Practice Token', icon: '🎵', tier: 'silver', points: 2, reason: 'Practiced Instrument' },
      { code: 'SILVER-TABLE-06', name: 'Dinner Table Helper', icon: '🍽️', tier: 'silver', points: 2, reason: 'Set & Cleared Dinner Table' },

      // Gold Chore Barcodes (4 pts)
      { code: 'GOLD-ROOM-01', name: 'Clean Bedroom Champion', icon: '🧹', tier: 'gold', points: 4, reason: 'Cleaned Bedroom & Made Bed' },
      { code: 'GOLD-HELP-02', name: 'Kind Family Helper Badge', icon: '🤝', tier: 'gold', points: 4, reason: 'Helped Family Member' },
      { code: 'GOLD-DISH-03', name: 'Kitchen Dishes Hero', icon: '🧽', tier: 'gold', points: 4, reason: 'Washed / Loaded Dishes' },
      { code: 'GOLD-LAUNDRY-04', name: 'Laundry Folding Master', icon: '🧺', tier: 'gold', points: 4, reason: 'Folded & Put Laundry Away' },
      { code: 'GOLD-PROJECT-05', name: 'Big Project Superstar', icon: '🌟', tier: 'gold', points: 4, reason: 'Completed Big School Project' },
      { code: 'GOLD-YARD-06', name: 'Yard & Trash Master', icon: '🍂', tier: 'gold', points: 4, reason: 'Helped with Yard / Took Out Trash' },

      // Legacy & Household barcode aliases
      { code: 'CHORE-ROOM-01', name: 'Clean Bedroom Token', icon: '🧹', tier: 'gold', points: 4, reason: 'Cleaned Room & Made Bed' },
      { code: 'CHORE-HOMEWORK-02', name: 'Homework Completed', icon: '📚', tier: 'silver', points: 2, reason: 'Finished Math Worksheet' },
      { code: 'CHORE-TEETH-03', name: 'Sparkly Teeth Badge', icon: '🪥', tier: 'bronze', points: 1, reason: 'Brushed Teeth 2 Minutes' },
      { code: 'ITEM-CEREAL-04', name: 'Morning Cereal Box', icon: '🥣', tier: 'bronze', points: 1, reason: 'Ate Healthy Breakfast' },
      { code: 'CHORE-PET-05', name: 'Pet Care Token', icon: '🐕', tier: 'silver', points: 2, reason: 'Fed / Walked Pet' },
      { code: 'CHORE-VEGGIES-06', name: 'Veggie Champion Tag', icon: '🥦', tier: 'silver', points: 2, reason: 'Ate All Veggies at Dinner' },
      { code: 'ITEM-BOOK-07', name: 'Library Storybook', icon: '📖', tier: 'silver', points: 2, reason: 'Read for 20 Minutes' },
      { code: 'CHORE-HELP-08', name: 'Kind Helper Badge', icon: '🤝', tier: 'gold', points: 4, reason: 'Helped Family Member' },
      { code: 'ITEM-TOY-09', name: 'Toy Box Tag', icon: '🧸', tier: 'bronze', points: 1, reason: 'Put Away All Toys' },
      { code: 'MYSTERY-SCAN-99', name: 'Mystery Super Star', icon: '⭐', tier: 'gold', points: 4, reason: 'Awesome Surprise Deed!' }
    ];

    this.initBarcodeDetector();
  }

  async initBarcodeDetector() {
    if ('BarcodeDetector' in window) {
      try {
        const supported = await BarcodeDetector.getSupportedFormats();
        if (supported && supported.length > 0) {
          this.barcodeDetector = new BarcodeDetector({
            formats: ['code_128', 'code_39', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'qr_code']
          });
        }
      } catch (e) {
        console.warn('BarcodeDetector initialization note:', e);
      }
    }
  }

  // Start live webcam scanning
  async startWebcam(videoElem, statusElem) {
    this.stopScanning();
    this.videoElement = videoElem;
    this.isScanning = true;

    if (statusElem) {
      statusElem.textContent = 'Requesting camera access...';
    }

    // Try HTML5-QRCode if loaded via script
    if (window.Html5Qrcode && !this.barcodeDetector) {
      try {
        this.html5QrCodeInstance = new Html5Qrcode('webcam-scanner-box');
        const qrCodeSuccessCallback = (decodedText, decodedResult) => {
          this.handleDetectedBarcode(decodedText, 'Camera Scan');
        };
        const config = { fps: 10, qrbox: { width: 250, height: 180 } };
        await this.html5QrCodeInstance.start(
          { facingMode: this.currentFacingMode },
          config,
          qrCodeSuccessCallback
        );
        if (statusElem) statusElem.textContent = 'Camera active: Point at any barcode!';
        return;
      } catch (err) {
        console.warn('Html5Qrcode start failed, falling back to native getUserMedia:', err);
      }
    }

    // Native getUserMedia + BarcodeDetector / Canvas
    try {
      const constraints = {
        video: {
          facingMode: { ideal: this.currentFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement.srcObject = this.mediaStream;
      await this.videoElement.play();

      if (statusElem) {
        statusElem.textContent = 'Camera active: Align barcode in the box!';
      }

      // Check track torch capability
      const track = this.mediaStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      this.hasFlashlight = !!capabilities.torch;
      const torchBtn = document.getElementById('btn-scanner-torch');
      if (torchBtn) {
        torchBtn.style.display = this.hasFlashlight ? 'inline-flex' : 'none';
      }

      this.startNativeDetectionLoop();
    } catch (err) {
      console.error('Camera access error:', err);
      this.isScanning = false;
      if (statusElem) {
        statusElem.innerHTML = `<span style="color:#ef4444;">⚠️ Camera unavailable (${err.name || 'Permission needed'}). You can use the Quick Barcodes below!</span>`;
      }
    }
  }

  startNativeDetectionLoop() {
    if (!this.isScanning || !this.videoElement) return;

    const detectFrame = async () => {
      if (!this.isScanning || !this.videoElement || this.videoElement.readyState < 2) {
        if (this.isScanning) {
          this.scanIntervalId = requestAnimationFrame(detectFrame);
        }
        return;
      }

      try {
        if (this.barcodeDetector) {
          const barcodes = await this.barcodeDetector.detect(this.videoElement);
          if (barcodes && barcodes.length > 0) {
            const code = barcodes[0].rawValue;
            if (code) {
              this.handleDetectedBarcode(code, `Scan: ${barcodes[0].format || 'Barcode'}`);
              return; // stop detection loop
            }
          }
        }
      } catch (e) {
        // Frame detection skipped
      }

      if (this.isScanning) {
        this.scanIntervalId = requestAnimationFrame(detectFrame);
      }
    };

    this.scanIntervalId = requestAnimationFrame(detectFrame);
  }

  async toggleTorch() {
    if (!this.mediaStream || !this.hasFlashlight) return;
    try {
      const track = this.mediaStream.getVideoTracks()[0];
      this.isTorchOn = !this.isTorchOn;
      await track.applyConstraints({
        advanced: [{ torch: this.isTorchOn }]
      });
      const torchBtn = document.getElementById('btn-scanner-torch');
      if (torchBtn) {
        torchBtn.classList.toggle('active', this.isTorchOn);
      }
    } catch (e) {
      console.warn('Could not toggle torch:', e);
    }
  }

  flipCamera() {
    this.currentFacingMode = this.currentFacingMode === 'environment' ? 'user' : 'environment';
    const statusElem = document.getElementById('camera-status-msg');
    this.startWebcam(this.videoElement, statusElem);
  }

  stopScanning() {
    this.isScanning = false;
    if (this.scanIntervalId) {
      cancelAnimationFrame(this.scanIntervalId);
      this.scanIntervalId = null;
    }
    if (this.html5QrCodeInstance) {
      try {
        this.html5QrCodeInstance.stop().then(() => {
          this.html5QrCodeInstance.clear();
        }).catch(() => {});
      } catch (e) {}
      this.html5QrCodeInstance = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
    this.isTorchOn = false;
  }

  // Barcode successfully found
  handleDetectedBarcode(code, source = 'Scanner') {
    if (!this.isScanning) return;
    this.stopScanning();

    // Sound effect
    if (window.soundController) {
      window.soundController.playScanBeep();
    }

    // Visual celebration burst
    if (window.confettiEngine) {
      window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.4, 40, 'mixed');
    }

    // Check if this is a Phone-to-Phone Account Migration QR Code
    if (code.trim().startsWith('STARBOOK-SYNC:')) {
      if (window.starbookApp && typeof window.starbookApp.handleSyncQRCode === 'function') {
        window.starbookApp.handleSyncQRCode(code.trim());
        return;
      }
    }

    // Match with simulated item if known, or construct custom item
    const matched = this.simulatedItems.find(i => i.code.toLowerCase() === code.trim().toLowerCase());
    const result = {
      barcode: code.trim(),
      name: matched ? matched.name : `Scanned Item (${code.trim().slice(0, 14)})`,
      icon: matched ? matched.icon : '📦',
      tier: matched ? matched.tier : null,
      reason: matched ? matched.reason : null,
      points: matched ? matched.points : null,
      source: source
    };

    if (typeof this.onBarcodeDetected === 'function') {
      this.onBarcodeDetected(result);
    }
  }

  // Trigger quick simulation scan
  simulateScan(itemCode) {
    let item;
    if (itemCode === 'RANDOM') {
      const idx = Math.floor(Math.random() * this.simulatedItems.length);
      item = this.simulatedItems[idx];
    } else {
      item = this.simulatedItems.find(i => i.code.toLowerCase() === itemCode.trim().toLowerCase());
    }

    if (!item) {
      item = {
        code: itemCode || `CUSTOM-${Math.floor(1000 + Math.random() * 9000)}`,
        name: 'Custom Scanned Item',
        icon: '🏷️',
        tier: null,
        reason: null,
        points: null
      };
    }

    if (window.soundController) {
      window.soundController.playScanBeep();
    }

    if (window.confettiEngine) {
      window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.4, 40, 'mixed');
    }

    if (typeof this.onBarcodeDetected === 'function') {
      this.onBarcodeDetected({
        barcode: item.code,
        name: item.name,
        icon: item.icon,
        tier: item.tier,
        reason: item.reason,
        points: item.points,
        source: 'Quick Barcode'
      });
    }
  }
}

window.starScanner = new StarScanner();


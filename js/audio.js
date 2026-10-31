// Web Audio API Sound Effects Synthesizer for Gold Star Barcode Reward System
// Completely self-contained, offline-ready, zero-asset dependencies!

class SoundController {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.loadSetting();
  }

  loadSetting() {
    const saved = localStorage.getItem('starbook_sound_enabled');
    if (saved !== null) {
      this.enabled = JSON.parse(saved);
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem('starbook_sound_enabled', JSON.stringify(this.enabled));
    if (this.enabled) {
      this.playPop();
    }
    return this.enabled;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Barcode Scanner "Beep"
  playScanBeep() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, this.ctx.currentTime); // High A6 beep
      osc.frequency.setValueAtTime(2349, this.ctx.currentTime + 0.05); // D7 note

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Star Chimes by Tier
  playStarChime(tier = 'gold') {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      let notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (Bronze)
      if (tier === 'silver') {
        notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Silver)
      } else if (tier === 'gold') {
        notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6 (Gold!)
      }

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.07);
        osc.stop(this.ctx.currentTime + idx * 0.07 + 0.42);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Triumph Fanfare (when Parent approves or Big Reward redeemed)
  playFanfare() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const melody = [
        { f: 523.25, d: 0.12, t: 0 },      // C5
        { f: 523.25, d: 0.12, t: 0.14 },   // C5
        { f: 523.25, d: 0.12, t: 0.28 },   // C5
        { f: 659.25, d: 0.35, t: 0.42 },   // E5
        { f: 587.33, d: 0.15, t: 0.8 },    // D5
        { f: 783.99, d: 0.5, t: 0.98 },    // G5!
      ];

      melody.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, this.ctx.currentTime + n.t);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + n.t);
        gain.gain.linearRampToValueAtTime(0.28, this.ctx.currentTime + n.t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + n.t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + n.t);
        osc.stop(this.ctx.currentTime + n.t + n.d + 0.05);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Cash Register / Coin Clink for Cashing Out
  playCashOut() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      // Bell ding
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
      gain1.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start();
      osc1.stop(this.ctx.currentTime + 0.6);

      // Cha-ching secondary high ring
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.1); // E6
      gain2.gain.setValueAtTime(0, this.ctx.currentTime + 0.1);
      gain2.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.7);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(this.ctx.currentTime + 0.1);
      osc2.stop(this.ctx.currentTime + 0.75);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Level Up / Star Exchange Sound Effect
  playExchange() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A4, C#5, E5, A5, C#6, E6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.05);
        osc.stop(this.ctx.currentTime + idx * 0.05 + 0.38);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Pop / Button Click
  playPop() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Soft Tick for Spinner Wheel
  playTick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + Math.random() * 200, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Reject / Oops Sound
  playReject() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.26);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.27);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }
}

window.soundController = new SoundController();


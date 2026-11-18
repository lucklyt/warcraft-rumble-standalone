class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
  }

  _ensureCtx() {
    if (this.muted || typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  _tone(freqStart, freqEnd, duration, type = 'triangle', gainPeak = 0.08) {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), now + duration);
    gain.gain.setValueAtTime(gainPeak, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  play(eventName) {
    if (this.muted) return;
    switch (eventName) {
      case 'deploy':
        this._tone(240, 360, 0.11, 'triangle', 0.09);
        break;
      case 'gold':
        this._tone(880, 1320, 0.14, 'sine', 0.08);
        break;
      case 'switch':
        this._tone(520, 680, 0.08, 'sine', 0.06);
        break;
      case 'lightning':
        this._tone(960, 260, 0.16, 'sawtooth', 0.06);
        break;
      case 'spell':
      case 'explosion':
        this._tone(180, 55, 0.28, 'sawtooth', 0.1);
        break;
      case 'breath':
        this._tone(140, 62, 0.42, 'sawtooth', 0.09);
        break;
      case 'roar':
        this._tone(110, 48, 0.75, 'sawtooth', 0.13);
        break;
      case 'tower':
        this._tone(320, 520, 0.3, 'triangle', 0.1);
        break;
      case 'alert':
        this._tone(660, 440, 0.22, 'square', 0.06);
        break;
      case 'victory':
        this._tone(523, 784, 0.45, 'triangle', 0.11);
        break;
      case 'defeat':
        this._tone(220, 95, 0.55, 'sawtooth', 0.1);
        break;
      default:
        break;
    }
  }
}

export const sfx = new SoundEngine();

const SAMPLE_MAP = {
  click: './r/audio/ui-click.mp3',
  select: './r/audio/ui-select.mp3',
  start: './r/audio/ui-start.mp3',
  deploy: './r/audio/ui-deploy.mp3',
  victory: './r/audio/ui-victory.mp3',
  gold: './r/audio/gold-coin.mp3',
};

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this._audioPools = new Map();
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
  }

  _playSample(key, volume = 0.45) {
    if (this.muted || typeof Audio === 'undefined') return false;
    const url = SAMPLE_MAP[key];
    if (!url) return false;
    try {
      let pool = this._audioPools.get(key);
      if (!pool) {
        pool = [];
        this._audioPools.set(key, pool);
      }
      let audio = pool.find((a) => a.paused || a.ended);
      if (!audio && pool.length < 4) {
        audio = new Audio(url);
        audio.preload = 'auto';
        pool.push(audio);
      }
      if (!audio) audio = pool[0];
      audio.volume = volume;
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
      return true;
    } catch {
      return false;
    }
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
      case 'click':
        this._playSample('click', 0.35);
        break;
      case 'select':
        this._playSample('select', 0.4);
        break;
      case 'start':
        this._playSample('start', 0.55);
        break;
      case 'deploy':
        if (!this._playSample('deploy', 0.42)) {
          this._tone(240, 360, 0.11, 'triangle', 0.09);
        }
        break;
      case 'gold':
        if (!this._playSample('gold', 0.38)) {
          this._tone(880, 1320, 0.14, 'sine', 0.08);
        }
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
        this._playSample('victory', 0.6);
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

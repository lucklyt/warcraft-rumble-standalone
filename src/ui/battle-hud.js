import { CombatSimulation, TICK_DT } from '../engine/combat-sim.js';
import { ONYXIA_POS, UNWALKABLE_OBSTACLES } from '../engine/onyxia-map.js';
import { tickPlayerAutopilot } from '../engine/player-autopilot.js';
import { getUnitCombatSpec, resolveMiniSprite } from '../engine/unit-stats.js';
import { BattleRenderer3D } from '../render/battle-renderer-3d.js';
import { preloadDeckModels } from '../render/model-cache.js';
import { normalizeAssetPath, preloadBattleAssets } from '../render/asset-loader.js';
import { sfx } from '../audio/sfx.js';

function esc(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function formatClock(sec) {
  const s = Math.max(0, Math.ceil(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export class BattleController {
  constructor(root, modalRoot, options) {
    this.root = root;
    this.modalRoot = modalRoot;
    this.deck = options.deck;
    this.difficulty = options.difficulty;
    this.deckName = options.deckName;
    this.onExitLobby = options.onExitLobby;
    this.onBattleFinish = options.onBattleFinish;
    this.onToast = options.onToast;

    this.sim = new CombatSimulation({
      deck: this.deck,
      playerLevelDelta: this.difficulty.playerLevelDelta,
      enemyLevelDelta: this.difficulty.enemyLevelDelta,
      seed: Date.now() & 0x7fffffff,
    });

    this.speedMult = 1;
    this.paused = false;
    this.autopilot = false;
    this.selectedSlot = null;
    this.draggingSlot = null;
    this.hoverWorld = null;
    this.rafId = null;
    this.lastFrameMs = 0;
    this.accumSec = 0;
    this.outcomeRecorded = false;
    this.lastHandKey = '';

    this._panning = false;
    this._panMoved = 0;
    this._panLastY = 0;
    this._keysHeld = new Set();

    // Pooled 2D overlays over 3D canvas
    this._hpOverlayPool = new Map();
    this._textOverlayPool = new Map();

    this._onKeyDown = this._handleKeyDown.bind(this);
    this._onKeyUp = (e) => this._keysHeld.delete(e.code);
  }

  mount() {
    const allSlugs = [
      this.deck.leader.slug,
      ...this.deck.troops.map((t) => t.slug),
      'kobold-miner',
      'drake',
      'gargoyle',
      'gryphon-rider',
      'necromancer',
      'spiderlings',
      'warsong-grunts',
      'earth-elemental',
      'spirit-wolf',
      'skeleton-minion',
    ];
    const deckSprites = [
      resolveMiniSprite(this.deck.leader.slug),
      ...this.deck.troops.map((t) => resolveMiniSprite(t.slug)),
    ];
    preloadBattleAssets(deckSprites);
    preloadDeckModels(allSlugs);

    this.root.innerHTML = `
      <div class="wr-battle-shell wr-3d-mode">
        <div class="wr-canvas-stage" id="wr-stage">
          <canvas id="wr-battle-canvas" class="wr-battle-canvas-3d"></canvas>
          <div id="wr-world-overlays" class="wr-world-overlays"></div>

          <!-- Top HUD Overlay -->
          <div class="wr-hud-top">
            <div class="wr-boss-plate">
              <div class="wr-boss-portrait-wrap">
                <img id="wr-boss-mood" class="wr-boss-mood" src="./r/onyxia/Onyxia_Smug.webp" alt="奥妮克希亚" />
                <div id="wr-boss-phase-badge" class="wr-boss-phase-badge">P1</div>
              </div>
              <div class="wr-boss-hp-col">
                <div class="wr-boss-hp-meta">
                  <span id="wr-boss-title"><strong>奥妮克希亚</strong> · ${esc(this.difficulty.nameZh)}</span>
                  <span class="wr-boss-traits-inline" id="wr-boss-traits"></span>
                  <span id="wr-boss-hp-text" style="font-family:var(--font-numbers);">18,000 / 18,000</span>
                </div>
                <div class="wr-boss-hp-track-hud">
                  <div id="wr-boss-hp-fill" class="wr-boss-hp-fill" style="width:100%;"></div>
                  <div class="wr-boss-notch" style="left:40%;" title="40% P3转阶段"></div>
                  <div class="wr-boss-notch" style="left:70%;" title="70% P2转阶段"></div>
                </div>
              </div>
              <div class="wr-timer-frame">
                <span id="wr-match-timer" class="wr-timer-val">6:00</span>
                <span id="wr-egg-timer" class="wr-egg-sub">龙蛋 0:20</span>
              </div>
            </div>

            <div class="wr-ctrl-strip">
              <button type="button" class="wr-hud-chip" id="wr-auto-btn" title="AI 战术托管">AI 托管</button>
              <button type="button" class="wr-hud-chip" id="wr-speed-btn" title="切换倍速">1x</button>
              <button type="button" class="wr-hud-icon-btn" id="wr-pause-btn" title="暂停/继续 (Space)">
                <img src="./r/hud/CombatHUD_Tex_IconPause.webp" alt="暂停" />
              </button>
              <button type="button" class="wr-hud-icon-btn" id="wr-restart-btn" title="重新开始">
                <img src="./r/hud/CombatHUD_Tex_IconRestart.webp" alt="重开" />
              </button>
              <button type="button" class="wr-hud-chip danger" id="wr-exit-btn">退出</button>
            </div>
          </div>

          <div id="wr-boss-taunt" class="wr-boss-taunt" style="display:none;"></div>
          <div id="wr-battle-banner" class="wr-battle-banner" style="display:none;"></div>

          <!-- Tactical Minimap & Camera Scrubber -->
          <div class="wr-minimap-wrap" title="点击或拖动可快速移动战区视角（也可用滚轮或 W/S 键）">
            <canvas id="wr-minimap" width="60" height="196"></canvas>
            <span class="wr-minimap-hint">视角</span>
          </div>

          <!-- Offscreen Keep Warning -->
          <button type="button" id="wr-offscreen-warn" class="wr-offscreen-warn" style="display:none;" title="点击回防主基地">
            <img src="./r/hud/CombatHUD_Tex_OffscreenIndicator.webp" alt="" />
            <span>敌军逼近主基地</span>
          </button>

          <!-- Bottom Card Tray Overlay -->
          <div class="wr-hud-bottom">
            <div class="wr-gold-hud">
              <div class="wr-gold-nugget-badge">
                <img src="./r/hud/CombatHUD_Tex_GoldNugget.webp" alt="金" />
                <span id="wr-gold-val">4</span>
              </div>
              <div id="wr-gold-bars" class="wr-gold-nugget-track">
                ${Array.from(
                  { length: 10 },
                  () => `<div class="wr-gold-seg"><div class="wr-gold-seg-fill" style="width:0%"></div></div>`
                ).join('')}
              </div>
            </div>
            <div id="wr-hand-row" class="wr-hand-row-3d"></div>
          </div>
        </div>
      </div>
    `;

    this.canvas = this.root.querySelector('#wr-battle-canvas');
    this.minimapCanvas = this.root.querySelector('#wr-minimap');
    this.overlaysEl = this.root.querySelector('#wr-world-overlays');
    this.renderer = new BattleRenderer3D(this.canvas);

    this._bindControls();
    this._syncHandUI(true);
    this._syncHudUI();

    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    this.lastFrameMs = performance.now();
    this.rafId = requestAnimationFrame((now) => this._loop(now));
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    this._hpOverlayPool.clear();
    this._textOverlayPool.clear();
    this.renderer?.destroy?.();
    this.modalRoot.classList.remove('open');
  }

  _bindControls() {
    this.root.querySelector('#wr-auto-btn').addEventListener('click', () => {
      this.autopilot = !this.autopilot;
      const btn = this.root.querySelector('#wr-auto-btn');
      btn.textContent = this.autopilot ? '托管中' : 'AI 托管';
      btn.classList.toggle('active', this.autopilot);
      this.onToast?.(this.autopilot ? '已开启战术 AI 托管（仍可随时手动操作）' : '已切换回手动操作');
    });

    this.root.querySelector('#wr-speed-btn').addEventListener('click', () => {
      const order = [1, 1.5, 2];
      this.speedMult = order[(order.indexOf(this.speedMult) + 1) % order.length];
      this.root.querySelector('#wr-speed-btn').textContent = `${this.speedMult}x`;
    });

    const togglePause = () => {
      this.paused = !this.paused;
      const img = this.root.querySelector('#wr-pause-btn img');
      if (img) {
        img.src = this.paused ? './r/hud/CombatHUD_Tex_IconPlay.webp' : './r/hud/CombatHUD_Tex_IconPause.webp';
      }
    };
    this.root.querySelector('#wr-pause-btn').addEventListener('click', togglePause);

    this.root.querySelector('#wr-restart-btn').addEventListener('click', () => {
      this.modalRoot.classList.remove('open');
      this.sim = new CombatSimulation({
        deck: this.deck,
        playerLevelDelta: this.difficulty.playerLevelDelta,
        enemyLevelDelta: this.difficulty.enemyLevelDelta,
        seed: (Date.now() + 1337) & 0x7fffffff,
      });
      this.paused = false;
      this.outcomeRecorded = false;
      this.selectedSlot = null;
      this._hpOverlayPool.clear();
      this._textOverlayPool.clear();
      if (this.overlaysEl) this.overlaysEl.innerHTML = '';
      this.renderer?.setFocusZ(16);
      const img = this.root.querySelector('#wr-pause-btn img');
      if (img) img.src = './r/hud/CombatHUD_Tex_IconPause.webp';
      this._syncHandUI(true);
    });

    this.root.querySelector('#wr-exit-btn').addEventListener('click', () => {
      this.destroy();
      this.onExitLobby();
    });

    this.root.querySelector('#wr-offscreen-warn')?.addEventListener('click', () => {
      this.renderer?.setFocusZ(10);
    });

    const getWorldPos = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      return this.renderer.screenToWorld(clientX - rect.left, clientY - rect.top);
    };

    // Wheel scroll pans camera north/south across the 56x114 cavern
    this.canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.renderer.panByDeltaZ(-e.deltaY * 0.05);
      },
      { passive: false }
    );

    this.canvas.addEventListener('pointerdown', (e) => {
      if (this.selectedSlot != null) {
        const world = getWorldPos(e.clientX, e.clientY);
        this.hoverWorld = world;
        const res = this.sim.deployCard(this.selectedSlot, world.x, world.z);
        if (res.ok) {
          this.selectedSlot = null;
          this._syncHandUI(true);
        } else {
          const hitSwitchId = this.renderer.findSwitchAtWorld(this.sim, world.x, world.z);
          if (hitSwitchId) {
            const dir = this.sim.toggleSwitch(hitSwitchId);
            this.onToast?.(`道岔已切换：${dir === 'left' ? '左路分支' : '右路分支'}`);
          } else {
            this.onToast?.(res.reason || '无法在此位置部署');
          }
        }
        return;
      }

      // Pan battlefield vertically when no card is selected
      this._panning = true;
      this._panMoved = 0;
      this._panLastY = e.clientY;
    });

    this.canvas.addEventListener('pointermove', (e) => {
      this.hoverWorld = getWorldPos(e.clientX, e.clientY);
      if (this._panning) {
        const dy = e.clientY - this._panLastY;
        this._panLastY = e.clientY;
        this._panMoved += Math.abs(dy);
        this.renderer.panByDeltaZ(dy * 0.14);
      }
    });

    this.canvas.addEventListener('pointerup', (e) => {
      if (this._panning) {
        const wasClick = this._panMoved < 8;
        this._panning = false;
        if (wasClick) {
          const world = getWorldPos(e.clientX, e.clientY);
          const hitSwitchId = this.renderer.findSwitchAtWorld(this.sim, world.x, world.z);
          if (hitSwitchId) {
            const dir = this.sim.toggleSwitch(hitSwitchId);
            this.onToast?.(`道岔已切换：${dir === 'left' ? '左路分支' : '右路分支'}`);
          }
        }
      }
    });

    this.canvas.addEventListener('pointerleave', () => {
      this.hoverWorld = null;
      this._panning = false;
    });

    // Support drag-from-hand onto 3D viewport
    window.addEventListener('pointermove', (e) => {
      if (this.draggingSlot != null) {
        const rect = this.canvas.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          this.hoverWorld = getWorldPos(e.clientX, e.clientY);
        }
      }
    });

    window.addEventListener('pointerup', (e) => {
      if (this.draggingSlot == null) return;
      const slot = this.draggingSlot;
      this.draggingSlot = null;
      const rect = this.canvas.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const world = getWorldPos(e.clientX, e.clientY);
        const res = this.sim.deployCard(slot, world.x, world.z);
        if (res.ok) {
          this.selectedSlot = null;
          this._syncHandUI(true);
        } else {
          this.onToast?.(res.reason || '无法在此位置部署');
        }
      }
    });

    // Minimap scrub click & drag
    if (this.minimapCanvas) {
      let scrubbing = false;
      const jumpFromMinimap = (e) => {
        const rect = this.minimapCanvas.getBoundingClientRect();
        const t = 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        const zTarget = -6 + t * 92; // Map vertical range -6..86
        this.renderer.setFocusZ(zTarget);
      };
      this.minimapCanvas.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        scrubbing = true;
        this.minimapCanvas.setPointerCapture?.(e.pointerId);
        jumpFromMinimap(e);
      });
      this.minimapCanvas.addEventListener('pointermove', (e) => {
        if (scrubbing) jumpFromMinimap(e);
      });
      window.addEventListener('pointerup', () => {
        scrubbing = false;
      });
    }
  }

  _handleKeyDown(e) {
    this._keysHeld.add(e.code);
    if (e.key >= '1' && e.key <= '4') {
      const idx = Number(e.key) - 1;
      this.selectedSlot = this.selectedSlot === idx ? null : idx;
      this._syncHandUI(true);
    } else if (e.key === 'Escape') {
      this.selectedSlot = null;
      this._syncHandUI(true);
    } else if (e.key === ' ') {
      e.preventDefault();
      this.paused = !this.paused;
      const img = this.root.querySelector('#wr-pause-btn img');
      if (img) {
        img.src = this.paused ? './r/hud/CombatHUD_Tex_IconPlay.webp' : './r/hud/CombatHUD_Tex_IconPause.webp';
      }
    }
  }

  _loop(now) {
    const dtReal = Math.min(0.1, (now - this.lastFrameMs) / 1000);
    this.lastFrameMs = now;

    // Keyboard smooth camera pan
    if (this._keysHeld.has('KeyW') || this._keysHeld.has('ArrowUp')) {
      this.renderer.panByDeltaZ(42 * dtReal);
    }
    if (this._keysHeld.has('KeyS') || this._keysHeld.has('ArrowDown')) {
      this.renderer.panByDeltaZ(-42 * dtReal);
    }

    if (!this.paused && !this.sim.finished) {
      this.accumSec += dtReal * this.speedMult;
      while (this.accumSec >= TICK_DT) {
        if (this.autopilot) {
          tickPlayerAutopilot(this.sim, TICK_DT);
        }
        this.sim.step(TICK_DT);
        this.accumSec -= TICK_DT;
      }
    }

    while (this.sim.audioQueue.length > 0) {
      sfx.play(this.sim.audioQueue.shift());
    }

    this.renderer.render(this.sim, {
      selectedSlot: this.selectedSlot,
      hoverWorld: this.hoverWorld,
    });

    this._syncWorldOverlays();
    this._drawMinimap();
    this._syncHudUI();
    this._syncHandUI(false);

    if (this.sim.finished && !this.outcomeRecorded) {
      this.outcomeRecorded = true;
      const snap = this.sim.getHudSnapshot();
      this.onBattleFinish?.(snap);
      this._showResultModal(snap);
    }

    this.rafId = requestAnimationFrame((t) => this._loop(t));
  }

  _syncWorldOverlays() {
    if (!this.overlaysEl) return;

    const liveHpKeys = new Set();

    // Structures & damaged/important units get crisp projected HUD health bars
    const trackEntityBar = (key, worldX, worldY, worldZ, hp, maxHp, team, options = {}) => {
      const proj = this.renderer.projectWorldToScreen(worldX, worldY, worldZ);
      if (!proj.visible) return;
      liveHpKeys.add(key);

      let el = this._hpOverlayPool.get(key);
      if (!el) {
        el = document.createElement('div');
        el.className = `wr-world-hp ${team} ${options.isStruct ? 'struct' : ''}`;
        el.innerHTML = `<div class="bar"><div class="fill"></div></div>`;
        this.overlaysEl.appendChild(el);
        this._hpOverlayPool.set(key, el);
      }
      const pct = Math.max(0, Math.min(100, (hp / Math.max(1, maxHp)) * 100));
      el.querySelector('.fill').style.width = `${pct.toFixed(1)}%`;
      el.style.transform = `translate3d(${proj.x.toFixed(1)}px, ${proj.y.toFixed(1)}px, 0) translate(-50%, -100%)`;
    };

    for (const s of this.sim.structures || []) {
      if (s.hp > 0 && !s.rebuilding) {
        trackEntityBar(s.id, s.x, s.kind === 'base' ? 6.2 : 5.4, s.z, s.hp + (s.ragnarosShield || 0), s.maxHp + (s.ragnarosMaxShield || 0), s.team, { isStruct: true });
      }
    }
    for (const c of this.sim.chests || []) {
      if (c.alive && c.hp < c.maxHp) {
        trackEntityBar(c.id, c.x, 3.0, c.z, c.hp, c.maxHp, 'neutral');
      }
    }
    for (const u of this.sim.units || []) {
      if (!u.alive || u.attachedStructureId) continue;
      if (u.hp < u.maxHp || u.spec?.isLeader || u.slug === 'onyxia-warder' || u.isEgg) {
        const yOff = (u.isFlying ? 6.0 : 3.2) * (u.weight === 'heavy' ? 1.15 : 1.0);
        trackEntityBar(u.id, u.x, yOff, u.z, u.hp, u.maxHp, u.team);
      }
    }

    for (const [k, el] of this._hpOverlayPool.entries()) {
      if (!liveHpKeys.has(k)) {
        el.remove();
        this._hpOverlayPool.delete(k);
      }
    }

    // Floating combat texts (gold / phase damage / crits)
    const liveTxtKeys = new Set();
    for (const ft of this.sim.floatingTexts || []) {
      liveTxtKeys.add(ft.id);
      const t = Math.min(1, ft.age / ft.duration);
      const proj = this.renderer.projectWorldToScreen(ft.x, 3.5 + t * 2.4, ft.z);
      if (!proj.visible) continue;

      let el = this._textOverlayPool.get(ft.id);
      if (!el) {
        el = document.createElement('div');
        el.className = 'wr-float-dmg';
        el.textContent = ft.text;
        el.style.color = ft.color || '#fde047';
        this.overlaysEl.appendChild(el);
        this._textOverlayPool.set(ft.id, el);
      }
      el.style.opacity = String((1 - t * t).toFixed(2));
      el.style.transform = `translate3d(${proj.x.toFixed(1)}px, ${proj.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
    }

    for (const [k, el] of this._textOverlayPool.entries()) {
      if (!liveTxtKeys.has(k)) {
        el.remove();
        this._textOverlayPool.delete(k);
      }
    }
  }

  _drawMinimap() {
    const cvs = this.minimapCanvas;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const w = cvs.width;
    const h = cvs.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(18, 13, 18, 0.88)';
    ctx.fillRect(0, 0, w, h);

    // Map arena x: [-28..+28], z: [-10..+88]
    const toMX = (x) => ((x + 28) / 56) * w;
    const toMY = (z) => h - ((z + 10) / 98) * h;

    // Lava obstacles
    ctx.fillStyle = 'rgba(234, 88, 12, 0.45)';
    for (const obs of UNWALKABLE_OBSTACLES) {
      ctx.beginPath();
      ctx.ellipse(toMX(obs.cx), toMY(obs.cz), (obs.rx / 56) * w, (obs.rz / 98) * h, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mines
    ctx.fillStyle = '#facc15';
    for (const m of this.sim.mines || []) {
      if (m.gold > 0) {
        ctx.fillRect(toMX(m.x) - 2, toMY(m.z) - 2, 4, 4);
      }
    }

    // Structures
    for (const s of this.sim.structures || []) {
      if (s.hp <= 0 && !s.rebuilding) continue;
      ctx.fillStyle = s.team === 'player' ? '#38bdf8' : '#ef4444';
      const r = s.kind === 'base' ? 4.5 : 3.2;
      ctx.beginPath();
      ctx.arc(toMX(s.x), toMY(s.z), r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Units
    for (const u of this.sim.units || []) {
      if (!u.alive) continue;
      ctx.fillStyle = u.team === 'player' ? '#7dd3fc' : '#fca5a5';
      ctx.fillRect(toMX(u.x) - 1.5, toMY(u.z) - 1.5, 3, 3);
    }

    // Onyxia
    if (this.sim.boss?.alive) {
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(toMX(ONYXIA_POS.x), toMY(ONYXIA_POS.z), 5.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Camera viewport box around focusZ
    const fz = this.renderer.getFocusZ();
    const viewTopY = toMY(fz + 21);
    const viewBotY = toMY(fz - 16);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(2, Math.max(1, viewTopY), w - 4, Math.max(16, viewBotY - viewTopY));
  }

  _syncHudUI() {
    const snap = this.sim.getHudSnapshot();

    const moodImg = this.root.querySelector('#wr-boss-mood');
    const desiredMood =
      snap.bossPhase === 3
        ? './r/onyxia/Onyxia_Angry.webp'
        : snap.bossPhase === 2
        ? './r/onyxia/Onyxia_Annoyed.webp'
        : './r/onyxia/Onyxia_Smug.webp';
    if (moodImg && !moodImg.src.endsWith(desiredMood.slice(2))) {
      moodImg.src = desiredMood;
    }

    const pBadge = this.root.querySelector('#wr-boss-phase-badge');
    if (pBadge) pBadge.textContent = `P${snap.bossPhase}`;

    const hpText = this.root.querySelector('#wr-boss-hp-text');
    if (hpText) {
      hpText.textContent = `${Math.max(0, snap.bossHp).toLocaleString()} / ${snap.bossMaxHp.toLocaleString()} (${snap.bossHpPct.toFixed(1)}%)`;
    }
    const hpFill = this.root.querySelector('#wr-boss-hp-fill');
    if (hpFill) {
      hpFill.style.width = `${Math.max(0, Math.min(100, snap.bossHpPct))}%`;
    }

    const timerEl = this.root.querySelector('#wr-match-timer');
    if (timerEl) {
      timerEl.textContent = `${snap.inOvertime ? '加时 ' : ''}${formatClock(snap.remainingSec)}`;
      timerEl.classList.toggle('overtime', snap.inOvertime);
    }

    const eggEl = this.root.querySelector('#wr-egg-timer');
    if (eggEl) {
      eggEl.textContent = snap.nextEggSec != null ? `龙蛋 ${formatClock(snap.nextEggSec)}` : '龙蛋已结束';
    }

    const traitsEl = this.root.querySelector('#wr-boss-traits');
    if (traitsEl) {
      let html = '';
      if (snap.bossResistant) html += `<img src="./r/hud/UnitOwnership_MagicFrame.webp" title="元素抗性" alt="抗性" />`;
      if (snap.bossArmored) html += `<img src="./r/hud/UnitOwnership_ArmorFrame.webp" title="物理护甲" alt="护甲" />`;
      traitsEl.innerHTML = html;
    }

    const bannerEl = this.root.querySelector('#wr-battle-banner');
    if (bannerEl) {
      if (this.sim.banner?.timer > 0) {
        bannerEl.style.display = '';
        bannerEl.textContent = this.sim.banner.text;
      } else {
        bannerEl.style.display = 'none';
      }
    }

    const tauntEl = this.root.querySelector('#wr-boss-taunt');
    if (tauntEl) {
      if (snap.bossTaunt?.timer > 0 && snap.bossTaunt.text) {
        tauntEl.style.display = '';
        tauntEl.textContent = `“${snap.bossTaunt.text}”`;
      } else {
        tauntEl.style.display = 'none';
      }
    }

    // Offscreen Keep threat check
    const warnEl = this.root.querySelector('#wr-offscreen-warn');
    if (warnEl) {
      const fz = this.renderer.getFocusZ();
      const nearBase = this.sim.units.some((u) => u.alive && u.team === 'enemy' && !u.isEgg && u.z < 20);
      warnEl.style.display = nearBase && fz > 32 ? '' : 'none';
    }

    const goldVal = this.root.querySelector('#wr-gold-val');
    if (goldVal) goldVal.textContent = String(Math.floor(snap.playerGold));

    const segs = this.root.querySelectorAll('#wr-gold-bars .wr-gold-seg-fill');
    segs.forEach((seg, i) => {
      const fill = Math.max(0, Math.min(1, snap.playerGold - i));
      seg.style.width = `${(fill * 100).toFixed(1)}%`;
    });
  }

  _syncHandUI(forceRebuild) {
    const handRow = this.root.querySelector('#wr-hand-row');
    if (!handRow) return;

    const handKey = `${this.sim.hand.map((c) => `${c.slug}:${c.talentIndex}`).join('|')}>${this.sim.nextCard?.slug}|sel=${this.selectedSlot}`;
    if (forceRebuild || handKey !== this.lastHandKey) {
      this.lastHandKey = handKey;
      const cardsHtml = this.sim.hand
        .map((c, idx) => {
          const spec = getUnitCombatSpec(c.slug, c.talentIndex, this.difficulty.playerLevelDelta);
          const affordable = this.sim.playerGold >= spec.cost;
          const selected = this.selectedSlot === idx;
          return `
            <button type="button" class="wr-hand-card-3d ${selected ? 'selected' : ''} ${affordable ? '' : 'unaffordable'}" data-hand-slot="${idx}">
              <div class="wr-hud-cost">${spec.cost}</div>
              <img class="wr-hud-mini-spr" src="${esc(normalizeAssetPath(spec.sprite))}" alt="${esc(spec.nameZh)}" />
              <span class="nm">${esc(spec.nameZh)}</span>
              <span class="key-hint">${idx + 1}</span>
            </button>
          `;
        })
        .join('');

      const nextSpec = this.sim.nextCard
        ? getUnitCombatSpec(this.sim.nextCard.slug, this.sim.nextCard.talentIndex, this.difficulty.playerLevelDelta)
        : null;

      handRow.innerHTML = `
        ${cardsHtml}
        <div class="wr-next-card-3d">
          <span class="lbl">下张</span>
          ${nextSpec ? `<img src="${esc(normalizeAssetPath(nextSpec.sprite))}" alt="${esc(nextSpec.nameZh)}" /><span>${nextSpec.cost}金</span>` : ''}
        </div>
      `;

      handRow.querySelectorAll('[data-hand-slot]').forEach((btn) => {
        const idx = Number(btn.dataset.handSlot);
        btn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          this.draggingSlot = idx;
          this.selectedSlot = idx;
          this._syncHandUI(true);
        });
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      });
    } else {
      handRow.querySelectorAll('[data-hand-slot]').forEach((btn) => {
        const idx = Number(btn.dataset.handSlot);
        const spec = this.sim.getHandCardSpec(idx);
        if (spec) {
          btn.classList.toggle('unaffordable', this.sim.playerGold < spec.cost);
        }
      });
    }
  }

  _showResultModal(snap) {
    const topDamage = snap.damageStats[0]?.totalDamage || 1;
    const totalPlayerDmg = snap.damageStats.reduce((sum, d) => sum + d.totalDamage, 0);
    const duration = Math.max(1, snap.elapsedTime);

    this.modalRoot.classList.add('open');
    this.modalRoot.innerHTML = `
      <div class="wr-panel wr-modal-box" style="max-width:540px;">
        <div style="text-align:center;margin-bottom:12px;">
          <img src="${snap.victory ? './r/onyxia/Onyxia_Angry.webp' : './r/onyxia/Onyxia_Smug.webp'}" alt="" style="width:72px;height:72px;border-radius:12px;border:2px solid ${snap.victory ? '#22c55e' : '#ef4444'};margin:0 auto 8px;" />
          <h2 style="margin:0;font-family:var(--font-display);color:${snap.victory ? '#4ade80' : '#f87171'};">
            ${snap.victory ? '胜利！奥妮克希亚已被击败' : '挑战失败'}
          </h2>
          <p style="margin:4px 0 0;font-size:13px;color:#d6cfc6;">
            ${snap.victory ? `通关用时 ${formatClock(snap.elapsedTime)} · 全阶段击杀` : `${esc(snap.defeatReason || '防线失守')} · Boss剩余血量 ${snap.bossHpPct.toFixed(1)}% (P${snap.bossPhase})`}
          </p>
        </div>

        <div class="wr-panel-inset" style="margin-bottom:12px;">
          <div style="font-weight:700;color:#ffe7ad;margin-bottom:6px;">
            全队伤害贡献榜（总输出 ${totalPlayerDmg.toLocaleString()} · 秒伤 ${Math.round(totalPlayerDmg / duration)}）
          </div>
          ${
            snap.damageStats.length
              ? snap.damageStats
                  .slice(0, 8)
                  .map((d) => {
                    const w = Math.max(4, Math.round((d.totalDamage / topDamage) * 100));
                    return `
                    <div class="wr-dmg-row">
                      <img src="${esc(normalizeAssetPath(d.sprite))}" alt="" style="width:26px;height:26px;object-fit:contain;" />
                      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(d.nameZh)}</span>
                      <div class="wr-dmg-track"><div class="wr-dmg-fill" style="width:${w}%;"></div></div>
                      <span style="text-align:right;font-family:var(--font-numbers);color:#fde68a;">${d.totalDamage.toLocaleString()}</span>
                    </div>
                  `;
                  })
                  .join('')
              : '<div style="color:#9b938b;font-size:12px;">本局暂无伤害统计</div>'
          }
        </div>

        <div style="display:flex;gap:8px;justify-content:center;">
          <button type="button" class="wr-btn green" id="wr-res-retry">再战一局</button>
          <button type="button" class="wr-btn" id="wr-res-lobby">返回整备大厅</button>
        </div>
      </div>
    `;

    this.modalRoot.querySelector('#wr-res-retry')?.addEventListener('click', () => {
      this.root.querySelector('#wr-restart-btn')?.click();
    });
    this.modalRoot.querySelector('#wr-res-lobby')?.addEventListener('click', () => {
      this.destroy();
      this.onExitLobby();
    });
  }
}

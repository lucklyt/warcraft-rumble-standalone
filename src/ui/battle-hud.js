import { CombatSimulation, TICK_DT } from '../engine/combat-sim.js';
import { ONYXIA_POS, UNWALKABLE_OBSTACLES } from '../engine/onyxia-map.js';
import { tickPlayerAutopilot } from '../engine/player-autopilot.js';
import {
  MINI_BY_SLUG,
  getEquippedTalent,
  getUnitCombatSpec,
  resolveMiniSprite,
  resolveStatueBase,
} from '../engine/unit-stats.js';
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
    this.mission = options.mission;
    this.difficulty = options.difficulty;
    this.deckName = options.deckName;
    this.onExitLobby = options.onExitLobby;
    this.onBattleFinish = options.onBattleFinish;
    this.onToast = options.onToast;

    this.sim = this._createSim(Date.now() & 0x7fffffff);

    this.speedMult = 1;
    this.matchStarted = false;
    this.paused = true; // Paused behind Start Plunger until player clicks 开始
    this.pauseModalOpen = false;
    this.autopilot = false;
    this.selectedSlot = null;
    this.hoverWorld = null;
    this.rafId = null;
    this.lastFrameMs = 0;
    this.accumSec = 0;
    this.outcomeRecorded = false;
    this.lastHandKey = '';

    this._dragState = null;
    this._canvasGesture = null;
    this._panning = false;
    this._keysHeld = new Set();
    this._minimapOpen = false;

    this._hpOverlayPool = new Map();
    this._textOverlayPool = new Map();

    this._onKeyDown = this._handleKeyDown.bind(this);
    this._onKeyUp = (e) => this._keysHeld.delete(e.code);
    this._onWinPointerMove = this._handleWindowPointerMove.bind(this);
    this._onWinPointerUp = this._handleWindowPointerUp.bind(this);
  }

  _createSim(seed) {
    return new CombatSimulation({
      deck: this.deck,
      missionId: this.mission?.id || 'onyxia_lair',
      playerLevelDelta: this.difficulty.playerLevelDelta,
      enemyLevelDelta: this.difficulty.enemyLevelDelta,
      seed,
    });
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

    const playerLeaderImg = `./r/leaders/${this.deck.leader.slug}.webp`;
    const bossPortrait = normalizeAssetPath(this.mission?.bossPortrait || './r/onyxia/Onyxia_Smug.webp');
    const isOnyxia = (this.mission?.id || 'onyxia_lair') === 'onyxia_lair';
    const playerLv = 30 + (this.difficulty?.playerLevelDelta || 0);
    const bossLv = this.mission?.level || 30;

    this.root.innerHTML = `
      <div class="wr-phone-backdrop battle-backdrop">
        <div class="wr-phone-shell battle-shell" id="wr-stage">
          <canvas id="wr-battle-canvas" class="wr-battle-canvas-3d"></canvas>
          <div id="wr-world-overlays" class="wr-world-overlays"></div>
          <div id="wr-offscreen-bubbles" class="wr-offscreen-bubbles"></div>

          <!-- 1. Compact Floating Top Combat Bar (matches real_onyxia_01.jpg 1:1) -->
          <div class="wr-combat-top" id="wr-combat-top">
            <!-- Player Medallion + Blue Keep Bar -->
            <div class="wr-combat-side left">
              <div class="wr-medallion player" title="我方主基地 (Lv.${playerLv})">
                <img class="avatar" src="${esc(playerLeaderImg)}" alt="主将" />
                <img class="frame" src="./r/hud/CombatHUD_Tex_AvatarFrame.webp" alt="" />
              </div>
              <div class="wr-hp-bar-track player" title="我方基地血量">
                <img id="wr-base-hp-fill" class="wr-hp-bar-fill-img" src="./r/hud/CombatHUD_Tex_PlayerPanel_MeterFill.webp" alt="" style="width:100%;" />
                <span id="wr-base-hp-text" class="wr-hp-bar-num">5,800</span>
              </div>
            </div>

            <!-- Center Timer & Orange Pause Button -->
            <div class="wr-combat-center">
              <div class="wr-stone-timer">
                <span id="wr-match-timer">6:00</span>
              </div>
              <button type="button" class="wr-orange-pause-btn" id="wr-pause-btn" title="暂停菜单 (Space)">
                <img src="./r/hud/CombatHUD_Tex_IconPause.webp" alt="暂停" />
              </button>
            </div>

            <!-- Boss Red HP Bar (with 2 phase markers at 40% & 70%) + Boss Medallion -->
            <div class="wr-combat-side right">
              <div class="wr-hp-bar-track enemy" title="${esc(this.mission?.nameZh || '首领')} (Lv.${bossLv})">
                <img id="wr-boss-hp-fill" class="wr-hp-bar-fill-img" src="./r/hud/CombatHUD_Tex_PlayerPanel_MeterFill_Enemy.webp" alt="" style="width:100%;" />
                ${isOnyxia ? `<div class="wr-phase-tri" style="left:40%;"></div><div class="wr-phase-tri" style="left:70%;"></div>` : ''}
                <span id="wr-boss-hp-text" class="wr-hp-bar-num">18,000</span>
              </div>
              <div class="wr-medallion boss">
                <img id="wr-boss-mood" class="avatar" src="${esc(bossPortrait)}" alt="${esc(this.mission?.nameZh)}" />
                <img class="frame" src="./r/hud/CombatHUD_Tex_AvatarFrame.webp" alt="" />
                <div class="wr-boss-subbadges">
                  <span id="wr-boss-phase-badge" class="phase">${isOnyxia ? 'P1' : ''}</span>
                  <span id="wr-boss-traits" class="traits"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Unobtrusive Corner Tactical Controls -->
          <div class="wr-combat-aux" id="wr-combat-aux">
            <button type="button" class="wr-aux-pill" id="wr-auto-btn">AI 托管</button>
            <button type="button" class="wr-aux-pill" id="wr-speed-btn">1x</button>
            <button type="button" class="wr-aux-pill" id="wr-cam-btn">小地图</button>
            <button type="button" class="wr-aux-pill danger" id="wr-exit-btn">撤退</button>
          </div>

          <div id="wr-boss-taunt" class="wr-boss-taunt" style="display:none;"></div>
          <div id="wr-battle-banner" class="wr-battle-banner" style="display:none;"></div>

          <!-- Collapsible Tactical Minimap -->
          <div class="wr-minimap-wrap" id="wr-minimap-wrap" style="display:none;" title="点击/拖动移动战区视角">
            <canvas id="wr-minimap" width="56" height="184"></canvas>
            <span class="wr-minimap-hint">战区</span>
          </div>

          <!-- Offscreen Keep Warning -->
          <button type="button" id="wr-offscreen-warn" class="wr-offscreen-warn" style="display:none;">
            <img src="./r/hud/CombatHUD_Tex_OffscreenIndicator.webp" alt="" />
            <span>基地受袭！点此回防</span>
          </button>

          <!-- Drag Ghost Overlay -->
          <div id="wr-drag-ghost" class="wr-drag-ghost" style="display:none;">
            <img src="./r/crest.png" alt="" />
            <span id="wr-drag-ghost-label"></span>
          </div>

          <!-- 2. Mechanical Pre-Battle Start Plunger ("开始") -->
          <div id="wr-start-plunger" class="wr-start-plunger">
            <img class="plunger-pillar" src="./r/hud/CombatHUD_Tex_StartButton_Pillar.webp" alt="" />
            <img class="plunger-base" src="./r/hud/CombatHUD_Tex_StartButton_BtnBase.webp" alt="" />
            <button type="button" id="wr-start-battle-btn" class="plunger-btn">
              <img class="btn-frame" src="./r/hud/CombatHUD_Tex_StartButton_Frame.webp" alt="" />
              <img class="btn-cap" id="wr-start-cap-img" src="./r/hud/CombatHUD_Tex_StartButton_Button.webp" alt="开始" />
              <span class="btn-label">开始</span>
            </button>
          </div>

          <!-- 3. Authentic Recessed Stone Card Tray (matches real_onyxia_01.jpg 1:1) -->
          <div class="wr-combat-bottom tray-hidden" id="wr-combat-bottom">
            <div class="wr-tray-shell-inner">
              <!-- Left Lower Step: Next Mini Unpainted Stone Statue -->
              <div class="wr-next-mini-pedestal" id="wr-next-panel">
                <img class="next-pedestal" src="./r/authentic/statue-base-neutral.webp" alt="" />
                <img class="next-fig" id="wr-next-fig" src="./r/crest.png" alt="下张" />
                <div class="next-cost-badge">
                  <img src="./r/hud/CombatHUD_Tex_Statue_Base_HUD_CostFrame.webp" alt="" />
                  <span id="wr-next-cost">0</span>
                </div>
              </div>

              <!-- Main Dark-Stone Box (Bevel + Engraved 1..4 Slots + Gold Meter) -->
              <div class="wr-stone-tray-box">
                <div class="wr-tray-numbers-bar">
                  <span>1</span><span>2</span><span>3</span><span>4</span>
                </div>
                <div id="wr-hand-row" class="wr-hand-pedestal-row"></div>

                <div class="wr-gold-hud-authentic">
                  <div class="wr-gold-plaque">
                    <img src="./r/hud/CombatHUD_Tex_GoldNugget_Highlight.webp" alt="金币" />
                    <span id="wr-gold-val">4</span>
                  </div>
                  <div id="wr-gold-bars" class="wr-gold-ingots-track">
                    ${Array.from(
                      { length: 10 },
                      () => `
                      <div class="wr-gold-pocket">
                        <div class="wr-gold-pocket-fill" style="width:0%"></div>
                        <img class="wr-gold-pocket-nugget" src="./r/hud/CombatHUD_Tex_GoldNugget.webp" alt="" />
                      </div>`
                    ).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.canvas = this.root.querySelector('#wr-battle-canvas');
    this.minimapCanvas = this.root.querySelector('#wr-minimap');
    this.overlaysEl = this.root.querySelector('#wr-world-overlays');
    this.bubblesEl = this.root.querySelector('#wr-offscreen-bubbles');
    this.renderer = new BattleRenderer3D(this.canvas);
    this.renderer.setFocusZ(10.5);
    this.renderer.focusZ = 10.5;

    this._bindControls();
    this._syncHandUI(true);
    this._syncHudUI();

    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('pointermove', this._onWinPointerMove);
    window.addEventListener('pointerup', this._onWinPointerUp);

    this.lastFrameMs = performance.now();
    this.rafId = requestAnimationFrame((now) => this._loop(now));
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('pointermove', this._onWinPointerMove);
    window.removeEventListener('pointerup', this._onWinPointerUp);
    this._hpOverlayPool.clear();
    this._textOverlayPool.clear();
    this.renderer?.destroy?.();
    this.modalRoot.classList.remove('open');
  }

  startBattle() {
    if (this.matchStarted) return;
    sfx.play('start');
    const capImg = this.root.querySelector('#wr-start-cap-img');
    if (capImg) capImg.src = './r/hud/CombatHUD_Tex_StartButton_ButtonPress.webp';
    const plunger = this.root.querySelector('#wr-start-plunger');
    const tray = this.root.querySelector('#wr-combat-bottom');
    plunger?.classList.add('depressed');

    setTimeout(() => {
      this.matchStarted = true;
      this.paused = false;
      plunger?.classList.add('hidden');
      tray?.classList.remove('tray-hidden');
    }, 180);
  }

  _isPointOnBattlefield(clientX, clientY) {
    if (!this.canvas || !this.matchStarted || this.pauseModalOpen || this.sim.finished) return false;
    const cRect = this.canvas.getBoundingClientRect();
    if (clientX < cRect.left || clientX > cRect.right || clientY < cRect.top || clientY > cRect.bottom) {
      return false;
    }
    const elUnder = document.elementFromPoint(clientX, clientY);
    if (elUnder && elUnder.closest?.('#wr-combat-top, #wr-combat-bottom, #wr-combat-aux, #wr-start-plunger, #wr-minimap-wrap')) {
      return false;
    }
    const botEl = this.root.querySelector('#wr-combat-bottom');
    if (botEl && clientY >= botEl.getBoundingClientRect().top - 2) {
      const bRect = botEl.getBoundingClientRect();
      if (clientX >= bRect.left && clientX <= bRect.right) return false;
    }
    return true;
  }

  _getWorldPos(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return this.renderer.screenToWorld(clientX - rect.left, clientY - rect.top);
  }

  _handleWindowPointerMove(e) {
    if (!this._dragState) return;
    const dx = e.clientX - this._dragState.startX;
    const dy = e.clientY - this._dragState.startY;
    const dist = Math.hypot(dx, dy);

    if (dist >= 14) {
      this._dragState.moved = true;
    }

    const ghost = this.root.querySelector('#wr-drag-ghost');
    if (this._dragState.moved) {
      if (ghost) {
        ghost.style.display = '';
        ghost.style.left = `${e.clientX}px`;
        ghost.style.top = `${e.clientY}px`;
      }
      if (this._isPointOnBattlefield(e.clientX, e.clientY)) {
        this.hoverWorld = this._getWorldPos(e.clientX, e.clientY);
      } else {
        this.hoverWorld = null;
      }
    }
  }

  _handleWindowPointerUp(e) {
    const drag = this._dragState;
    if (!drag) return;
    this._dragState = null;

    const ghost = this.root.querySelector('#wr-drag-ghost');
    if (ghost) ghost.style.display = 'none';

    if (drag.moved) {
      if (this._isPointOnBattlefield(e.clientX, e.clientY)) {
        const world = this._getWorldPos(e.clientX, e.clientY);
        const res = this.sim.deployCard(drag.slot, world.x, world.z);
        if (res.ok) {
          this.selectedSlot = null;
          this.hoverWorld = null;
          this._syncHandUI(true);
        } else {
          this.onToast?.(res.reason || '请部署在蓝色可部署区域内');
        }
      }
      return;
    }

    // Simple click without drag: toggle slot selection cleanly (clicking same slot again deselects)
    sfx.play('select');
    if (drag.wasSelected) {
      this.selectedSlot = null;
    } else {
      this.selectedSlot = drag.slot;
    }
    this._updateCardSelectionClasses();
  }

  _openPauseModal() {
    this.paused = true;
    this.pauseModalOpen = true;
    this.modalRoot.classList.add('open');
    this.modalRoot.innerHTML = `
      <div class="wr-popup-card">
        <div class="wr-popup-head">
          <strong>战斗已暂停 · ${esc(this.mission?.nameZh || '')}</strong>
          <button type="button" class="wr-popup-close" id="wr-p-resume">继续</button>
        </div>
        <div class="wr-pause-menu">
          <button type="button" class="wr-gbtn green" id="wr-p-resume-main">继续战斗</button>
          <button type="button" class="wr-gbtn blue" id="wr-p-auto">${this.autopilot ? '关闭 AI 托管' : '开启 AI 托管'}</button>
          <div class="wr-pause-cam-row">
            <button type="button" class="wr-diff-chip" data-cam-z="13">我方基地</button>
            <button type="button" class="wr-diff-chip" data-cam-z="38">中路哨塔</button>
            <button type="button" class="wr-diff-chip" data-cam-z="64">首领王座</button>
          </div>
          <button type="button" class="wr-gbtn gold" id="wr-p-restart">重新开始</button>
          <button type="button" class="wr-gbtn red" id="wr-p-exit">退出并返回地图</button>
        </div>
      </div>
    `;

    const closeModal = () => {
      this.pauseModalOpen = false;
      if (this.matchStarted && !this.sim.finished) this.paused = false;
      this.modalRoot.classList.remove('open');
      this.modalRoot.innerHTML = '';
    };

    this.modalRoot.querySelector('#wr-p-resume')?.addEventListener('click', closeModal);
    this.modalRoot.querySelector('#wr-p-resume-main')?.addEventListener('click', closeModal);
    this.modalRoot.querySelector('#wr-p-auto')?.addEventListener('click', () => {
      this.root.querySelector('#wr-auto-btn')?.click();
      closeModal();
    });
    this.modalRoot.querySelectorAll('[data-cam-z]').forEach((b) => {
      b.addEventListener('click', () => {
        this.renderer?.setFocusZ(Number(b.dataset.camZ));
        closeModal();
      });
    });
    this.modalRoot.querySelector('#wr-p-restart')?.addEventListener('click', () => {
      closeModal();
      this._restartBattle();
    });
    this.modalRoot.querySelector('#wr-p-exit')?.addEventListener('click', () => {
      this.destroy();
      this.onExitLobby();
    });
  }

  _restartBattle() {
    this.modalRoot.classList.remove('open');
    this.modalRoot.innerHTML = '';
    this.sim = this._createSim((Date.now() + 1337) & 0x7fffffff);
    this.paused = false;
    this.matchStarted = true;
    this.pauseModalOpen = false;
    this.outcomeRecorded = false;
    this.selectedSlot = null;
    this.hoverWorld = null;
    this._hpOverlayPool.clear();
    this._textOverlayPool.clear();
    if (this.overlaysEl) this.overlaysEl.innerHTML = '';
    this.root.querySelector('#wr-start-plunger')?.classList.add('hidden');
    this.root.querySelector('#wr-combat-bottom')?.classList.remove('tray-hidden');
    this.renderer?.setFocusZ(10.5);
    this._syncHandUI(true);
  }

  _bindControls() {
    this.root.querySelector('#wr-start-battle-btn')?.addEventListener('click', () => this.startBattle());

    this.root.querySelector('#wr-auto-btn').addEventListener('click', () => {
      this.autopilot = !this.autopilot;
      const btn = this.root.querySelector('#wr-auto-btn');
      btn.textContent = this.autopilot ? '托管中' : 'AI 托管';
      btn.classList.toggle('active', this.autopilot);
      this.onToast?.(this.autopilot ? '已开启 AI 战术托管（可随时点击战场手动放兵）' : '已切换回手动操作');
    });

    this.root.querySelector('#wr-speed-btn').addEventListener('click', () => {
      const order = [1, 1.5, 2];
      this.speedMult = order[(order.indexOf(this.speedMult) + 1) % order.length];
      this.root.querySelector('#wr-speed-btn').textContent = `${this.speedMult}x`;
    });

    this.root.querySelector('#wr-cam-btn').addEventListener('click', () => {
      this._minimapOpen = !this._minimapOpen;
      const wrap = this.root.querySelector('#wr-minimap-wrap');
      if (wrap) wrap.style.display = this._minimapOpen ? '' : 'none';
    });

    this.root.querySelector('#wr-pause-btn').addEventListener('click', () => {
      if (!this.matchStarted) {
        this.startBattle();
        return;
      }
      this._openPauseModal();
    });

    this.root.querySelector('#wr-exit-btn').addEventListener('click', () => {
      this.destroy();
      this.onExitLobby();
    });

    this.root.querySelector('#wr-offscreen-warn')?.addEventListener('click', () => {
      this.renderer?.setFocusZ(10.5);
    });

    this.canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.renderer.panByDeltaZ(-e.deltaY * 0.05);
      },
      { passive: false }
    );

    this.canvas.addEventListener('pointerdown', (e) => {
      this._canvasGesture = {
        startX: e.clientX,
        startY: e.clientY,
        lastY: e.clientY,
        moved: 0,
      };
      this._panning = true;
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (this.selectedSlot != null && this._isPointOnBattlefield(e.clientX, e.clientY)) {
        this.hoverWorld = this._getWorldPos(e.clientX, e.clientY);
      } else {
        this.hoverWorld = null;
      }

      if (this._panning && this._canvasGesture) {
        const dy = e.clientY - this._canvasGesture.lastY;
        const dx = e.clientX - this._canvasGesture.startX;
        this._canvasGesture.lastY = e.clientY;
        this._canvasGesture.moved = Math.max(
          this._canvasGesture.moved,
          Math.hypot(dx, e.clientY - this._canvasGesture.startY)
        );
        if (this._canvasGesture.moved > 8) {
          this.renderer.panByDeltaZ(dy * 0.14);
        }
      }
    });

    this.canvas.addEventListener('pointerup', (e) => {
      const g = this._canvasGesture;
      this._panning = false;
      this._canvasGesture = null;
      if (!g || g.moved >= 10) return;

      if (!this._isPointOnBattlefield(e.clientX, e.clientY)) return;
      const world = this._getWorldPos(e.clientX, e.clientY);

      if (this.selectedSlot != null) {
        const res = this.sim.deployCard(this.selectedSlot, world.x, world.z);
        if (res.ok) {
          this.selectedSlot = null;
          this.hoverWorld = null;
          this._syncHandUI(true);
        } else {
          const hitSwitchId = this.renderer.findSwitchAtWorld(this.sim, world.x, world.z);
          if (hitSwitchId) {
            const dir = this.sim.toggleSwitch(hitSwitchId);
            this.onToast?.(`道岔已切换：${dir === 'left' ? '左路分支' : '右路分支'}`);
          } else {
            this.onToast?.(res.reason || '请部署在蓝色部署网格内');
          }
        }
      } else {
        const hitSwitchId = this.renderer.findSwitchAtWorld(this.sim, world.x, world.z);
        if (hitSwitchId) {
          const dir = this.sim.toggleSwitch(hitSwitchId);
          this.onToast?.(`道岔已切换：${dir === 'left' ? '左路分支' : '右路分支'}`);
        }
      }
    });

    this.canvas.addEventListener('pointerleave', () => {
      if (!this._dragState) this.hoverWorld = null;
      this._panning = false;
      this._canvasGesture = null;
    });

    if (this.minimapCanvas) {
      let scrubbing = false;
      const jumpFromMinimap = (e) => {
        const rect = this.minimapCanvas.getBoundingClientRect();
        const t = 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        const zTarget = 10 + t * 58;
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
    if (e.key >= '1' && e.key <= '4' && this.matchStarted) {
      const idx = Number(e.key) - 1;
      sfx.play('select');
      this.selectedSlot = this.selectedSlot === idx ? null : idx;
      this._updateCardSelectionClasses();
    } else if (e.key === 'Escape') {
      this.selectedSlot = null;
      this._updateCardSelectionClasses();
    } else if (e.key === ' ') {
      e.preventDefault();
      if (!this.matchStarted) {
        this.startBattle();
      } else if (!this.pauseModalOpen) {
        this._openPauseModal();
      }
    }
  }

  _loop(now) {
    const dtReal = Math.min(0.1, (now - this.lastFrameMs) / 1000);
    this.lastFrameMs = now;

    if (this._keysHeld.has('KeyW') || this._keysHeld.has('ArrowUp')) {
      this.renderer.panByDeltaZ(42 * dtReal);
    }
    if (this._keysHeld.has('KeyS') || this._keysHeld.has('ArrowDown')) {
      this.renderer.panByDeltaZ(-42 * dtReal);
    }

    if (this.matchStarted && !this.paused && !this.sim.finished) {
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
      selectedSlot: this.matchStarted ? this.selectedSlot : null,
      hoverWorld: this.hoverWorld,
    });

    this._syncWorldOverlays();
    this._syncOffscreenBubbles();
    if (this._minimapOpen) this._drawMinimap();
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
    const playerLv = 30 + (this.difficulty?.playerLevelDelta || 0);
    const enemyLv = this.mission?.level || 30;

    const trackEntityBar = (key, worldX, worldY, worldZ, hp, maxHp, team, options = {}) => {
      const proj = this.renderer.projectWorldToScreen(worldX, worldY, worldZ);
      if (!proj.visible) return;
      liveHpKeys.add(key);

      const damaged = hp < maxHp - 1;
      let el = this._hpOverlayPool.get(key);
      if (!el) {
        el = document.createElement('div');
        el.innerHTML = `
          ${options.isBase ? `<img class="wing-bg" src="./r/hud/UnitHealthMeter_BaseBG.webp" alt="" />` : ''}
          <span class="lv-num">${options.lv || playerLv}</span>
          <div class="bar"><div class="fill"></div></div>
        `;
        this.overlaysEl.appendChild(el);
        this._hpOverlayPool.set(key, el);
      }
      el.className = `wr-world-hp ${team} ${options.isStruct ? 'struct' : ''} ${options.isBase ? 'keep-wing' : ''} ${damaged ? 'damaged' : 'full'}`;
      const lvEl = el.querySelector('.lv-num');
      if (lvEl) lvEl.textContent = String(options.lv || (team === 'player' ? playerLv : enemyLv));
      const pct = Math.max(0, Math.min(100, (hp / Math.max(1, maxHp)) * 100));
      el.querySelector('.fill').style.width = `${pct.toFixed(1)}%`;
      el.style.transform = `translate3d(${proj.x.toFixed(1)}px, ${proj.y.toFixed(1)}px, 0) translate(-50%, -100%)`;
    };

    for (const s of this.sim.structures || []) {
      if (s.hp > 0 && !s.rebuilding) {
        trackEntityBar(
          s.id,
          s.x,
          s.kind === 'base' ? 5.6 : 5.0,
          s.z,
          s.hp + (s.ragnarosShield || 0),
          s.maxHp + (s.ragnarosMaxShield || 0),
          s.team,
          { isStruct: true, isBase: s.kind === 'base', lv: s.team === 'player' ? playerLv : enemyLv }
        );
      }
    }
    for (const c of this.sim.chests || []) {
      if (c.alive && c.hp < c.maxHp) {
        trackEntityBar(c.id, c.x, 3.0, c.z, c.hp, c.maxHp, 'neutral', { lv: 1 });
      }
    }
    for (const u of this.sim.units || []) {
      if (!u.alive || u.attachedStructureId) continue;
      const yOff = (u.isFlying ? 5.2 : 2.9) * (u.weight === 'heavy' ? 1.15 : 1.0);
      trackEntityBar(u.id, u.x, yOff, u.z, u.hp, u.maxHp, u.team, {
        lv: u.team === 'player' ? playerLv : enemyLv,
      });
    }

    for (const [k, el] of this._hpOverlayPool.entries()) {
      if (!liveHpKeys.has(k)) {
        el.remove();
        this._hpOverlayPool.delete(k);
      }
    }

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

  _syncOffscreenBubbles() {
    if (!this.bubblesEl || !this.matchStarted) return;
    const fz = this.renderer.getFocusZ();
    const { w } = this.renderer.ensureSize();

    // Group non-egg offscreen enemy threats above viewport (z > fz + 23)
    const offTop = [];
    for (const u of this.sim.units || []) {
      if (!u.alive || u.team !== 'enemy' || u.isEgg) continue;
      if (u.z > fz + 23) {
        // Dedup horizontally nearby enemies so max ~3 bubbles show
        if (!offTop.some((other) => Math.abs(other.x - u.x) < 5.5 && other.slug === u.slug)) {
          offTop.push(u);
        }
      }
    }

    const shown = offTop.slice(0, 3);
    if (shown.length === 0) {
      if (this.bubblesEl.childElementCount > 0) this.bubblesEl.innerHTML = '';
      return;
    }

    this.bubblesEl.innerHTML = shown
      .map((u) => {
        const proj = this.renderer.projectWorldToScreen(u.x, 2, fz + 18);
        const clampedX = Math.max(46, Math.min(w - 46, proj.x || w * 0.5));
        return `
          <button type="button" class="wr-offscreen-bubble" style="left:${clampedX.toFixed(1)}px;" data-focus-z="${Math.round(u.z - 10)}" title="点击查看上方敌军">
            <img class="ring" src="./r/hud/CombatHUD_Tex_OffscreenIndicator.webp" alt="" />
            <img class="portrait" src="${esc(normalizeAssetPath(resolveMiniSprite(u.slug)))}" alt="" />
          </button>
        `;
      })
      .join('');

    this.bubblesEl.querySelectorAll('[data-focus-z]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.renderer?.setFocusZ(Number(btn.dataset.focusZ));
      });
    });
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

    const toMX = (x) => ((x + 28) / 56) * w;
    const toMY = (z) => h - ((z + 10) / 98) * h;

    ctx.fillStyle = 'rgba(234, 88, 12, 0.45)';
    for (const obs of UNWALKABLE_OBSTACLES) {
      ctx.beginPath();
      ctx.ellipse(toMX(obs.cx), toMY(obs.cz), (obs.rx / 56) * w, (obs.rz / 98) * h, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#facc15';
    for (const m of this.sim.mines || []) {
      if (m.gold > 0) ctx.fillRect(toMX(m.x) - 2, toMY(m.z) - 2, 4, 4);
    }

    for (const s of this.sim.structures || []) {
      if (s.hp <= 0 && !s.rebuilding) continue;
      ctx.fillStyle = s.team === 'player' ? '#38bdf8' : '#ef4444';
      const r = s.kind === 'base' ? 4.5 : 3.2;
      ctx.beginPath();
      ctx.arc(toMX(s.x), toMY(s.z), r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const u of this.sim.units || []) {
      if (!u.alive) continue;
      ctx.fillStyle = u.team === 'player' ? '#7dd3fc' : '#fca5a5';
      ctx.fillRect(toMX(u.x) - 1.5, toMY(u.z) - 1.5, 3, 3);
    }

    if (this.sim.boss?.alive) {
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(toMX(ONYXIA_POS.x), toMY(ONYXIA_POS.z), 5.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const fz = this.renderer.getFocusZ();
    const viewTopY = toMY(fz + 23);
    const viewBotY = toMY(fz - 20);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(2, Math.max(1, viewTopY), w - 4, Math.max(16, viewBotY - viewTopY));
  }

  _syncHudUI() {
    const snap = this.sim.getHudSnapshot();
    const isOnyxia = (this.mission?.id || 'onyxia_lair') === 'onyxia_lair';

    if (isOnyxia) {
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
    }

    const base = this.sim.structures?.find((s) => s.id === 'player-base');
    if (base) {
      const bText = this.root.querySelector('#wr-base-hp-text');
      const bFill = this.root.querySelector('#wr-base-hp-fill');
      if (bText) bText.textContent = Math.max(0, Math.round(base.hp)).toLocaleString();
      if (bFill) bFill.style.width = `${Math.max(0, Math.min(100, (base.hp / Math.max(1, base.maxHp)) * 100))}%`;
    }

    const hpText = this.root.querySelector('#wr-boss-hp-text');
    if (hpText) hpText.textContent = Math.max(0, Math.round(snap.bossHp)).toLocaleString();
    const hpFill = this.root.querySelector('#wr-boss-hp-fill');
    if (hpFill) hpFill.style.width = `${Math.max(0, Math.min(100, snap.bossHpPct))}%`;

    const timerEl = this.root.querySelector('#wr-match-timer');
    if (timerEl) {
      timerEl.textContent = `${snap.inOvertime ? '加时 ' : ''}${formatClock(snap.remainingSec)}`;
      timerEl.classList.toggle('overtime', snap.inOvertime);
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
      if (this.matchStarted && this.sim.banner?.timer > 0) {
        bannerEl.style.display = '';
        bannerEl.textContent = this.sim.banner.text;
      } else {
        bannerEl.style.display = 'none';
      }
    }

    const tauntEl = this.root.querySelector('#wr-boss-taunt');
    if (tauntEl) {
      if (this.matchStarted && snap.bossTaunt?.timer > 0 && snap.bossTaunt.text) {
        tauntEl.style.display = '';
        tauntEl.textContent = `“${snap.bossTaunt.text}”`;
      } else {
        tauntEl.style.display = 'none';
      }
    }

    const warnEl = this.root.querySelector('#wr-offscreen-warn');
    if (warnEl) {
      const fz = this.renderer.getFocusZ();
      const nearBase = this.sim.units.some((u) => u.alive && u.team === 'enemy' && !u.isEgg && u.z < 20);
      warnEl.style.display = nearBase && fz > 30 ? '' : 'none';
    }

    const goldVal = this.root.querySelector('#wr-gold-val');
    if (goldVal) goldVal.textContent = String(Math.floor(snap.playerGold));

    const pockets = this.root.querySelectorAll('#wr-gold-bars .wr-gold-pocket');
    const whole = Math.floor(snap.playerGold);
    pockets.forEach((pkt, i) => {
      const fillRatio = Math.max(0, Math.min(1, snap.playerGold - i));
      const fillEl = pkt.querySelector('.wr-gold-pocket-fill');
      const nuggetEl = pkt.querySelector('.wr-gold-pocket-nugget');
      if (fillEl) fillEl.style.width = `${(fillRatio * 100).toFixed(1)}%`;
      if (nuggetEl) nuggetEl.style.opacity = i < whole ? '1' : '0.16';
    });
  }

  _updateCardSelectionClasses() {
    const handRow = this.root.querySelector('#wr-hand-row');
    if (!handRow) return;
    handRow.querySelectorAll('[data-hand-slot]').forEach((btn) => {
      const idx = Number(btn.dataset.handSlot);
      const spec = this.sim.getHandCardSpec(idx);
      btn.classList.toggle('selected', this.selectedSlot === idx);
      if (spec) {
        btn.classList.toggle('unaffordable', this.sim.playerGold < spec.cost);
      }
    });
  }

  _syncHandUI(forceRebuild) {
    const handRow = this.root.querySelector('#wr-hand-row');
    if (!handRow) return;

    const handKey = `${this.sim.hand.map((c) => `${c.slug}:${c.talentIndex}`).join('|')}>${this.sim.nextCard?.slug}`;

    if (forceRebuild || handKey !== this.lastHandKey) {
      this.lastHandKey = handKey;

      const nextCard = this.sim.nextCard;
      const nextSpec = nextCard
        ? getUnitCombatSpec(nextCard.slug, nextCard.talentIndex, this.difficulty.playerLevelDelta)
        : null;
      const nextFig = this.root.querySelector('#wr-next-fig');
      const nextCostEl = this.root.querySelector('#wr-next-cost');
      if (nextFig && nextSpec) nextFig.src = normalizeAssetPath(resolveMiniSprite(nextCard.slug));
      if (nextCostEl && nextSpec) nextCostEl.textContent = String(nextSpec.cost);

      handRow.innerHTML = this.sim.hand
        .map((c, idx) => {
          const spec = getUnitCombatSpec(c.slug, c.talentIndex, this.difficulty.playerLevelDelta);
          const mini = MINI_BY_SLUG.get(c.slug);
          const tal = getEquippedTalent(mini, c.talentIndex);
          const affordable = this.sim.playerGold >= spec.cost;
          const selected = this.selectedSlot === idx;
          const isLeader = mini?.type === 'Leader';
          const baseImg = resolveStatueBase(spec.families);

          return `
            <button
              type="button"
              class="wr-statue-slot ${selected ? 'selected' : ''} ${affordable ? 'affordable' : 'unaffordable'}"
              data-hand-slot="${idx}"
              title="${esc(spec.nameZh)}（${spec.cost}金）— 点击选中再点战场，或拖入战场部署"
            >
              <img class="slot-hole" src="./r/hud/CombatHUD_Tex_Tray_Hole.webp" alt="" />
              <img class="slot-pedestal" src="${esc(baseImg)}" alt="" />
              <img class="slot-ready-ring" src="./r/hud/CombatHUD_Tex_Statue_Base_HUD_On.webp" alt="" />
              ${isLeader ? `<img class="slot-crown" src="./r/authentic/leader-crown.webp" alt="" />` : ''}
              <img class="slot-fig" src="${esc(normalizeAssetPath(spec.sprite))}" alt="${esc(spec.nameZh)}" />
              <div class="slot-bottom-badges">
                <div class="slot-cost">
                  <img src="./r/hud/CombatHUD_Tex_Statue_Base_HUD_CostFrame.webp" alt="" />
                  <span>${spec.cost}</span>
                </div>
                ${
                  tal?.icon
                    ? `<img class="slot-tal" src="${esc(normalizeAssetPath(tal.icon))}" alt="${esc(tal.nameZh)}" />`
                    : ''
                }
              </div>
            </button>
          `;
        })
        .join('');

      handRow.querySelectorAll('[data-hand-slot]').forEach((btn) => {
        const idx = Number(btn.dataset.handSlot);
        btn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          if (!this.matchStarted) return;

          const spec = this.sim.getHandCardSpec(idx);
          const ghost = this.root.querySelector('#wr-drag-ghost');
          if (ghost && spec) {
            ghost.querySelector('img').src = normalizeAssetPath(spec.sprite);
            ghost.querySelector('#wr-drag-ghost-label').textContent = `${spec.nameZh} (${spec.cost}金)`;
          }

          this._dragState = {
            slot: idx,
            startX: e.clientX,
            startY: e.clientY,
            moved: false,
            wasSelected: this.selectedSlot === idx,
          };
        });
        btn.addEventListener('click', (e) => e.stopPropagation());
      });
    } else {
      this._updateCardSelectionClasses();
    }
  }

  _showResultModal(snap) {
    const topDamage = snap.damageStats[0]?.totalDamage || 1;
    const totalPlayerDmg = snap.damageStats.reduce((sum, d) => sum + d.totalDamage, 0);
    const duration = Math.max(1, snap.elapsedTime);

    this.modalRoot.classList.add('open');
    this.modalRoot.innerHTML = `
      <div class="wr-popup-card result-card ${snap.victory ? 'victory' : 'defeat'}">
        <div class="wr-result-hero">
          <img class="title-art" src="${snap.victory ? './r/authentic/victory-title.webp' : './r/authentic/defeat-title.webp'}" alt="${snap.victory ? '胜利' : '失败'}" />
          <p>
            ${
              snap.victory
                ? `成功击败【${esc(this.mission?.nameZh || '首领')}】· 用时 ${formatClock(snap.elapsedTime)} · 奖励 +${this.mission?.rewardGold || 150} 金币`
                : `${esc(snap.defeatReason || '基地防线被攻破')} · ${esc(this.mission?.nameZh || '首领')}剩余血量 ${snap.bossHpPct.toFixed(1)}%`
            }
          </p>
        </div>

        <div class="wr-result-dmg-box">
          <div class="head">全队输出统计（总伤害 ${totalPlayerDmg.toLocaleString()} · 秒伤 ${Math.round(totalPlayerDmg / duration)}）</div>
          ${
            snap.damageStats.length
              ? snap.damageStats
                  .slice(0, 7)
                  .map((d) => {
                    const w = Math.max(5, Math.round((d.totalDamage / topDamage) * 100));
                    return `
                    <div class="wr-dmg-row">
                      <img src="${esc(normalizeAssetPath(d.sprite))}" alt="" style="width:24px;height:24px;object-fit:contain;" />
                      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(d.nameZh)}</span>
                      <div class="wr-dmg-track"><div class="wr-dmg-fill" style="width:${w}%;"></div></div>
                      <span style="text-align:right;font-family:var(--font-numbers);color:#fde68a;">${d.totalDamage.toLocaleString()}</span>
                    </div>
                  `;
                  })
                  .join('')
              : '<div style="color:#9b938b;font-size:12px;">暂无伤害记录</div>'
          }
        </div>

        <div class="wr-result-actions">
          <button type="button" class="wr-gbtn green" id="wr-res-retry">再战一局</button>
          <button type="button" class="wr-gbtn blue" id="wr-res-lobby">继续 / 返回地图</button>
        </div>
      </div>
    `;

    this.modalRoot.querySelector('#wr-res-retry')?.addEventListener('click', () => this._restartBattle());
    this.modalRoot.querySelector('#wr-res-lobby')?.addEventListener('click', () => {
      this.destroy();
      this.onExitLobby();
    });
  }
}

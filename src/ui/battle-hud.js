import { CombatSimulation, TICK_DT } from '../engine/combat-sim.js';
import { tickPlayerAutopilot } from '../engine/player-autopilot.js';
import { getUnitCombatSpec, resolveMiniSprite } from '../engine/unit-stats.js';
import { BattleRenderer } from '../render/battle-renderer.js';
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

    this._onKeyDown = this._handleKeyDown.bind(this);
  }

  mount() {
    const deckSprites = [
      resolveMiniSprite(this.deck.leader.slug),
      ...this.deck.troops.map((t) => resolveMiniSprite(t.slug)),
    ];
    preloadBattleAssets(deckSprites);

    this.root.innerHTML = `
      <div class="wr-battle-shell">
        <div class="wr-battle-topbar">
          <div class="wr-boss-bar-row">
            <img id="wr-boss-mood" class="wr-boss-mood" src="./r/onyxia/Onyxia_Smug.webp" alt="奥妮克希亚" />
            <div class="wr-boss-hp-wrap">
              <div class="wr-boss-hp-meta">
                <span id="wr-boss-title"><strong>奥妮克希亚</strong> · P1 (${esc(this.difficulty.nameZh)})</span>
                <span id="wr-boss-hp-text" style="font-family:var(--font-numbers);">18,000 / 18,000 (100%)</span>
              </div>
              <div class="wr-boss-hp-track">
                <div id="wr-boss-hp-fill" class="wr-boss-hp-fill" style="width:100%;"></div>
                <div class="wr-boss-notch" style="left:40%;" title="40% P3转阶段"></div>
                <div class="wr-boss-notch" style="left:70%;" title="70% P2转阶段"></div>
              </div>
            </div>
          </div>

          <div class="wr-battle-ctrl-row">
            <div style="display:flex;align-items:center;gap:6px;">
              <span id="wr-match-timer" class="wr-timer-pill">6:00</span>
              <span id="wr-egg-timer" class="wr-pill">下波龙蛋 0:20</span>
              <span id="wr-boss-traits" class="wr-pill" style="display:none;"></span>
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <button type="button" class="wr-btn sm" id="wr-auto-btn">🤖 托管</button>
              <button type="button" class="wr-btn sm" id="wr-speed-btn">1x</button>
              <button type="button" class="wr-btn sm" id="wr-pause-btn">⏸ 暂停</button>
              <button type="button" class="wr-btn sm" id="wr-restart-btn">🔄 重开</button>
              <button type="button" class="wr-btn sm danger" id="wr-exit-btn">退出</button>
            </div>
          </div>
        </div>

        <div class="wr-canvas-stage">
          <canvas id="wr-battle-canvas" class="wr-battle-canvas"></canvas>
          <div id="wr-battle-banner" class="wr-battle-banner" style="display:none;"></div>
        </div>

        <div class="wr-battle-tray">
          <div class="wr-gold-row">
            <div class="wr-gold-num">
              <img src="./r/ui/gold-cost.webp" alt="金" />
              <span id="wr-gold-val">4</span>
            </div>
            <div id="wr-gold-bars" class="wr-gold-bars">
              ${Array.from({ length: 10 }, () => `<div class="wr-gold-seg"><div class="wr-gold-seg-fill" style="width:0%"></div></div>`).join('')}
            </div>
          </div>
          <div id="wr-hand-row" class="wr-hand-row"></div>
        </div>
      </div>
    `;

    this.canvas = this.root.querySelector('#wr-battle-canvas');
    this.renderer = new BattleRenderer(this.canvas);

    this._bindControls();
    this._syncHandUI(true);
    this._syncHudUI();

    window.addEventListener('keydown', this._onKeyDown);
    this.lastFrameMs = performance.now();
    this.rafId = requestAnimationFrame((now) => this._loop(now));
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('keydown', this._onKeyDown);
    this.modalRoot.classList.remove('open');
  }

  _bindControls() {
    this.root.querySelector('#wr-auto-btn').addEventListener('click', () => {
      this.autopilot = !this.autopilot;
      const btn = this.root.querySelector('#wr-auto-btn');
      btn.textContent = this.autopilot ? '🤖 托管中' : '🤖 托管';
      btn.classList.toggle('green', this.autopilot);
      this.onToast?.(this.autopilot ? '已开启战术 AI 托管（仍可随时手动操作）' : '已切换回手动操作');
    });

    this.root.querySelector('#wr-speed-btn').addEventListener('click', () => {
      const order = [1, 1.5, 2];
      this.speedMult = order[(order.indexOf(this.speedMult) + 1) % order.length];
      this.root.querySelector('#wr-speed-btn').textContent = `${this.speedMult}x`;
    });

    this.root.querySelector('#wr-pause-btn').addEventListener('click', () => {
      this.paused = !this.paused;
      this.root.querySelector('#wr-pause-btn').textContent = this.paused ? '▶ 继续' : '⏸ 暂停';
    });

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
      this.root.querySelector('#wr-pause-btn').textContent = '⏸ 暂停';
      this._syncHandUI(true);
    });

    this.root.querySelector('#wr-exit-btn').addEventListener('click', () => {
      this.destroy();
      this.onExitLobby();
    });

    // Canvas pointer hover / click / drag drop
    const getWorldPos = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;
      return this.renderer.screenToWorld(sx, sy);
    };

    this.canvas.addEventListener('pointermove', (e) => {
      this.hoverWorld = getWorldPos(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('pointerleave', () => {
      this.hoverWorld = null;
    });

    this.canvas.addEventListener('pointerdown', (e) => {
      const world = getWorldPos(e.clientX, e.clientY);
      this.hoverWorld = world;

      // Check clickable switch arrows first when not dragging a card
      const hitSwitchId = this.renderer.findSwitchAtWorld(this.sim, world.x, world.y);
      if (hitSwitchId && this.selectedSlot == null) {
        const dir = this.sim.toggleSwitch(hitSwitchId);
        this.onToast?.(`道岔已切换至：${dir === 'left' ? '◀ 左路' : '▶ 右路'}`);
        return;
      }

      if (this.selectedSlot != null) {
        const res = this.sim.deployCard(this.selectedSlot, world.x, world.y);
        if (res.ok) {
          this.selectedSlot = null;
          this._syncHandUI(true);
        } else {
          if (hitSwitchId) {
            const dir = this.sim.toggleSwitch(hitSwitchId);
            this.onToast?.(`道岔已切换至：${dir === 'left' ? '◀ 左路' : '▶ 右路'}`);
          } else {
            this.onToast?.(res.reason || '无法在此位置部署');
          }
        }
      }
    });

    // Support drag-from-hand onto canvas release
    window.addEventListener('pointerup', (e) => {
      if (this.draggingSlot == null) return;
      const slot = this.draggingSlot;
      this.draggingSlot = null;
      const rect = this.canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const world = getWorldPos(e.clientX, e.clientY);
        const res = this.sim.deployCard(slot, world.x, world.y);
        if (res.ok) {
          this.selectedSlot = null;
          this._syncHandUI(true);
        } else {
          this.onToast?.(res.reason || '无法在此位置部署');
        }
      }
    });
  }

  _handleKeyDown(e) {
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
      const btn = this.root.querySelector('#wr-pause-btn');
      if (btn) btn.textContent = this.paused ? '▶ 继续' : '⏸ 暂停';
    }
  }

  _loop(now) {
    const dtReal = Math.min(0.1, (now - this.lastFrameMs) / 1000);
    this.lastFrameMs = now;

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

    // Flush audio queue
    while (this.sim.audioQueue.length > 0) {
      sfx.play(this.sim.audioQueue.shift());
    }

    this.renderer.render(this.sim, {
      selectedSlot: this.selectedSlot,
      hoverWorld: this.hoverWorld,
    });

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

    const titleEl = this.root.querySelector('#wr-boss-title');
    if (titleEl) {
      titleEl.innerHTML = `<strong>奥妮克希亚</strong> · P${snap.bossPhase} (${esc(this.difficulty.nameZh)})`;
    }

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
      eggEl.textContent = snap.nextEggSec != null ? `下波龙蛋 ${formatClock(snap.nextEggSec)}` : '龙蛋波次已结束';
    }

    const traitsEl = this.root.querySelector('#wr-boss-traits');
    if (traitsEl) {
      const t = [];
      if (snap.bossResistant) t.push('抗性');
      if (snap.bossArmored) t.push('护甲');
      if (t.length) {
        traitsEl.style.display = '';
        traitsEl.textContent = t.join(' + ');
      } else {
        traitsEl.style.display = 'none';
      }
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

    // Gold meter
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
            <button type="button" class="wr-hand-card ${selected ? 'selected' : ''} ${affordable ? '' : 'unaffordable'}" data-hand-slot="${idx}">
              <div class="wr-cost-badge">${spec.cost}</div>
              <img src="${esc(normalizeAssetPath(spec.sprite))}" alt="${esc(spec.nameZh)}" />
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
        <div class="wr-next-card">
          <span>下一张</span>
          ${nextSpec ? `<img src="${esc(normalizeAssetPath(nextSpec.sprite))}" alt="${esc(nextSpec.nameZh)}" /><span>${nextSpec.cost}金</span>` : ''}
        </div>
      `;

      handRow.querySelectorAll('[data-hand-slot]').forEach((btn) => {
        const idx = Number(btn.dataset.handSlot);
        btn.addEventListener('pointerdown', () => {
          this.draggingSlot = idx;
          this.selectedSlot = idx;
          this._syncHandUI(true);
        });
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      });
    } else {
      // Lightweight affordability toggle without re-rendering DOM
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
            ${snap.victory ? '🎉 胜利！奥妮克希亚已被击败！' : '💀 挑战失败'}
          </h2>
          <p style="margin:4px 0 0;font-size:13px;color:#d6cfc6;">
            ${snap.victory ? `通关用时 ${formatClock(snap.elapsedTime)} · 达成全阶段击杀` : `${esc(snap.defeatReason || '防线失守')} · Boss剩余血量 ${snap.bossHpPct.toFixed(1)}% (P${snap.bossPhase})`}
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

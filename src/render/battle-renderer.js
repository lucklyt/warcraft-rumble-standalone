import {
  LAVA_OBSTACLES,
  MAP_HEIGHT,
  MAP_WIDTH,
  PHASE_CLEAR_Y,
  WARDER_CAVES,
  WAYPOINT_NODES,
  dist2D,
  getPlayerDeployZones,
  isValidDeployPosition,
} from '../engine/onyxia-map.js';
import { getCachedImage } from './asset-loader.js';

export class BattleRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 540;
    this.height = 960;
    this.dpr = 1;
    this.time = 0;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;
    const targetW = Math.round(rect.width * this.dpr);
    const targetH = Math.round(rect.height * this.dpr);
    if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
      this.canvas.width = targetW;
      this.canvas.height = targetH;
    }
  }

  worldToScreen(wx, wy) {
    return {
      x: (wx / MAP_WIDTH) * this.width,
      y: (wy / MAP_HEIGHT) * this.height,
    };
  }

  screenToWorld(sx, sy) {
    return {
      x: (sx / this.width) * MAP_WIDTH,
      y: (sy / this.height) * MAP_HEIGHT,
    };
  }

  yardScale() {
    return this.width / MAP_WIDTH;
  }

  findSwitchAtWorld(sim, wx, wy) {
    for (const sw of Object.values(sim.switches)) {
      if (dist2D(wx, wy, sw.x, sw.y) <= 2.7) {
        return sw.id;
      }
    }
    return null;
  }

  render(sim, interaction = {}) {
    this.resize();
    this.time += 0.016;
    const ctx = this.ctx;
    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // Camera shake during Onyxia phase roar
    if (sim.shakeTimer > 0) {
      const mag = sim.shakeIntensity * 7 * (sim.shakeTimer / 1.0);
      ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
    }

    this._drawTerrain(ctx, sim);
    this._drawDeployPreview(ctx, sim, interaction);
    this._drawResources(ctx, sim);
    this._drawSwitches(ctx, sim);
    this._drawStructures(ctx, sim);
    this._drawBoss(ctx, sim);
    this._drawTotemsAndSpells(ctx, sim);
    this._drawUnits(ctx, sim);
    this._drawProjectilesAndFx(ctx, sim);
    this._drawFloatingTexts(ctx, sim);

    // Overtime pulsing border
    if (sim.inOvertime) {
      const pulse = 0.16 + 0.12 * Math.sin(this.time * 5);
      ctx.strokeStyle = `rgba(239, 68, 68, ${pulse.toFixed(3)})`;
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, this.width - 10, this.height - 10);
    }

    ctx.restore();
  }

  _drawTerrain(ctx, sim) {
    const w = this.width;
    const h = this.height;
    const ys = this.yardScale();

    // Volcanic cavern background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#2a1215');
    bgGrad.addColorStop(0.28, '#23191d');
    bgGrad.addColorStop(0.7, '#221c19');
    bgGrad.addColorStop(1, '#1a1824');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle molten outer border rim
    const rimGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.3, w * 0.5, h * 0.5, h * 0.72);
    rimGrad.addColorStop(0, 'rgba(0,0,0,0)');
    rimGrad.addColorStop(1, 'rgba(180, 45, 18, 0.34)');
    ctx.fillStyle = rimGrad;
    ctx.fillRect(0, 0, w, h);

    // Draw cobblestone lane network
    const edges = [
      ['P_BASE', 'SW_BOT'],
      ['SW_BOT', 'L1'], ['L1', 'L2'], ['L2', 'L3'], ['L3', 'TOWER_L'], ['TOWER_L', 'L_TOP'], ['L_TOP', 'BOSS'],
      ['SW_BOT', 'SW_MID'],
      ['SW_MID', 'M1'], ['M1', 'TOWER_MID'], ['TOWER_MID', 'SW_UP'],
      ['SW_UP', 'TOWER_L'], ['SW_UP', 'TOWER_R'],
      ['SW_MID', 'R1'], ['R1', 'R2'], ['R2', 'R3'], ['R3', 'TOWER_R'], ['TOWER_R', 'R_TOP'], ['R_TOP', 'BOSS'],
    ];

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(65, 52, 46, 0.78)';
    ctx.lineWidth = ys * 3.8;
    ctx.beginPath();
    for (const [aId, bId] of edges) {
      const a = this.worldToScreen(WAYPOINT_NODES[aId].x, WAYPOINT_NODES[aId].y);
      const b = this.worldToScreen(WAYPOINT_NODES[bId].x, WAYPOINT_NODES[bId].y);
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(145, 114, 86, 0.25)';
    ctx.lineWidth = ys * 2.1;
    ctx.stroke();

    // Lava obstacles
    for (const obs of LAVA_OBSTACLES) {
      const c = this.worldToScreen(obs.cx, obs.cy);
      const rx = obs.rx * ys;
      const ry = obs.ry * ys;

      // Outer molten glow
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, rx + 5, ry + 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(249, 115, 22, 0.28)';
      ctx.fill();

      // Obsidian crater rock + lava vein
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, rx, ry, 0, 0, Math.PI * 2);
      const rockGrad = ctx.createRadialGradient(c.x, c.y, rx * 0.15, c.x, c.y, Math.max(rx, ry));
      rockGrad.addColorStop(0, '#dc2626');
      rockGrad.addColorStop(0.45, '#7c2d12');
      rockGrad.addColorStop(0.8, '#292023');
      rockGrad.addColorStop(1, '#1a1417');
      ctx.fillStyle = rockGrad;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fb923c66';
      ctx.stroke();
      ctx.restore();
    }

    // Warder Caves (P3 side portals)
    for (const cave of Object.values(WARDER_CAVES)) {
      const p = this.worldToScreen(cave.x, cave.y);
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, ys * 1.45, 0, Math.PI * 2);
      ctx.fillStyle = sim.boss.phase >= 3 ? 'rgba(220, 38, 38, 0.45)' : 'rgba(20, 12, 16, 0.75)';
      ctx.fill();
      ctx.strokeStyle = sim.boss.phase >= 3 ? '#f87171' : '#574147';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // Phase-clear tactical line (y = 26.5)
    const linePt = this.worldToScreen(0, PHASE_CLEAR_Y);
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, linePt.y);
    ctx.lineTo(w, linePt.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(250, 204, 21, 0.55)';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('70% / 40% 转阶段清场线', w - 8, linePt.y - 4);
    ctx.restore();
  }

  _drawDeployPreview(ctx, sim, interaction) {
    const { selectedSlot, hoverWorld } = interaction;
    if (selectedSlot == null) return;
    const spec = sim.getHandCardSpec(selectedSlot);
    if (!spec) return;

    const ys = this.yardScale();

    // Highlight valid ground deploy zones for standard troops
    if (!spec.isSpell && !spec.isUnbound) {
      const zones = getPlayerDeployZones(sim);
      ctx.save();
      ctx.fillStyle = 'rgba(34, 197, 94, 0.14)';
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.55)';
      ctx.lineWidth = 2;
      for (const z of zones) {
        if (z.kind === 'rect') {
          const tl = this.worldToScreen(z.xMin, z.yMin);
          const br = this.worldToScreen(z.xMax, z.yMax);
          ctx.fillRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
          ctx.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
        } else if (z.kind === 'circle') {
          const c = this.worldToScreen(z.x, z.y);
          ctx.beginPath();
          ctx.arc(c.x, c.y, z.r * ys, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    if (hoverWorld) {
      const check = isValidDeployPosition(hoverWorld.x, hoverWorld.y, spec, sim);
      const affordable = sim.playerGold >= spec.cost;
      const ok = check.valid && affordable;
      const p = this.worldToScreen(hoverWorld.x, hoverWorld.y);
      const radiusYards = spec.isSpell ? (spec.splashRadius || 4.5) : Math.min(spec.range || 2.5, 9.0);
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1.4, radiusYards) * ys, 0, Math.PI * 2);
      ctx.fillStyle = ok ? 'rgba(56, 189, 248, 0.18)' : 'rgba(239, 68, 68, 0.22)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = ok ? '#38bdf8' : '#ef4444';
      ctx.stroke();

      // Ghost unit icon
      const img = getCachedImage(spec.sprite);
      if (img) {
        ctx.globalAlpha = 0.78;
        const sz = ys * 2.8;
        ctx.drawImage(img, p.x - sz / 2, p.y - sz / 2, sz, sz);
      }
      ctx.restore();
    }
  }

  _drawResources(ctx, sim) {
    const ys = this.yardScale();
    // Gold mines
    for (const m of sim.mines) {
      const p = this.worldToScreen(m.x, m.y);
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, ys * 1.25, 0, Math.PI * 2);
      ctx.fillStyle = m.gold > 0 ? '#452b11' : '#262022';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = m.gold > 0 ? '#facc15' : '#57534e';
      ctx.stroke();

      // Gold nuggets count
      for (let i = 0; i < m.gold; i++) {
        const ang = (i / Math.max(1, m.maxGold)) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.arc(p.x + Math.cos(ang) * ys * 0.55, p.y + Math.sin(ang) * ys * 0.55, ys * 0.32, 0, Math.PI * 2);
        ctx.fillStyle = '#fde047';
        ctx.fill();
      }
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`金矿 ${m.gold}`, p.x, p.y + ys * 1.9);
      ctx.restore();
    }

    // Treasure chests
    for (const c of sim.chests) {
      const p = this.worldToScreen(c.x, c.y);
      ctx.save();
      if (c.alive) {
        const bw = ys * 1.6;
        const bh = ys * 1.2;
        ctx.fillStyle = '#92400e';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.fillRect(p.x - bw / 2, p.y - bh / 2, bw, bh);
        ctx.strokeRect(p.x - bw / 2, p.y - bh / 2, bw, bh);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(p.x - bw / 2, p.y - 2, bw, 3);
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('宝箱 +2G', p.x, p.y + ys * 1.5);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, ys * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
        ctx.setLineDash([3, 3]);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  _drawSwitches(ctx, sim) {
    const ys = this.yardScale();
    for (const sw of Object.values(sim.switches)) {
      const p = this.worldToScreen(sw.x, sw.y);
      const r = ys * 1.35;
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(24, 34, 58, 0.88)';
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      // Directional arrow
      ctx.fillStyle = '#7dd3fc';
      ctx.font = `bold ${Math.round(r * 1.2)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sw.dir === 'left' ? '◀' : '▶', p.x, p.y + 1);
      ctx.restore();
    }
  }

  _drawStructures(ctx, sim) {
    const ys = this.yardScale();
    for (const s of sim.structures) {
      const p = this.worldToScreen(s.x, s.y);
      const r = s.radius * ys;
      const isPlayer = s.team === 'player';

      ctx.save();
      // Base platform
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = s.rebuilding ? '#27272a' : isPlayer ? '#1e3a8a' : '#7f1d1d';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = s.hitFlashTimer > 0 ? '#ffffff' : isPlayer ? '#60a5fa' : '#f87171';
      ctx.stroke();

      // Inner turret icon
      ctx.fillStyle = isPlayer ? '#bfdbfe' : '#fecaca';
      ctx.font = `bold ${Math.round(r * 0.9)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.kind === 'base' ? '🏰' : '🗼', p.x, p.y);

      // Ragnaros armor ring
      if (s.ragnarosShield > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // HP or rebuild bar
      const barW = r * 2.1;
      const barH = 6;
      const bx = p.x - barW / 2;
      const by = p.y - r - 12;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
      ctx.fillRect(bx, by, barW, barH);
      if (s.rebuilding) {
        const pct = Math.max(0, 1 - s.rebuildTimer / 2.5);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(bx + 1, by + 1, (barW - 2) * pct, barH - 2);
      } else {
        const pct = Math.max(0, s.hp / s.maxHp);
        ctx.fillStyle = isPlayer ? '#38bdf8' : '#ef4444';
        ctx.fillRect(bx + 1, by + 1, (barW - 2) * pct, barH - 2);
      }
      ctx.restore();
    }
  }

  _drawBoss(ctx, sim) {
    const boss = sim.boss;
    if (!boss) return;
    const p = this.worldToScreen(boss.x, boss.y);
    const ys = this.yardScale();
    const size = ys * 7.8;

    ctx.save();
    // Phase aura
    const auraColor = boss.phase === 3 ? 'rgba(239, 68, 68, 0.35)' : boss.phase === 2 ? 'rgba(168, 85, 247, 0.32)' : 'rgba(249, 115, 22, 0.22)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, size * 0.52, 0, Math.PI * 2);
    ctx.fillStyle = auraColor;
    ctx.fill();

    // 12-yard breath range indicator (subtle)
    ctx.beginPath();
    ctx.arc(p.x, p.y, boss.range * ys, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.14)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const img = getCachedImage('./r/d/m/onyxia.webp');
    const breathScale = 1 + 0.025 * Math.sin(this.time * 2.5);
    if (img) {
      if (boss.hitFlashTimer > 0) ctx.filter = 'brightness(1.75)';
      ctx.drawImage(
        img,
        p.x - (size * breathScale) / 2,
        p.y - (size * breathScale) / 2,
        size * breathScale,
        size * breathScale
      );
      ctx.filter = 'none';
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, ys * 3.0, 0, Math.PI * 2);
      ctx.fillStyle = '#7f1d1d';
      ctx.fill();
    }

    // Status icons (poison stacks / frost)
    if (boss.poisonStacks > 0 || boss.burnTimer > 0 || boss.frostTimer > 0) {
      const tags = [];
      if (boss.poisonStacks > 0) tags.push(`毒×${boss.poisonStacks}`);
      if (boss.burnTimer > 0) tags.push('燃');
      if (boss.frostTimer > 0) tags.push('冰');
      ctx.fillStyle = '#d9f99d';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tags.join(' '), p.x, p.y + size * 0.45);
    }
    ctx.restore();
  }

  _drawTotemsAndSpells(ctx, sim) {
    const ys = this.yardScale();
    for (const sp of sim.activeSpells) {
      const p = this.worldToScreen(sp.x, sp.y);
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, sp.radius * ys, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
    for (const totem of sim.totems) {
      const p = this.worldToScreen(totem.x, totem.y);
      const colors = { windfury: '#38bdf8', healing: '#4ade80', searing: '#f97316', earthbind: '#a855f7' };
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, ys * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = colors[totem.kind] || '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('图腾', p.x, p.y + 3);
      ctx.restore();
    }
  }

  _drawUnits(ctx, sim) {
    const ys = this.yardScale();
    // Sort by y for natural depth overlap
    const sorted = [...sim.units].sort((a, b) => a.y - b.y);
    for (const u of sorted) {
      const p = this.worldToScreen(u.x, u.y);
      const r = u.radius * ys * 1.45;
      const isPlayer = u.team === 'player';

      ctx.save();
      if (u.stealthActive) ctx.globalAlpha = 0.55;

      // Flying drop shadow
      if (u.isFlying) {
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + r * 0.85, r * 0.72, r * 0.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
        ctx.fill();
      }

      const drawY = u.isFlying ? p.y - r * 0.35 + Math.sin(this.time * 4 + u.x) * 2.5 : p.y;

      // Base ring
      ctx.beginPath();
      ctx.arc(p.x, drawY + r * 0.25, r * 0.88, 0, Math.PI * 2);
      ctx.fillStyle = isPlayer ? 'rgba(30, 58, 138, 0.6)' : 'rgba(127, 29, 29, 0.6)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = u.hitFlashTimer > 0 ? '#ffffff' : isPlayer ? '#38bdf8' : '#ef4444';
      ctx.stroke();

      // Sprite
      if (u.polymorphTimer > 0) {
        ctx.font = `${Math.round(r * 1.5)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🐑', p.x, drawY);
      } else {
        const img = getCachedImage(u.spec?.sprite);
        const sprSz = r * 2.1;
        if (img) {
          if (u.hitFlashTimer > 0) ctx.filter = 'brightness(1.8)';
          ctx.drawImage(img, p.x - sprSz / 2, drawY - sprSz / 2, sprSz, sprSz);
          ctx.filter = 'none';
        } else {
          ctx.beginPath();
          ctx.arc(p.x, drawY, r * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = isPlayer ? '#60a5fa' : '#f87171';
          ctx.fill();
        }
      }

      // Shield bubble
      if (u.shieldOneHit || u.invulnTimer > 0) {
        ctx.beginPath();
        ctx.arc(p.x, drawY, r * 1.15, 0, Math.PI * 2);
        ctx.strokeStyle = u.invulnTimer > 0 ? '#fde047' : '#93c5fd';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // HP bar
      const bw = Math.max(20, r * 1.8);
      const bh = 4;
      const bx = p.x - bw / 2;
      const by = drawY - r * 1.1 - 6;
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(bx, by, bw, bh);
      const pct = Math.max(0, u.hp / u.maxHp);
      ctx.fillStyle = isPlayer ? '#4ade80' : '#ef4444';
      ctx.fillRect(bx, by, bw * pct, bh);

      // Egg hatch timer ring
      if (u.isEgg && u.hatchTimer > 0) {
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.ceil(u.hatchTimer)}s`, p.x, drawY + r * 1.15);
      }

      ctx.restore();
    }
  }

  _drawProjectilesAndFx(ctx, sim) {
    const ys = this.yardScale();
    for (const proj of sim.projectiles) {
      const p = this.worldToScreen(proj.x, proj.y);
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.2, 0, Math.PI * 2);
      ctx.fillStyle = proj.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    }

    for (const fx of sim.fx) {
      const t = Math.min(1, fx.age / fx.duration);
      const alpha = Math.max(0, 1 - t);
      ctx.save();
      ctx.globalAlpha = alpha;
      if (fx.kind === 'explosion' || fx.kind === 'ring') {
        const p = this.worldToScreen(fx.x, fx.y);
        const rad = fx.radius * ys * (0.45 + 0.55 * t);
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        if (fx.kind === 'explosion') {
          ctx.fillStyle = fx.color;
          ctx.globalAlpha = alpha * 0.35;
          ctx.fill();
          ctx.globalAlpha = alpha;
        }
        ctx.strokeStyle = fx.color;
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (fx.kind === 'beam') {
        const a = this.worldToScreen(fx.x1, fx.y1);
        const b = this.worldToScreen(fx.x2, fx.y2);
        ctx.strokeStyle = fx.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      } else if (fx.kind === 'cone-breath') {
        const p = this.worldToScreen(fx.x, fx.y);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, fx.radius * ys, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = 'rgba(249, 115, 22, 0.42)';
        ctx.fill();
      } else if (fx.kind === 'phase-sweep') {
        const lineY = this.worldToScreen(0, fx.yLine).y;
        const sweepY = lineY + (this.height - lineY) * t;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.38)';
        ctx.fillRect(0, 0, this.width, sweepY);
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, sweepY);
        ctx.lineTo(this.width, sweepY);
        ctx.stroke();
      } else if (fx.kind === 'breath-lane') {
        const p = this.worldToScreen(fx.x, fx.y);
        const end = this.worldToScreen(fx.x, fx.y + fx.dir * fx.length);
        ctx.strokeStyle = fx.color;
        ctx.lineWidth = ys * 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  _drawFloatingTexts(ctx, sim) {
    for (const ft of sim.floatingTexts) {
      const t = ft.age / ft.duration;
      const p = this.worldToScreen(ft.x, ft.y);
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - t);
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2.5;
      ctx.strokeText(ft.text, p.x, p.y - t * 20);
      ctx.fillText(ft.text, p.x, p.y - t * 20);
      ctx.restore();
    }
  }
}

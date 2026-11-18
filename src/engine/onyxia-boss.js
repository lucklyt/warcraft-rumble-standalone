import {
  ONYXIA_POS,
  PHASE_CLEAR_Y,
  WARDER_CAVES,
  WHELP_EGG_NESTS,
  clampToArena,
  dist2D,
} from './onyxia-map.js';
import { getLevelMultiplier, getUnitCombatSpec } from './unit-stats.js';

export function createOnyxiaBoss(levelDelta = 0) {
  const scale = getLevelMultiplier(levelDelta);
  const maxHp = Math.round(18000 * scale);
  return {
    id: 'boss-onyxia',
    slug: 'onyxia',
    nameZh: '奥妮克希亚',
    team: 'enemy',
    isBoss: true,
    isStructure: false,
    isUnstoppable: true,
    isDetect: true,
    alive: true,
    x: ONYXIA_POS.x,
    y: ONYXIA_POS.y,
    radius: ONYXIA_POS.radius,
    hp: maxHp,
    maxHp,
    damage: Math.round(375 * scale),
    range: 12.0,
    attackInterval: 2.5,
    attackCooldown: 1.0,
    phase: 1,
    hasResistant: false,
    hasArmored: false,
    gold: 4.0,
    goldPerSec: 0.20,
    eggSchedule: [20, 110, 200, 290, 380, 470],
    eggWaveIndex: 0,
    collapseTimer: 9999, // Activated in P2 (immediate + every 50s)
    warderTimer: 9999,   // Activated in P3 (immediate + every 80s)
    headToggle: 0,
    poisonStacks: 0,
    poisonTimer: 0,
    burnTimer: 0,
    frostTimer: 0,
    elementalVulnTimer: 0,
    hitFlashTimer: 0,
  };
}

export function getNextEggCountdown(boss, elapsedTime) {
  if (!boss || boss.eggWaveIndex >= boss.eggSchedule.length) return null;
  return Math.max(0, Math.ceil(boss.eggSchedule[boss.eggWaveIndex] - elapsedTime));
}

function triggerBoardClearAndResetTowers(sim, bannerText) {
  sim.addFx({
    kind: 'phase-sweep',
    yLine: PHASE_CLEAR_Y,
    duration: 1.15,
    color: '#ef4444',
  });
  sim.setBanner(bannerText, 3.8);
  sim.triggerShake(1.0);
  sim.emitAudio('roar');

  // 1. Wipe / knockback player units
  for (const u of sim.units) {
    if (!u.alive || u.team !== 'player') continue;
    if (u.isEgg) {
      // Friendly whelp eggs hatch during phase sweep and can capture towers!
      u.hatchNow = true;
      continue;
    }
    if (u.y < PHASE_CLEAR_Y) {
      u.hp = 0;
      u.alive = false;
      sim.addFx({ kind: 'explosion', x: u.x, y: u.y, radius: 1.6, color: '#f97316', duration: 0.35 });
    } else {
      const knock = u.weight === 'light' ? 6.2 : u.weight === 'heavy' ? 2.0 : 4.2;
      const clamped = clampToArena(u.x, u.y + knock);
      u.x = clamped.x;
      u.y = clamped.y;
      u.nodeId = null; // Survivors re-path forward
    }
  }

  // 2. Wipe enemy units above clear line? No, keep enemy defenders or reset top towers cleanly
  for (const s of sim.structures) {
    if (s.resetsOnPhase) {
      s.team = 'enemy';
      s.hp = s.maxHp;
      s.rebuilding = false;
      s.rebuildTimer = 0;
      s.ragnarosShield = 0;
      s.ragnarosMaxShield = 0;
      sim.addFx({ kind: 'explosion', x: s.x, y: s.y, radius: 4.0, color: '#ef4444', duration: 0.65 });
    }
  }

  // Detach Ragnaros if his tower got reset
  for (const u of sim.units) {
    if (u.alive && u.spec?.slug === 'ragnaros' && u.attachedStructureId) {
      const st = sim.structures.find((s) => s.id === u.attachedStructureId);
      if (!st || st.team !== u.team) {
        u.hp = 0;
        u.alive = false;
      }
    }
  }
}

function spawnOnyxiaEggWave(sim, levelDelta) {
  const eggSpec = getUnitCombatSpec('onyxia-egg', 0, levelDelta);
  for (const side of ['left', 'right']) {
    for (const pt of WHELP_EGG_NESTS[side]) {
      const egg = sim.spawnUnitFromSpec(eggSpec, 'enemy', pt.x, pt.y, {
        stationary: true,
        isEgg: true,
        hatchTimer: 30.0,
        hatchCount: 1,
        hatchSlug: 'onyxia-whelp',
        laneHint: side,
      });
      if (egg) {
        sim.addFx({ kind: 'ring', x: pt.x, y: pt.y, radius: 1.5, color: '#a855f7', duration: 0.5 });
      }
    }
  }
  sim.setBanner('龙蛋危机：左右两侧孵化巢产下奥妮克希亚龙蛋（30秒后破壳）！', 3.0);
  sim.emitAudio('alert');
}

function spawnLandslideWave(sim, levelDelta) {
  const eeSpec = getUnitCombatSpec('earth-elemental', 0, levelDelta);
  const eeHp = Math.round(850 * getLevelMultiplier(levelDelta));
  const spawnPoints = [
    { x: 10.5, y: 27.5 },
    { x: 25.5, y: 27.5 },
    { x: 18.0, y: 39.5 },
  ];
  for (const pt of spawnPoints) {
    const jx = sim.rng.range(-1.0, 1.0);
    const jy = sim.rng.range(-0.8, 0.8);
    const pos = clampToArena(pt.x + jx, pt.y + jy);
    sim.spawnUnitFromSpec(eeSpec, 'enemy', pos.x, pos.y, { hp: eeHp, maxHp: eeHp });
    sim.addFx({ kind: 'explosion', x: pos.x, y: pos.y, radius: 2.2, color: '#d97706', duration: 0.5 });
  }
  sim.setBanner('洞穴塌方：3 只守卫土元素突袭战线！', 2.8);
}

function spawnWarderWave(sim, levelDelta) {
  const warderSpec = getUnitCombatSpec('onyxia-warder', 0, levelDelta);
  sim.spawnUnitFromSpec(warderSpec, 'enemy', WARDER_CAVES.left.x, WARDER_CAVES.left.y, { nodeId: WARDER_CAVES.left.nodeId });
  sim.spawnUnitFromSpec(warderSpec, 'enemy', WARDER_CAVES.right.x, WARDER_CAVES.right.y, { nodeId: WARDER_CAVES.right.nodeId });
  sim.addFx({ kind: 'ring', x: WARDER_CAVES.left.x, y: WARDER_CAVES.left.y, radius: 2.8, color: '#ef4444', duration: 0.6 });
  sim.addFx({ kind: 'ring', x: WARDER_CAVES.right.x, y: WARDER_CAVES.right.y, radius: 2.8, color: '#ef4444', duration: 0.6 });
  sim.setBanner('奥妮克希亚守卫从左右洞口压境！切勿让其会合中路！', 3.0);
}

export function tickOnyxiaBoss(sim, dt) {
  const boss = sim.boss;
  if (!boss || !boss.alive) return;

  const levelDelta = sim.getLevelDelta('enemy');
  const hpPct = (boss.hp / boss.maxHp) * 100;

  // Passive Boss gold generation (scales by phase, doubled in overtime)
  const overtimeMult = sim.inOvertime ? 2.0 : 1.0;
  boss.gold = Math.min(10, boss.gold + boss.goldPerSec * overtimeMult * dt);

  // Cleanse helper
  const cleanseBoss = () => {
    boss.poisonStacks = 0;
    boss.poisonTimer = 0;
    boss.burnTimer = 0;
    boss.frostTimer = 0;
    boss.elementalVulnTimer = 0;
  };

  // Phase 2 transition (<= 70% HP)
  if (boss.phase === 1 && hpPct <= 70) {
    boss.phase = 2;
    boss.hasResistant = true;
    boss.goldPerSec = 0.30;
    cleanseBoss();
    triggerBoardClearAndResetTowers(sim, 'P2 转阶段（70%）：全图烈焰清场！奥妮克希亚激活【元素抗性】并夺回双顶塔！');
    spawnLandslideWave(sim, levelDelta);
    boss.collapseTimer = 50.0;
  }

  // Phase 3 transition (<= 40% HP)
  if (boss.phase < 3 && hpPct <= 40) {
    boss.phase = 3;
    boss.hasResistant = true;
    boss.hasArmored = true;
    boss.goldPerSec = 0.40;
    cleanseBoss();
    triggerBoardClearAndResetTowers(sim, 'P3 决战阶段（40%）：【护甲+抗性】双抗并存！双路奥妮克希亚守卫降临！');
    spawnWarderWave(sim, levelDelta);
    boss.warderTimer = 80.0;
  }

  // Egg wave schedule (5:40, 4:10, 2:40, 1:10, OT 1:40, OT 0:10)
  while (boss.eggWaveIndex < boss.eggSchedule.length && sim.elapsedTime >= boss.eggSchedule[boss.eggWaveIndex]) {
    boss.eggWaveIndex += 1;
    spawnOnyxiaEggWave(sim, levelDelta);
  }

  // P2+ periodic Landslide (every 50s)
  if (boss.phase >= 2) {
    boss.collapseTimer -= dt;
    if (boss.collapseTimer <= 0) {
      boss.collapseTimer = 50.0;
      spawnLandslideWave(sim, levelDelta);
    }
  }

  // P3 periodic Warders (every 80s)
  if (boss.phase >= 3) {
    boss.warderTimer -= dt;
    if (boss.warderTimer <= 0) {
      boss.warderTimer = 80.0;
      spawnWarderWave(sim, levelDelta);
    }
  }

  // Boss 12-yard 180° Flame Breath (2.5s interval, hits ground + air in front of throne)
  const frostSlow = boss.frostTimer > 0 ? 0.65 : 1.0;
  boss.attackCooldown -= dt * frostSlow;
  if (boss.attackCooldown <= 0) {
    const inFront = sim.units.filter(
      (u) =>
        u.alive &&
        u.team === 'player' &&
        u.y >= boss.y - 1.5 &&
        dist2D(boss.x, boss.y, u.x, u.y) <= boss.range + (u.radius || 0.6)
    );
    if (inFront.length > 0) {
      boss.attackCooldown = boss.attackInterval;
      boss.headToggle = 1 - boss.headToggle;
      sim.dealAreaDamage(boss.x, boss.y, boss.range, boss.damage, {
        team: 'enemy',
        damageKind: 'elemental',
        sourceSlug: 'onyxia',
        canHitFlying: true,
        customFilter: (u) => u.y >= boss.y - 1.5 && dist2D(boss.x, boss.y, u.x, u.y) <= boss.range + 0.8,
      });
      sim.addFx({
        kind: 'cone-breath',
        x: boss.x + (boss.headToggle ? -1.1 : 1.1),
        y: boss.y + 1.8,
        radius: boss.range,
        color: '#f97316',
        duration: 0.48,
      });
      sim.emitAudio('breath');
    } else {
      boss.attackCooldown = 0.25;
    }
  }
}

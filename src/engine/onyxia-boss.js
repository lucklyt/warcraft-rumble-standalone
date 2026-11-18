import {
  ELEMENTAL_CAVEIN_SPAWNERS,
  ONYXIA_POS,
  ONYXIA_TAUNTS,
  PHASE_WIPE_RADIUS,
  WARDER_CAVEIN_SPAWNERS,
  WHELP_EGG_SPAWNERS,
  clampToArena,
  dist2D,
} from './onyxia-map.js';
import { getLevelMultiplier, getUnitCombatSpec } from './unit-stats.js';

export function createOnyxiaBoss(levelDelta = 0, mission = null) {
  const scale = getLevelMultiplier(levelDelta);
  const isOnyxia = !mission || mission.id === 'onyxia_lair';
  const baseHp = isOnyxia ? 18000 : mission.maxHp || 11000;
  const baseDmg = isOnyxia ? 375 : mission.damage || 250;
  const maxHp = Math.round(baseHp * scale);
  return {
    id: `boss-${mission?.bossSlug || 'onyxia'}`,
    slug: isOnyxia ? 'onyxia' : mission.bossSlug || 'onyxia',
    nameZh: isOnyxia ? '奥妮克希亚' : mission.nameZh || '敌方首领',
    team: 'enemy',
    isBoss: true,
    isStructure: false,
    isUnstoppable: true,
    isDetect: true,
    hasPhases: isOnyxia ? true : Boolean(mission?.hasPhases),
    alive: true,
    x: ONYXIA_POS.x,
    z: ONYXIA_POS.z,
    radius: ONYXIA_POS.radius,
    yaw: 0, // Faces South (toward -Z in sim / +Z_three)
    hp: maxHp,
    maxHp,
    damage: Math.round(baseDmg * scale),
    range: isOnyxia ? 12.0 : mission?.range || 6.5, // Plus boss.radius (8.0)
    attackInterval: isOnyxia ? 2.5 : 2.1,
    attackCooldown: 1.0,
    attackAnimTimer: 0,
    phase: 1,
    hasResistant: false,
    hasArmored: false,
    gold: 4.0,
    goldPerSec: isOnyxia ? 0.20 : mission?.goldPerSec || 0.20,
    eggSchedule: isOnyxia ? [20, 110, 200, 290, 380, 470] : [],
    eggWaveIndex: 0,
    collapseTimer: 9999,
    warderTimer: 9999,
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

function triggerBoardClearAndResetTowers(sim, bannerText, tauntText, mood) {
  sim.addFx({
    kind: 'phase-sweep',
    x: ONYXIA_POS.x,
    z: ONYXIA_POS.z,
    radius: PHASE_WIPE_RADIUS,
    duration: 1.35,
    color: '#ef4444',
  });
  sim.setBanner(bannerText, 4.0);
  if (typeof sim.setBossTaunt === 'function') {
    sim.setBossTaunt(tauntText, mood, 4.5);
  }
  sim.triggerShake(1.1, 0.75);
  sim.emitAudio('roar');

  // 1. Wipe player non-egg units inside BoardWipe radius (47m), knockback survivors southward (-z)
  for (const u of sim.units) {
    if (!u.alive || u.team !== 'player') continue;
    if (u.isEgg) {
      u.hatchNow = true;
      continue;
    }
    const distFromBoss = dist2D(u.x, u.z, ONYXIA_POS.x, ONYXIA_POS.z);
    if (distFromBoss <= PHASE_WIPE_RADIUS) {
      u.hp = 0;
      u.alive = false;
      sim.addFx({ kind: 'explosion', x: u.x, z: u.z, radius: 2.2, color: '#f97316', duration: 0.45 });
    } else {
      const knock = u.weight === 'light' ? 8.5 : u.weight === 'heavy' ? 2.5 : 5.5;
      const clamped = clampToArena(u.x, u.z - knock);
      u.x = clamped.x;
      u.z = clamped.z;
      u.nodeId = null;
    }
  }

  // 2. Reset northern towers within Onyxia's BoardWipe reach (Tower 2 & Tower 3; Tower 1 survives)
  for (const s of sim.structures) {
    if (s.resetsOnPhase) {
      s.team = 'enemy';
      s.hp = s.maxHp;
      s.rebuilding = false;
      s.rebuildTimer = 0;
      s.ragnarosShield = 0;
      s.ragnarosMaxShield = 0;
      sim.addFx({ kind: 'explosion', x: s.x, z: s.z, radius: 5.0, color: '#ef4444', duration: 0.75 });
    }
  }

  // Detach Ragnaros if his host tower was reclaimed
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

function spawnOnyxiaEggWave(sim, levelDelta, waveIdx = 1) {
  const eggSpec = getUnitCombatSpec('onyxia-egg', 0, levelDelta);
  // Pick 3 authentic egg nests on each flank per wave, rotating across all 16 official nests
  for (const side of ['left', 'right']) {
    const nests = WHELP_EGG_SPAWNERS[side] || [];
    for (let k = 0; k < Math.min(3, nests.length); k++) {
      const pt = nests[(waveIdx * 3 + k) % nests.length];
      const egg = sim.spawnUnitFromSpec(eggSpec, 'enemy', pt.x, pt.z, {
        stationary: true,
        isEgg: true,
        hatchTimer: 30.0,
        hatchCount: 1,
        hatchSlug: 'onyxia-whelp',
        laneHint: side,
      });
      if (egg) {
        sim.addFx({ kind: 'ring', x: pt.x, z: pt.z, radius: 2.0, color: '#a855f7', duration: 0.55 });
      }
    }
  }
  sim.setBanner('龙蛋危机：左右孵化巢产下奥妮克希亚龙蛋（30秒后破壳）！', 3.2);
  sim.emitAudio('alert');
}

function spawnLandslideWave(sim, levelDelta) {
  const eeSpec = getUnitCombatSpec('earth-elemental', 0, levelDelta);
  const eeHp = Math.round(850 * getLevelMultiplier(levelDelta));
  const points = ELEMENTAL_CAVEIN_SPAWNERS.slice(0, 3);
  for (const pt of points) {
    const pos = clampToArena(pt.x + sim.rng.range(-1.2, 1.2), pt.z + sim.rng.range(-1.0, 1.0));
    sim.spawnUnitFromSpec(eeSpec, 'enemy', pos.x, pos.z, { hp: eeHp, maxHp: eeHp });
    sim.addFx({ kind: 'explosion', x: pos.x, z: pos.z, radius: 2.8, color: '#d97706', duration: 0.6 });
  }
  sim.setBanner('洞穴塌方：守卫土元素从熔岩岩壁突袭战线！', 3.0);
}

function spawnWarderWave(sim, levelDelta) {
  const warderSpec = getUnitCombatSpec('onyxia-warder', 0, levelDelta);
  for (const sp of WARDER_CAVEIN_SPAWNERS) {
    sim.spawnUnitFromSpec(warderSpec, 'enemy', sp.x, sp.z, { nodeId: sp.nodeId });
    sim.addFx({ kind: 'ring', x: sp.x, z: sp.z, radius: 3.4, color: '#ef4444', duration: 0.65 });
  }
  sim.setBanner('奥妮克希亚守卫从北侧双洞口压境！', 3.2);
}

export function tickOnyxiaBoss(sim, dt) {
  const boss = sim.boss;
  if (!boss || !boss.alive) return;

  if (boss.attackAnimTimer > 0) boss.attackAnimTimer = Math.max(0, boss.attackAnimTimer - dt);

  const levelDelta = sim.getLevelDelta('enemy');
  const hpPct = (boss.hp / boss.maxHp) * 100;

  const overtimeMult = sim.inOvertime ? 2.0 : 1.0;
  boss.gold = Math.min(10, boss.gold + boss.goldPerSec * overtimeMult * dt);

  const cleanseBoss = () => {
    boss.poisonStacks = 0;
    boss.poisonTimer = 0;
    boss.burnTimer = 0;
    boss.frostTimer = 0;
    boss.elementalVulnTimer = 0;
  };

  if (boss.hasPhases && boss.phase === 1 && hpPct <= 70) {
    boss.phase = 2;
    boss.hasResistant = true;
    boss.goldPerSec = 0.30;
    cleanseBoss();
    const taunt = ONYXIA_TAUNTS[1] || '你会付出代价的！';
    triggerBoardClearAndResetTowers(
      sim,
      'P2 转阶段（70%）：全图烈焰清场！奥妮克希亚激活【元素抗性】并夺回东西双顶塔！',
      taunt,
      'annoyed'
    );
    spawnLandslideWave(sim, levelDelta);
    boss.collapseTimer = 50.0;
  }

  if (boss.hasPhases && boss.phase < 3 && hpPct <= 40) {
    boss.phase = 3;
    boss.hasResistant = true;
    boss.hasArmored = true;
    boss.goldPerSec = 0.40;
    cleanseBoss();
    const taunt = ONYXIA_TAUNTS[2] || '要明白你的处境！';
    triggerBoardClearAndResetTowers(
      sim,
      'P3 决战阶段（40%）：【护甲+抗性】双抗并存！双路奥妮克希亚守卫降临！',
      taunt,
      'angry'
    );
    spawnWarderWave(sim, levelDelta);
    boss.warderTimer = 80.0;
  }

  while (boss.hasPhases && boss.eggWaveIndex < boss.eggSchedule.length && sim.elapsedTime >= boss.eggSchedule[boss.eggWaveIndex]) {
    const waveIdx = boss.eggWaveIndex;
    boss.eggWaveIndex += 1;
    spawnOnyxiaEggWave(sim, levelDelta, waveIdx);
  }

  if (boss.hasPhases && boss.phase >= 2) {
    boss.collapseTimer -= dt;
    if (boss.collapseTimer <= 0) {
      boss.collapseTimer = 50.0;
      spawnLandslideWave(sim, levelDelta);
    }
  }

  if (boss.hasPhases && boss.phase >= 3) {
    boss.warderTimer -= dt;
    if (boss.warderTimer <= 0) {
      boss.warderTimer = 80.0;
      spawnWarderWave(sim, levelDelta);
    }
  }

  // Boss 12m (20m from throne center) 180° Southward Flame Breath
  const frostSlow = boss.frostTimer > 0 ? 0.65 : 1.0;
  boss.attackCooldown -= dt * frostSlow;
  if (boss.attackCooldown <= 0) {
    const reach = boss.radius + boss.range;
    const inFront = sim.units.filter(
      (u) =>
        u.alive &&
        u.team === 'player' &&
        u.z <= boss.z + 2.0 &&
        dist2D(boss.x, boss.z, u.x, u.z) <= reach + (u.radius || 0.7)
    );
    if (inFront.length > 0) {
      boss.attackCooldown = boss.attackInterval;
      boss.attackAnimTimer = 0.65;
      boss.headToggle = 1 - boss.headToggle;
      const aimTarget = inFront[0];
      boss.yaw = Math.atan2(aimTarget.x - boss.x, aimTarget.z - boss.z);
      sim.dealAreaDamage(boss.x, boss.z, reach + 0.5, boss.damage, {
        team: 'enemy',
        damageKind: 'elemental',
        sourceSlug: 'onyxia',
        canHitFlying: true,
        customFilter: (u) => u.z <= boss.z + 2.0 && dist2D(boss.x, boss.z, u.x, u.z) <= reach + 1.0,
      });
      sim.addFx({
        kind: 'cone-breath',
        x: boss.x + (boss.headToggle ? -1.4 : 1.4),
        z: boss.z - 2.5,
        radius: boss.range + 2.0,
        color: '#f97316',
        duration: 0.55,
      });
      sim.emitAudio('breath');
    } else {
      boss.attackCooldown = 0.25;
    }
  }
}

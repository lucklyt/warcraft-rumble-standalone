import { dist2D, getPlayerDeployZones, isValidDeployPosition } from './onyxia-map.js';

const OFFENSIVE_SPELLS = new Set([
  'execute',
  'blizzard',
  'deep-breath',
  'chain-lightning',
  'arcane-blast',
  'holy-nova',
  'living-bomb',
  'eclipse',
  'earth-and-moon',
]);

function pickValidPointNear(sim, spec, targetX, targetZ) {
  const candidates = [{ x: targetX, z: targetZ }];
  const zones = getPlayerDeployZones(sim);
  // Sort zones closest to desired (targetX, targetZ)
  const sortedZones = [...zones].sort((a, b) => dist2D(a.x, a.z, targetX, targetZ) - dist2D(b.x, b.z, targetX, targetZ));
  for (const zRect of sortedZones) {
    candidates.push({
      x: Math.max(zRect.xMin + 0.8, Math.min(zRect.xMax - 0.8, targetX)),
      z: Math.max(zRect.zMin + 0.8, Math.min(zRect.zMax - 0.8, targetZ)),
    });
    candidates.push({ x: zRect.x, z: zRect.zMax - 1.2 });
    candidates.push({ x: zRect.x, z: zRect.z });
  }
  candidates.push({ x: 0, z: 4.0 }, { x: -10, z: 4.0 }, { x: 10, z: 4.0 });

  for (const pt of candidates) {
    if (isValidDeployPosition(pt.x, pt.z, spec, sim).valid) {
      return pt;
    }
  }
  return null;
}

/**
 * Tactical Player Autopilot for authentic 56x114 Onyxia's Lair (x, z) map.
 */
export function tickPlayerAutopilot(sim, dt) {
  if (!sim || sim.finished) return;
  if (!sim._autopilot) {
    sim._autopilot = {
      thinkTimer: 0.4,
      laneCycle: 0,
    };
  }
  const ap = sim._autopilot;
  ap.thinkTimer -= dt;
  if (ap.thinkTimer > 0) return;
  ap.thinkTimer = 0.65;

  const affordable = [];
  for (let slot = 0; slot < 4; slot++) {
    const spec = sim.getHandCardSpec(slot);
    if (spec && sim.playerGold >= spec.cost) {
      affordable.push({ slot, spec });
    }
  }
  if (affordable.length === 0) return;

  // 1. Emergency defense if enemies threaten southern half near Keep (z <= 26)
  const threats = sim.units
    .filter((u) => u.alive && u.team === 'enemy' && !u.isEgg && u.z <= 26.0)
    .sort((a, b) => a.z - b.z);

  if (threats.length > 0) {
    const threat = threats[0];
    const hasFlyingThreat = threats.some((t) => t.isFlying);
    let defPick = null;
    if (hasFlyingThreat) {
      defPick =
        affordable.find((c) => !c.spec.isSpell && !c.spec.isMiner && ((c.spec.isRanged && !c.spec.isBombard) || c.spec.isFlying)) ||
        affordable.find((c) => OFFENSIVE_SPELLS.has(c.spec.slug)) ||
        affordable.find((c) => !c.spec.isMiner && !c.spec.isSpell);
    } else {
      defPick =
        affordable.find((c) => !c.spec.isSpell && !c.spec.isMiner && !c.spec.isSiegeOnly) ||
        affordable.find((c) => OFFENSIVE_SPELLS.has(c.spec.slug));
    }
    if (defPick) {
      const pt =
        defPick.spec.isSpell || defPick.spec.isUnbound
          ? { x: threat.x, z: threat.z }
          : pickValidPointNear(sim, defPick.spec, threat.x, Math.max(0, Math.min(6.0, threat.z - 2.0)));
      if (pt && sim.deployCard(defPick.slot, pt.x, pt.z).ok) return;
    }
  }

  // 2. Egg clearing & switch steering
  const eggs = sim.units.filter((u) => u.alive && u.team === 'enemy' && u.slug === 'onyxia-egg');
  if (eggs.length > 0) {
    const eggTarget = eggs[0];
    if (sim.switches['switch-tower-1']) {
      sim.switches['switch-tower-1'].dir = eggTarget.x < 0 ? 'left' : 'right';
    }
    const eggBuster = affordable.find(
      (c) => (c.spec.isUnbound && !c.spec.isMiner) || (OFFENSIVE_SPELLS.has(c.spec.slug) && c.spec.slug !== 'execute')
    );
    if (eggBuster && eggTarget) {
      if (sim.deployCard(eggBuster.slot, eggTarget.x, eggTarget.z).ok) return;
    }
  }

  // 3. Send Kobold Miner to richest mine
  const minerCard = affordable.find((c) => c.spec.isMiner);
  const playerMinerAlive = sim.units.some((u) => u.alive && u.team === 'player' && u.spec?.isMiner);
  const richMine = sim.mines.filter((m) => m.gold >= 2).sort((a, b) => a.z - b.z)[0];

  if (minerCard && !playerMinerAlive && richMine && sim.playerGold >= 1.5) {
    const dropX = richMine.x < -5 ? -10 : richMine.x > 5 ? 10 : 0;
    const pt = pickValidPointNear(sim, minerCard.spec, dropX, 4.5);
    if (pt && sim.deployCard(minerCard.slot, pt.x, pt.z).ok) return;
  }

  // 4. Steer switches for Tower 1 -> focus Tower 2 until captured, then push Tower 3 / Onyxia
  const towerMid = sim.structures.find((s) => s.id === 'tower-mid');
  const towerLeft = sim.structures.find((s) => s.id === 'tower-left');
  if (eggs.length === 0) {
    if (towerMid && towerMid.team !== 'player') {
      if (sim.switches['switch-tower-1']) sim.switches['switch-tower-1'].dir = 'left';
    } else if (towerLeft && towerLeft.team !== 'player') {
      if (sim.switches['switch-tower-1']) sim.switches['switch-tower-1'].dir = 'left';
      if (sim.switches['switch-tower-2']) sim.switches['switch-tower-2'].dir = 'left';
    } else {
      const mode = ap.laneCycle % 2;
      if (sim.switches['switch-tower-1']) sim.switches['switch-tower-1'].dir = mode === 0 ? 'left' : 'right';
      if (sim.switches['switch-tower-2']) sim.switches['switch-tower-2'].dir = 'left';
    }
  }

  // 5. Offensive push from northernmost friendly structure
  const friendlyStructures = sim.structures
    .filter((s) => s.team === 'player' && s.hp > 0 && !s.rebuilding)
    .sort((a, b) => b.z - a.z);
  const anchor = friendlyStructures[0] || sim.structures.find((s) => s.id === 'player-base');

  const combatCards = affordable.filter((c) => !c.spec.isMiner);
  if (combatCards.length === 0) return;

  const ragCard = combatCards.find((c) => c.spec.slug === 'ragnaros');
  if (ragCard) {
    const ragAnchor = towerMid && towerMid.team === 'player' && !towerMid.rebuilding ? towerMid : anchor;
    if (sim.deployCard(ragCard.slot, ragAnchor.x, ragAnchor.z).ok) {
      ap.laneCycle += 1;
      return;
    }
  }

  const tankOrLeader = combatCards.find((c) => !c.spec.isSpell && !c.spec.isUnbound && (c.spec.isLeader || c.spec.hp >= 900));
  const rangedOrSupport = combatCards.find((c) => !c.spec.isSpell && !c.spec.isUnbound);
  const unboundCard = combatCards.find((c) => c.spec.isUnbound && !c.spec.isSpell);
  const spellCard = combatCards.find((c) => OFFENSIVE_SPELLS.has(c.spec.slug));

  const chosen = tankOrLeader || rangedOrSupport || unboundCard || spellCard || combatCards[0];
  if (!chosen) return;

  if (chosen.spec.isSpell) {
    const enemyCluster = sim.units.find((u) => u.alive && u.team === 'enemy' && !u.isEgg && u.z > 20);
    const sx = enemyCluster && dist2D(enemyCluster.x, enemyCluster.z, sim.boss.x, sim.boss.z) > 14 ? enemyCluster.x : sim.boss.x;
    const sz = enemyCluster && dist2D(enemyCluster.x, enemyCluster.z, sim.boss.x, sim.boss.z) > 14 ? enemyCluster.z : sim.boss.z - 5.0;
    if (sim.deployCard(chosen.slot, sx, sz).ok) {
      ap.laneCycle += 1;
    }
    return;
  }

  if (chosen.spec.isUnbound) {
    const liveChest = sim.chests.find((c) => c.alive);
    if (liveChest && chosen.spec.slug === 'defias-bandits') {
      if (sim.deployCard(chosen.slot, liveChest.x, liveChest.z).ok) return;
    }
    const enemyTower = sim.structures.find((s) => s.kind === 'tower' && s.team === 'enemy' && s.hp > 0 && !s.rebuilding);
    const ux = enemyTower ? enemyTower.x : ap.laneCycle % 2 === 0 ? -7.5 : 7.5;
    const uz = enemyTower ? enemyTower.z - 3.0 : 65.0;
    if (sim.deployCard(chosen.slot, ux, uz).ok) {
      ap.laneCycle += 1;
    }
    return;
  }

  const pushX = anchor.kind === 'base' ? (ap.laneCycle % 3 === 0 ? -10 : ap.laneCycle % 3 === 1 ? 0 : 10) : anchor.x;
  const pushZ = anchor.kind === 'base' ? 5.5 : Math.min(70.0, anchor.z + 4.5);
  const pt = pickValidPointNear(sim, chosen.spec, pushX, pushZ);
  if (pt && sim.deployCard(chosen.slot, pt.x, pt.z).ok) {
    ap.laneCycle += 1;
  }
}

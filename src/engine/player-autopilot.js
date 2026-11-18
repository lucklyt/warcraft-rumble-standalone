import { dist2D, isValidDeployPosition } from './onyxia-map.js';

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

function pickValidPointNear(sim, spec, targetX, targetY) {
  const candidates = [
    { x: targetX, y: targetY },
    { x: targetX, y: Math.max(47.8, Math.min(56.5, targetY)) },
    { x: 18.0, y: 49.0 },
    { x: 15.0, y: 50.0 },
    { x: 21.0, y: 50.0 },
  ];
  for (const s of sim.structures) {
    if (s.team === 'player' && s.hp > 0 && !s.rebuilding) {
      candidates.push({ x: s.x, y: s.y - 2.0 });
      candidates.push({ x: s.x, y: s.y + 1.5 });
      candidates.push({ x: s.x, y: s.y });
    }
  }
  for (const pt of candidates) {
    if (isValidDeployPosition(pt.x, pt.y, spec, sim).valid) {
      return pt;
    }
  }
  return null;
}

/**
 * Tactical Player Autopilot for Onyxia's Lair.
 * Handles emergency defense, egg clearing, switch steering, mining, tower pushing, and boss DPS.
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

  // 1. Emergency defense if enemies threaten lower half (y >= 34)
  const threats = sim.units
    .filter((u) => u.alive && u.team === 'enemy' && !u.isEgg && u.y >= 34.0)
    .sort((a, b) => b.y - a.y);

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
      const pt = defPick.spec.isSpell || defPick.spec.isUnbound
        ? { x: threat.x, y: threat.y }
        : pickValidPointNear(sim, defPick.spec, Math.max(8, Math.min(28, threat.x)), Math.max(47.8, Math.min(54.5, threat.y + 3.0)));
      if (pt && sim.deployCard(defPick.slot, pt.x, pt.y).ok) return;
    }
  }

  // 2. Egg clearing & switch steering
  const eggs = sim.units.filter((u) => u.alive && u.team === 'enemy' && u.slug === 'onyxia-egg');
  if (eggs.length > 0) {
    const leftEgg = eggs.find((e) => e.x < 18.0);
    const rightEgg = eggs.find((e) => e.x >= 18.0);
    if (leftEgg) {
      sim.switches['switch-bottom'].dir = 'left';
    } else if (rightEgg) {
      sim.switches['switch-bottom'].dir = 'right';
      sim.switches['switch-mid'].dir = 'right';
    }

    const eggTarget = leftEgg || rightEgg;
    const eggBuster = affordable.find(
      (c) =>
        (c.spec.isUnbound && !c.spec.isMiner) ||
        (OFFENSIVE_SPELLS.has(c.spec.slug) && c.spec.slug !== 'execute')
    );
    if (eggBuster && eggTarget) {
      if (sim.deployCard(eggBuster.slot, eggTarget.x, eggTarget.y).ok) return;
    }
  }

  // 3. Send Kobold Miner if mines have gold >= 2 and no player miner is active
  const minerCard = affordable.find((c) => c.spec.isMiner);
  const playerMinerAlive = sim.units.some((u) => u.alive && u.team === 'player' && u.spec?.isMiner);
  const richMine = sim.mines
    .filter((m) => m.gold >= 2)
    .sort((a, b) => b.y - a.y)[0];

  if (minerCard && !playerMinerAlive && richMine && sim.playerGold >= 1.5) {
    if (richMine.x < 16) {
      sim.switches['switch-bottom'].dir = 'left';
    } else {
      sim.switches['switch-bottom'].dir = 'right';
      sim.switches['switch-mid'].dir = 'right';
    }
    const dropX = richMine.x < 18 ? 14.0 : 22.0;
    if (sim.deployCard(minerCard.slot, dropX, 49.0).ok) return;
  }

  // 4. Steer lanes for Mid Tower first (survives P2/P3), then alternate left/right top towers
  const midTower = sim.structures.find((s) => s.id === 'tower-mid');
  if (eggs.length === 0) {
    if (midTower && midTower.team !== 'player') {
      sim.switches['switch-bottom'].dir = 'right';
      sim.switches['switch-mid'].dir = 'left';
    } else {
      const mode = ap.laneCycle % 3;
      if (mode === 0) {
        sim.switches['switch-bottom'].dir = 'left';
      } else if (mode === 1) {
        sim.switches['switch-bottom'].dir = 'right';
        sim.switches['switch-mid'].dir = 'left';
        sim.switches['switch-upper'].dir = 'left';
      } else {
        sim.switches['switch-bottom'].dir = 'right';
        sim.switches['switch-mid'].dir = 'right';
        sim.switches['switch-upper'].dir = 'right';
      }
    }
  }

  // 5. Offensive Push: deploy tank/leader or support at furthest friendly tower or base front
  const friendlyStructures = sim.structures
    .filter((s) => s.team === 'player' && s.hp > 0 && !s.rebuilding)
    .sort((a, b) => a.y - b.y);
  const anchor = friendlyStructures[0] || sim.structures.find((s) => s.id === 'player-base');

  // Prefer non-miner combat card; if gold is near cap, allow playing anything useful
  const combatCards = affordable.filter((c) => !c.spec.isMiner);
  if (combatCards.length === 0) return;

  // Priority: Ragnaros attach -> Tank/Leader -> Ranged/Healer -> Unbound -> Offensive Spell
  const ragCard = combatCards.find((c) => c.spec.slug === 'ragnaros');
  if (ragCard) {
    const ragAnchor = midTower && midTower.team === 'player' && !midTower.rebuilding ? midTower : anchor;
    if (sim.deployCard(ragCard.slot, ragAnchor.x, ragAnchor.y).ok) {
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
    // Drop offensive spell on Onyxia or enemy cluster
    const enemyCluster = sim.units.find((u) => u.alive && u.team === 'enemy' && !u.isEgg);
    const sx = enemyCluster && dist2D(enemyCluster.x, enemyCluster.y, sim.boss.x, sim.boss.y) > 10 ? enemyCluster.x : sim.boss.x;
    const sy = enemyCluster && dist2D(enemyCluster.x, enemyCluster.y, sim.boss.x, sim.boss.y) > 10 ? enemyCluster.y : sim.boss.y + 1.5;
    if (sim.deployCard(chosen.slot, sx, sy).ok) {
      ap.laneCycle += 1;
    }
    return;
  }

  if (chosen.spec.isUnbound) {
    // Capture live chest if bandits or drop near enemy tower / boss flank
    const liveChest = sim.chests.find((c) => c.alive);
    if (liveChest && chosen.spec.slug === 'defias-bandits') {
      if (sim.deployCard(chosen.slot, liveChest.x, liveChest.y).ok) return;
    }
    const enemyTower = sim.structures.find((s) => s.kind === 'tower' && s.team === 'enemy' && s.hp > 0 && !s.rebuilding);
    const ux = enemyTower ? enemyTower.x : ap.laneCycle % 2 === 0 ? 15.0 : 21.0;
    const uy = enemyTower ? enemyTower.y + 2.2 : 14.5;
    if (sim.deployCard(chosen.slot, ux, uy).ok) {
      ap.laneCycle += 1;
    }
    return;
  }

  const pushY = anchor.kind === 'base' ? 48.2 : Math.max(15.0, anchor.y - 2.2);
  const pt = pickValidPointNear(sim, chosen.spec, anchor.x, pushY);
  if (pt && sim.deployCard(chosen.slot, pt.x, pt.y).ok) {
    ap.laneCycle += 1;
  }
}

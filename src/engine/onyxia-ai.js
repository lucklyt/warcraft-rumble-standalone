import { dist2D } from './onyxia-map.js';
import { getUnitCombatSpec } from './unit-stats.js';

// Official Onyxia 6-card army from official-missions.json (+ kobold-miner)
export const ONYXIA_ARMY_POOL = [
  { slug: 'drake', talentIndex: 0 },
  { slug: 'gargoyle', talentIndex: 1 },
  { slug: 'gryphon-rider', talentIndex: 2 },
  { slug: 'necromancer', talentIndex: 1 },
  { slug: 'spiderlings', talentIndex: 0 },
  { slug: 'warsong-grunts', talentIndex: 1 },
];

export function createOnyxiaAiState() {
  return {
    thinkTimer: 1.8,
    deckIdx: 0,
    minerCooldown: 4.0,
    gargoyleCooldown: 14.0,
  };
}

function chooseSpawnTower(sim, preferSide = null) {
  const enemyTowers = sim.structures.filter((s) => s.kind === 'tower' && s.team === 'enemy' && s.hp > 0 && !s.rebuilding);
  if (preferSide === 'left') {
    const t = enemyTowers.find((s) => s.id === 'tower-left');
    if (t) return { x: t.x, y: t.y + 1.5, nodeId: 'TOWER_L' };
  }
  if (preferSide === 'right') {
    const t = enemyTowers.find((s) => s.id === 'tower-right');
    if (t) return { x: t.x, y: t.y + 1.5, nodeId: 'TOWER_R' };
  }
  if (preferSide === 'mid') {
    const t = enemyTowers.find((s) => s.id === 'tower-mid');
    if (t) return { x: t.x, y: t.y + 1.5, nodeId: 'TOWER_MID' };
  }
  if (enemyTowers.length > 0) {
    const chosen = sim.rng.pick(enemyTowers);
    const nodeMap = { 'tower-left': 'TOWER_L', 'tower-right': 'TOWER_R', 'tower-mid': 'TOWER_MID' };
    return { x: chosen.x, y: chosen.y + 1.5, nodeId: nodeMap[chosen.id] };
  }
  return { x: sim.rng.next() < 0.5 ? 12.6 : 23.4, y: 14.8, nodeId: null };
}

export function tickOnyxiaAi(sim, dt) {
  const ai = sim.ai;
  const boss = sim.boss;
  if (!ai || !boss || !boss.alive) return;

  ai.minerCooldown = Math.max(0, ai.minerCooldown - dt);
  ai.gargoyleCooldown = Math.max(0, ai.gargoyleCooldown - dt);
  ai.thinkTimer -= dt;
  if (ai.thinkTimer > 0) return;
  ai.thinkTimer = 1.4;

  const levelDelta = sim.getLevelDelta('enemy');

  // 1. Send Kobold Miner if gold mines have rich veins and no enemy miner active
  const enemyMinerAlive = sim.units.some((u) => u.alive && u.team === 'enemy' && u.spec?.isMiner);
  const richMine = sim.mines.some((m) => m.gold >= 2);
  if (!enemyMinerAlive && richMine && ai.minerCooldown <= 0 && boss.gold >= 1.2) {
    const minerSpec = getUnitCombatSpec('kobold-miner', 0, levelDelta);
    const spawn = chooseSpawnTower(sim, 'left');
    boss.gold -= 1.0;
    ai.minerCooldown = 22.0;
    sim.spawnUnitFromSpec(minerSpec, 'enemy', spawn.x, spawn.y, { nodeId: spawn.nodeId });
    return;
  }

  // 2. Analyze player threats on each lane and counter appropriately
  const playerUnits = sim.units.filter((u) => u.alive && u.team === 'player');
  const flyingThreats = playerUnits.filter((u) => u.isFlying && u.y < 42);
  const heavyGround = playerUnits.filter((u) => !u.isFlying && u.hp >= 900 && u.y < 38);

  let chosenCard = null;
  let preferSide = null;

  if (flyingThreats.length > 0 && boss.gold >= 2.2) {
    // Counter flying units with Gryphon Rider or Necromancer
    const threat = flyingThreats[0];
    preferSide = threat.x < 14 ? 'left' : threat.x > 22 ? 'right' : 'mid';
    chosenCard = boss.gold >= 4.2 && sim.rng.next() < 0.45
      ? { slug: 'necromancer', talentIndex: 1 }
      : { slug: 'gryphon-rider', talentIndex: 2 };
  } else if (heavyGround.length > 0 && boss.gold >= 3.0) {
    const threat = heavyGround[0];
    preferSide = threat.x < 14 ? 'left' : threat.x > 22 ? 'right' : 'mid';
    chosenCard = boss.gold >= 4.2
      ? { slug: 'drake', talentIndex: 0 }
      : { slug: 'spiderlings', talentIndex: 0 };
  } else if (ai.gargoyleCooldown <= 0 && boss.gold >= 4.2) {
    chosenCard = { slug: 'gargoyle', talentIndex: 1 };
    preferSide = sim.rng.next() < 0.5 ? 'left' : 'right';
    ai.gargoyleCooldown = 28.0;
  } else if (boss.gold >= 4.5) {
    chosenCard = ONYXIA_ARMY_POOL[ai.deckIdx % ONYXIA_ARMY_POOL.length];
    ai.deckIdx += 1;
  }

  if (!chosenCard) return;

  const spec = getUnitCombatSpec(chosenCard.slug, chosenCard.talentIndex, levelDelta);
  if (boss.gold < spec.cost) return;

  boss.gold -= spec.cost;
  const spawn = chooseSpawnTower(sim, preferSide);
  const count = spec.count || 1;
  for (let i = 0; i < count; i++) {
    const angle = (i / Math.max(1, count)) * Math.PI * 2;
    const ox = count > 1 ? Math.cos(angle) * 0.8 : 0;
    const oy = count > 1 ? Math.sin(angle) * 0.6 : 0;
    sim.spawnUnitFromSpec(spec, 'enemy', spawn.x + ox, spawn.y + oy, { nodeId: spawn.nodeId });
  }
}

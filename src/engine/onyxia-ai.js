import { DEPLOY_AREA_DEFS, dist2D, getBossDeployAreas, getStructureDeployAreas } from './onyxia-map.js';
import { getUnitCombatSpec } from './unit-stats.js';

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
    minerCooldown: 4.5,
    gargoyleCooldown: 14.0,
  };
}

function chooseEnemySpawn(sim, preferSide = null) {
  const enemyTowers = sim.structures.filter(
    (s) => s.kind === 'tower' && s.team === 'enemy' && s.hp > 0 && !s.rebuilding
  );

  let chosenStruct = null;
  if (preferSide === 'left') chosenStruct = enemyTowers.find((s) => s.id === 'tower-left');
  else if (preferSide === 'right') chosenStruct = enemyTowers.find((s) => s.id === 'tower-right');
  else if (preferSide === 'mid') chosenStruct = enemyTowers.find((s) => s.id === 'tower-mid');

  if (!chosenStruct && enemyTowers.length > 0) {
    chosenStruct = sim.rng.pick(enemyTowers);
  }

  if (chosenStruct) {
    const areas = getStructureDeployAreas(chosenStruct.guid);
    const da = areas.length > 0 ? sim.rng.pick(areas) : null;
    return {
      x: chosenStruct.x + sim.rng.range(-1.2, 1.2),
      z: chosenStruct.z - 2.2,
      nodeId: da?.bottomRoad || null,
    };
  }

  // Fallback: Blizzard's official Boss Deploy 1 (-9, 71) & Boss Deploy 2 (9, 71)
  const bossAreas = getBossDeployAreas();
  if (bossAreas.length > 0) {
    const da = sim.rng.pick(bossAreas);
    return { x: da.x, z: da.z, nodeId: da.bottomRoad || null };
  }
  const fallback = DEPLOY_AREA_DEFS.find((d) => d.name.startsWith('Boss'));
  return { x: fallback?.x ?? -9, z: fallback?.z ?? 71, nodeId: fallback?.bottomRoad || null };
}

export function tickOnyxiaAi(sim, dt) {
  const ai = sim.ai;
  const boss = sim.boss;
  if (!ai || !boss || !boss.alive) return;

  ai.minerCooldown = Math.max(0, ai.minerCooldown - dt);
  ai.gargoyleCooldown = Math.max(0, ai.gargoyleCooldown - dt);
  ai.thinkTimer -= dt;
  if (ai.thinkTimer > 0) return;
  ai.thinkTimer = 1.45;

  const levelDelta = sim.getLevelDelta('enemy');

  // 1. Dispatch Kobold Miner if mines hold >= 2 gold and no enemy miner active
  const enemyMinerAlive = sim.units.some((u) => u.alive && u.team === 'enemy' && u.spec?.isMiner);
  const richMine = sim.mines.find((m) => m.gold >= 2);
  if (!enemyMinerAlive && richMine && ai.minerCooldown <= 0 && boss.gold >= 1.2) {
    const minerSpec = getUnitCombatSpec('kobold-miner', 0, levelDelta);
    const sideHint = richMine.x < -5 ? 'left' : richMine.x > 5 ? 'right' : 'mid';
    const spawn = chooseEnemySpawn(sim, sideHint);
    boss.gold -= 1.0;
    ai.minerCooldown = 22.0;
    sim.spawnUnitFromSpec(minerSpec, 'enemy', spawn.x, spawn.z, { nodeId: spawn.nodeId });
    return;
  }

  // 2. React to player push in northern half (z >= 25)
  const playerUnits = sim.units.filter((u) => u.alive && u.team === 'player');
  const flyingThreats = playerUnits.filter((u) => u.isFlying && u.z >= 32);
  const heavyGround = playerUnits.filter((u) => !u.isFlying && u.hp >= 900 && u.z >= 32);

  let chosenCard = null;
  let preferSide = null;

  if (flyingThreats.length > 0 && boss.gold >= 2.2) {
    const threat = flyingThreats[0];
    preferSide = threat.x < -6 ? 'left' : threat.x > 6 ? 'right' : 'mid';
    chosenCard =
      boss.gold >= 4.2 && sim.rng.next() < 0.45
        ? { slug: 'necromancer', talentIndex: 1 }
        : { slug: 'gryphon-rider', talentIndex: 2 };
  } else if (heavyGround.length > 0 && boss.gold >= 3.0) {
    const threat = heavyGround[0];
    preferSide = threat.x < -6 ? 'left' : threat.x > 6 ? 'right' : 'mid';
    chosenCard =
      boss.gold >= 4.2 ? { slug: 'drake', talentIndex: 0 } : { slug: 'spiderlings', talentIndex: 0 };
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
  const spawn = chooseEnemySpawn(sim, preferSide);
  const count = spec.count || 1;
  for (let i = 0; i < count; i++) {
    const angle = (i / Math.max(1, count)) * Math.PI * 2;
    const ox = count > 1 ? Math.cos(angle) * 1.0 : 0;
    const oz = count > 1 ? Math.sin(angle) * 0.8 : 0;
    sim.spawnUnitFromSpec(spec, 'enemy', spawn.x + ox, spawn.z + oz, { nodeId: spawn.nodeId });
  }
}

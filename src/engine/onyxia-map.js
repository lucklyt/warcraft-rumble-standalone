export const MAP_WIDTH = 36;
export const MAP_HEIGHT = 64;
export const PHASE_CLEAR_Y = 26.5;

export const ONYXIA_POS = { x: 18.0, y: 9.5, radius: 3.1 };
export const PLAYER_BASE_POS = { x: 18.0, y: 55.0, radius: 2.6 };

export const INITIAL_STRUCTURES = [
  {
    id: 'player-base',
    kind: 'base',
    nameZh: '联盟主基地',
    team: 'player',
    x: 18.0,
    y: 55.0,
    radius: 2.6,
    maxHp: 5500,
    range: 9.5,
    damage: 185,
    attackInterval: 1.35,
    splashRadius: 1.8,
    resetsOnPhase: false,
    deployRadius: 7.5,
  },
  {
    id: 'tower-mid',
    kind: 'tower',
    nameZh: '中路要塞哨塔',
    team: 'enemy',
    x: 18.0,
    y: 31.5,
    radius: 1.9,
    maxHp: 1800,
    range: 9.5,
    damage: 125,
    attackInterval: 1.4,
    resetsOnPhase: false, // Below PHASE_CLEAR_Y (26.5) -> survives phase transitions!
    deployRadius: 5.8,
  },
  {
    id: 'tower-left',
    kind: 'tower',
    nameZh: '左翼龙巢哨塔',
    team: 'enemy',
    x: 11.2,
    y: 21.5,
    radius: 1.9,
    maxHp: 1800,
    range: 9.5,
    damage: 125,
    attackInterval: 1.4,
    resetsOnPhase: true, // Above PHASE_CLEAR_Y -> wiped & reclaimed by Onyxia at 70% & 40%
    deployRadius: 5.8,
  },
  {
    id: 'tower-right',
    kind: 'tower',
    nameZh: '右翼龙巢哨塔',
    team: 'enemy',
    x: 24.8,
    y: 21.5,
    radius: 1.9,
    maxHp: 1800,
    range: 9.5,
    damage: 125,
    attackInterval: 1.4,
    resetsOnPhase: true, // Above PHASE_CLEAR_Y -> wiped & reclaimed by Onyxia at 70% & 40%
    deployRadius: 5.8,
  },
];

export const INITIAL_MINES = [
  { id: 'mine-left', x: 7.2, y: 34.0, gold: 2, maxGold: 3, regenTimer: 0, regenInterval: 15 },
  { id: 'mine-right', x: 29.0, y: 38.0, gold: 2, maxGold: 3, regenTimer: 0, regenInterval: 15 },
  { id: 'mine-mid', x: 22.5, y: 25.5, gold: 2, maxGold: 3, regenTimer: 0, regenInterval: 15 },
  { id: 'mine-top-left', x: 11.0, y: 16.0, gold: 2, maxGold: 3, regenTimer: 0, regenInterval: 15 },
];

export const INITIAL_CHESTS = [
  { id: 'chest-bottom', x: 20.2, y: 41.5, hp: 200, maxHp: 200, alive: true, respawnTimer: 0, respawnInterval: 45, reward: 2 },
  { id: 'chest-top', x: 18.0, y: 20.5, hp: 200, maxHp: 200, alive: true, respawnTimer: 0, respawnInterval: 45, reward: 2 },
];

export const WHELP_EGG_NESTS = {
  left: [
    { x: 7.5, y: 38.8 },
    { x: 9.2, y: 38.4 },
    { x: 8.4, y: 40.4 },
  ],
  right: [
    { x: 26.6, y: 41.6 },
    { x: 28.4, y: 41.3 },
    { x: 27.5, y: 43.3 },
  ],
};

export const WARDER_CAVES = {
  left: { x: 7.0, y: 14.0, nodeId: 'L_TOP' },
  right: { x: 29.0, y: 14.0, nodeId: 'R_TOP' },
};

// Elliptical lava obstacles blocking ground unit walking/placement (flying & spells ignore)
export const LAVA_OBSTACLES = [
  { id: 'lava-left', cx: 12.6, cy: 39.2, rx: 2.3, ry: 6.2 },
  { id: 'lava-mid', cx: 18.2, cy: 25.4, rx: 2.8, ry: 2.3 },
  { id: 'lava-right', cx: 23.2, cy: 42.6, rx: 3.1, ry: 3.9 },
];

export const INITIAL_SWITCHES = {
  'switch-bottom': { id: 'switch-bottom', x: 18.0, y: 47.5, dir: 'left', label: '底路分岔' },
  'switch-mid': { id: 'switch-mid', x: 20.5, y: 43.0, dir: 'left', label: '中右分岔' },
  'switch-upper': { id: 'switch-upper', x: 18.0, y: 27.5, dir: 'left', label: '上路合流' },
};

export const WAYPOINT_NODES = {
  P_BASE: { id: 'P_BASE', x: 18.0, y: 55.0, nextPlayer: 'SW_BOT', nextEnemy: null },
  SW_BOT: { id: 'SW_BOT', x: 18.0, y: 47.5, switchId: 'switch-bottom', left: 'L1', right: 'SW_MID', nextEnemy: 'P_BASE' },
  L1: { id: 'L1', x: 10.0, y: 45.2, nextPlayer: 'L2', nextEnemy: 'SW_BOT' },
  L2: { id: 'L2', x: 8.4, y: 38.5, nextPlayer: 'L3', nextEnemy: 'L1' },
  L3: { id: 'L3', x: 9.0, y: 29.5, nextPlayer: 'TOWER_L', nextEnemy: 'L2' },
  SW_MID: { id: 'SW_MID', x: 20.5, y: 43.0, switchId: 'switch-mid', left: 'M1', right: 'R1', nextEnemy: 'SW_BOT' },
  M1: { id: 'M1', x: 16.5, y: 37.8, nextPlayer: 'TOWER_MID', nextEnemy: 'SW_MID' },
  TOWER_MID: { id: 'TOWER_MID', x: 18.0, y: 31.5, nextPlayer: 'SW_UP', nextEnemy: 'M1' },
  SW_UP: { id: 'SW_UP', x: 18.0, y: 27.5, switchId: 'switch-upper', left: 'TOWER_L', right: 'TOWER_R', nextEnemy: 'TOWER_MID' },
  R1: { id: 'R1', x: 27.5, y: 42.5, nextPlayer: 'R2', nextEnemy: 'SW_MID' },
  R2: { id: 'R2', x: 28.4, y: 35.0, nextPlayer: 'R3', nextEnemy: 'R1' },
  R3: { id: 'R3', x: 27.0, y: 28.0, nextPlayer: 'TOWER_R', nextEnemy: 'R2' },
  TOWER_L: { id: 'TOWER_L', x: 11.2, y: 21.5, nextPlayer: 'L_TOP', nextEnemy: 'L3' },
  TOWER_R: { id: 'TOWER_R', x: 24.8, y: 21.5, nextPlayer: 'R_TOP', nextEnemy: 'R3' },
  L_TOP: { id: 'L_TOP', x: 12.6, y: 14.5, nextPlayer: 'BOSS', nextEnemy: 'TOWER_L' },
  R_TOP: { id: 'R_TOP', x: 23.4, y: 14.5, nextPlayer: 'BOSS', nextEnemy: 'TOWER_R' },
  BOSS: { id: 'BOSS', x: 18.0, y: 9.5, nextPlayer: null, nextEnemy: 'L_TOP' },
};

export function dist2D(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

export function isInsideLava(x, y, margin = 0) {
  for (const obs of LAVA_OBSTACLES) {
    const dx = (x - obs.cx) / (obs.rx + margin);
    const dy = (y - obs.cy) / (obs.ry + margin);
    if (dx * dx + dy * dy <= 1.0) return true;
  }
  return false;
}

export function clampToArena(x, y) {
  return {
    x: Math.max(3.0, Math.min(MAP_WIDTH - 3.0, x)),
    y: Math.max(6.0, Math.min(MAP_HEIGHT - 5.5, y)),
  };
}

export function resolveNextNodeId(nodeId, team, switches) {
  const node = WAYPOINT_NODES[nodeId];
  if (!node) return null;
  if (team === 'player') {
    if (node.switchId) {
      const dir = switches?.[node.switchId]?.dir || 'left';
      return dir === 'right' ? node.right : node.left;
    }
    return node.nextPlayer;
  }
  return node.nextEnemy;
}

export function pickInitialNodeId(x, y, team) {
  let bestId = team === 'player' ? 'SW_BOT' : 'BOSS';
  let bestScore = Infinity;
  for (const node of Object.values(WAYPOINT_NODES)) {
    if (team === 'player' && node.id === 'BOSS') continue;
    if (team === 'enemy' && node.id === 'P_BASE') continue;
    const d = dist2D(x, y, node.x, node.y);
    // Slight directional bias so units prefer nodes ahead of them
    const forwardBonus = team === 'player' ? (node.y < y ? -1.8 : 2.5) : (node.y > y ? -1.8 : 2.5);
    const score = d + forwardBonus;
    if (score < bestScore) {
      bestScore = score;
      bestId = node.id;
    }
  }
  return bestId;
}

export function getPlayerDeployZones(state) {
  const zones = [
    { kind: 'rect', xMin: 4.5, xMax: 31.5, yMin: 47.0, yMax: 58.0 },
  ];
  for (const s of state.structures || []) {
    if (s.team === 'player' && s.hp > 0 && !s.rebuilding) {
      zones.push({ kind: 'circle', x: s.x, y: s.y, r: s.deployRadius || 5.8 });
    }
  }
  return zones;
}

export function isValidDeployPosition(x, y, spec, state) {
  if (x < 2.8 || x > MAP_WIDTH - 2.8 || y < 5.5 || y > MAP_HEIGHT - 5.2) {
    return { valid: false, reason: '超出战场边界' };
  }

  if (spec?.isSpell) {
    return { valid: true };
  }

  // Ground non-flying troops cannot be dropped directly inside lava pits
  if (!spec?.isFlying && isInsideLava(x, y, 0.1)) {
    return { valid: false, reason: '不可部署在熔岩障碍上' };
  }

  // Cannot drop units directly on top of Onyxia boss core
  if (dist2D(x, y, ONYXIA_POS.x, ONYXIA_POS.y) < 3.4) {
    return { valid: false, reason: '不可直接重叠部署在奥妮克希亚本体上' };
  }

  if (spec?.slug === 'ragnaros') {
    const nearFriendlyStructure = (state.structures || []).some(
      (s) => s.team === 'player' && s.hp > 0 && !s.rebuilding && dist2D(x, y, s.x, s.y) <= (s.deployRadius || 5.8)
    );
    return nearFriendlyStructure
      ? { valid: true }
      : { valid: false, reason: '拉格纳罗斯必须部署在己方基地或防御塔上' };
  }

  if (spec?.isUnbound) {
    return { valid: true };
  }

  const zones = getPlayerDeployZones(state);
  for (const z of zones) {
    if (z.kind === 'rect') {
      if (x >= z.xMin && x <= z.xMax && y >= z.yMin && y <= z.yMax) {
        return { valid: true };
      }
    } else if (z.kind === 'circle') {
      if (dist2D(x, y, z.x, z.y) <= z.r) {
        return { valid: true };
      }
    }
  }

  return { valid: false, reason: '请部署在己方底线或已占领防御塔附近（空投/法术可全图部署）' };
}

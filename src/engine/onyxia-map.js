import missionData from '../data/onyxia-mission-data.json' with { type: 'json' };

export const CAMERA_BOUNDS = missionData.cameraBounds || { cx: 0, cz: 39, width: 56, depth: 114 };

export const ARENA_BOUNDS = {
  xMin: -25.5,
  xMax: 25.5,
  zMin: -6.5,
  zMax: 84.5,
};

export const MAP_WIDTH = CAMERA_BOUNDS.width; // 56
export const MAP_HEIGHT = CAMERA_BOUNDS.depth; // 114

export const ONYXIA_POS = { x: 0.0, z: 78.5, radius: 8.0 };
export const PLAYER_BASE_POS = { x: 0.0, z: 0.0, radius: 3.2 };

// Official Onyxia BoardWipe relativeRadius=39 + Onyxia collider radius=8 -> 47m from (0, 78.5)
export const PHASE_WIPE_RADIUS = 47.0;

// 4 authentic volcanic unwalkable islands extracted from mission_onyxia.bundle
export const UNWALKABLE_OBSTACLES = missionData.unwalkables || [];

const unitByName = new Map(missionData.units.map((u) => [u.name, u]));
const roadByGuid = new Map(missionData.roads.map((r) => [r.guid, r]));
const roadByName = new Map(missionData.roads.map((r) => [r.name, r]));

function getUnitPos(name, fallbackX, fallbackZ) {
  const u = unitByName.get(name);
  if (!u) return { x: fallbackX, z: fallbackZ };
  return { x: u.x, z: u.z };
}

export const INITIAL_STRUCTURES = [
  {
    id: 'player-base',
    guid: unitByName.get('HomeBase')?.guid || 'd316f315c39d482c87dfbd9a4a5a036d',
    kind: 'base',
    nameZh: '联盟主基地',
    team: 'player',
    x: PLAYER_BASE_POS.x,
    z: PLAYER_BASE_POS.z,
    radius: PLAYER_BASE_POS.radius,
    maxHp: 5800,
    range: 11.5,
    damage: 195,
    attackInterval: 1.35,
    splashRadius: 2.2,
    resetsOnPhase: false,
  },
  {
    id: 'tower-mid',
    guid: unitByName.get('Tower 1')?.guid || 'a3e271ba03014d8d88deb137dd551bdd',
    kind: 'tower',
    nameZh: '中路要塞哨塔',
    team: 'enemy',
    ...getUnitPos('Tower 1', -2, 25),
    radius: 2.3,
    maxHp: 1900,
    range: 11.0,
    damage: 135,
    attackInterval: 1.4,
    // Distance from (0, 78.5) is 53.54 > PHASE_WIPE_RADIUS (47.0) -> survives P2/P3 wipe!
    resetsOnPhase: false,
  },
  {
    id: 'tower-left',
    guid: unitByName.get('Tower 2')?.guid || '4a3ec2d63b5d479583ad0e38bee67ffa',
    kind: 'tower',
    nameZh: '西翼龙巢哨塔',
    team: 'enemy',
    ...getUnitPos('Tower 2', -12, 44),
    radius: 2.3,
    maxHp: 1900,
    range: 11.0,
    damage: 135,
    attackInterval: 1.4,
    // Distance from (0, 78.5) is 36.53 <= 47.0 -> wiped & reclaimed by Onyxia!
    resetsOnPhase: true,
  },
  {
    id: 'tower-right',
    guid: unitByName.get('Tower 3')?.guid || 'd157ae335d2045cb83c56fc2bc83432b',
    kind: 'tower',
    nameZh: '东翼龙巢哨塔',
    team: 'enemy',
    ...getUnitPos('Tower 3', 12, 50),
    radius: 2.3,
    maxHp: 1900,
    range: 11.0,
    damage: 135,
    attackInterval: 1.4,
    // Distance from (0, 78.5) is 30.92 <= 47.0 -> wiped & reclaimed by Onyxia!
    resetsOnPhase: true,
  },
];

export const INITIAL_MINES = [1, 2, 3, 4].map((idx) => {
  const name = `Gold Mine ${idx}`;
  const pos = getUnitPos(name, 0, 24);
  return {
    id: `mine-${idx}`,
    name,
    x: pos.x,
    z: pos.z,
    gold: 2,
    maxGold: 3,
    regenTimer: 0,
    regenInterval: 16,
  };
});

export const INITIAL_CHESTS = [1, 2].map((idx) => {
  const name = `Treasure Chest ${idx}`;
  const pos = getUnitPos(name, 0, 20);
  return {
    id: `chest-${idx}`,
    name,
    x: pos.x,
    z: pos.z,
    hp: 200,
    maxHp: 200,
    alive: true,
    respawnTimer: 0,
    respawnInterval: 45,
    reward: 2,
  };
});

export const WHELP_EGG_SPAWNERS = {
  left: missionData.units
    .filter((u) => u.name.startsWith('Egg Spawner 1-'))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((u) => ({ name: u.name, x: u.x, z: u.z })),
  right: missionData.units
    .filter((u) => u.name.startsWith('Egg Spawner 2-'))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((u) => ({ name: u.name, x: u.x, z: u.z })),
};

export const ELEMENTAL_CAVEIN_SPAWNERS = [1, 2, 3, 4].map((idx) => {
  const pos = getUnitPos(`CaveIn Elemental Spawner ${idx}`, 0, 45);
  return { id: `cavein-elem-${idx}`, x: pos.x, z: pos.z };
});

export const WARDER_CAVEIN_SPAWNERS = [1, 2].map((idx) => {
  const pos = getUnitPos(`CaveIn Warder Spawner ${idx}`, idx === 1 ? -6 : 6, 65);
  return {
    id: `cavein-warder-${idx}`,
    x: pos.x,
    z: pos.z,
    nodeId: idx === 1 ? roadByName.get('West Path 11')?.guid : roadByName.get('East Path 12')?.guid,
  };
});

// Interactive switches combining Blizzard's 3 mission switches + Tower 1 forward fork
const eastSw = missionData.switches.find((s) => s.name === 'East Lane Switch');
const t2Sw = missionData.switches.find((s) => s.name === 'Tower 2 Switch');
const t3Sw = missionData.switches.find((s) => s.name === 'Tower 3 Switch');

export const INITIAL_SWITCHES = {
  'switch-tower-1': {
    id: 'switch-tower-1',
    name: 'Tower 1 Fork',
    label: '中塔分岔',
    x: -2.0,
    z: 27.6,
    dir: 'left', // left -> Middle Path 4 (-7.5, 32), right -> Mid to East Traverse (6, 27.5)
    leftRoad: roadByName.get('Middle Path 4')?.guid,
    rightRoad: roadByName.get('Mid to East Traverse')?.guid,
  },
  'switch-east-lane': {
    id: 'switch-east-lane',
    name: eastSw?.name || 'East Lane Switch',
    label: '东路合流岔道',
    x: eastSw?.x ?? 12.5,
    z: eastSw?.z ?? 32.0,
    dir: 'right', // For enemy TowardsBottom at East Path 6: left -> Mid to East Traverse, right -> East Path 5
    leftRoad: roadByName.get('Mid to East Traverse')?.guid,
    rightRoad: roadByName.get('East Path 5')?.guid,
  },
  'switch-tower-2': {
    id: 'switch-tower-2',
    name: t2Sw?.name || 'Tower 2 Switch',
    label: '西塔岔道',
    x: t2Sw?.x ?? -12.0,
    z: t2Sw?.z ?? 44.0,
    dir: 'right', // At Middle Path 5: left -> West Path 7 (west flank), right -> Middle Path 6
    leftRoad: roadByName.get('West Path 6')?.guid,
    rightRoad: roadByName.get('Middle Path 5')?.guid,
  },
  'switch-tower-3': {
    id: 'switch-tower-3',
    name: t3Sw?.name || 'Tower 3 Switch',
    label: '东塔岔道',
    x: t3Sw?.x ?? 12.0,
    z: t3Sw?.z ?? 50.0,
    dir: 'right', // At East Path 10/Middle Path 8: left -> Middle Path 8, right -> East Path 9
    leftRoad: roadByName.get('Middle Path 8')?.guid,
    rightRoad: roadByName.get('East Path 9')?.guid,
  },
};

// Build complete acyclic directed waypoint graph for both TowardsTop & TowardsBottom
const BOTTOM_FALLBACKS = {
  'East Path 11': roadByName.get('East Path 10')?.guid,
  'Middle Path 7': roadByName.get('Middle Path 6')?.guid,
  'West Path 8': roadByName.get('West Path 7')?.guid,
  'East Path 6': roadByName.get('East Path 5')?.guid,
};

export const WAYPOINT_NODES = {
  P_BASE: { id: 'P_BASE', name: 'HomeBase', x: PLAYER_BASE_POS.x, z: PLAYER_BASE_POS.z, nextTop: roadByName.get('Middle Path 0')?.guid, nextBottom: null },
  BOSS: { id: 'BOSS', name: 'Onyxia', x: ONYXIA_POS.x, z: ONYXIA_POS.z, nextTop: null, nextBottom: roadByName.get('East Path 12')?.guid },
};

for (const r of missionData.roads) {
  const gTop = r.goals.find((g) => !g.teamDirection || g.teamDirection === 'TowardsTop')?.road || '';
  const gBot = r.goals.find((g) => g.teamDirection === 'TowardsBottom')?.road || BOTTOM_FALLBACKS[r.name] || '';

  WAYPOINT_NODES[r.guid] = {
    id: r.guid,
    name: r.name,
    x: r.x,
    z: r.z,
    nextTop: gTop || 'BOSS',
    nextBottom: gBot || 'P_BASE',
  };
}

export const DEPLOY_AREA_DEFS = missionData.deployAreas.map((da) => ({
  id: da.guid,
  name: da.name,
  unitGuid: da.unitGuid,
  x: da.x,
  z: da.z,
  width: da.width,
  depth: da.depth,
  xMin: da.x - da.width * 0.5,
  xMax: da.x + da.width * 0.5,
  zMin: da.z - da.depth * 0.5,
  zMax: da.z + da.depth * 0.5,
  topRoad: da.goals.find((g) => !g.teamDirection || g.teamDirection === 'TowardsTop')?.road || null,
  bottomRoad: da.goals.find((g) => g.teamDirection === 'TowardsBottom')?.road || null,
}));

export function dist2D(ax, az, bx, bz) {
  return Math.hypot(ax - bx, az - bz);
}

export function isInsideUnwalkable(x, z, margin = 0) {
  for (const obs of UNWALKABLE_OBSTACLES) {
    const dx = (x - obs.cx) / Math.max(0.5, obs.rx + margin);
    const dz = (z - obs.cz) / Math.max(0.5, obs.rz + margin);
    if (dx * dx + dz * dz <= 1.0) return true;
  }
  return false;
}

export function clampToArena(x, z) {
  return {
    x: Math.max(ARENA_BOUNDS.xMin, Math.min(ARENA_BOUNDS.xMax, x)),
    z: Math.max(ARENA_BOUNDS.zMin, Math.min(ARENA_BOUNDS.zMax, z)),
  };
}

export function getSwitchTargetPoint(sw, team = 'player') {
  if (!sw) return null;
  if (sw.id === 'switch-tower-1') {
    const targetGuid = sw.dir === 'right' ? sw.rightRoad : sw.leftRoad;
    return roadByGuid.get(targetGuid) || { x: sw.x, z: sw.z + 5 };
  }
  if (sw.id === 'switch-east-lane') {
    const targetGuid = sw.dir === 'left' ? sw.leftRoad : sw.rightRoad;
    return roadByGuid.get(targetGuid) || { x: sw.x, z: sw.z - 5 };
  }
  if (sw.id === 'switch-tower-2') {
    if (team === 'player') {
      return sw.dir === 'left' ? roadByName.get('West Path 7') : roadByName.get('Middle Path 6');
    }
    return sw.dir === 'left' ? roadByGuid.get(sw.leftRoad) : roadByGuid.get(sw.rightRoad);
  }
  if (sw.id === 'switch-tower-3') {
    return sw.dir === 'left' ? roadByGuid.get(sw.leftRoad) : roadByGuid.get(sw.rightRoad);
  }
  return null;
}

export function resolveNextNodeId(nodeId, team, switches) {
  const node = WAYPOINT_NODES[nodeId];
  if (!node) return null;

  if (team === 'player') {
    if (node.name === 'Middle Path 3' && switches?.['switch-tower-1']) {
      const sw = switches['switch-tower-1'];
      return sw.dir === 'right' ? sw.rightRoad : sw.leftRoad;
    }
    if (node.name === 'Middle Path 5' && switches?.['switch-tower-2']) {
      const sw = switches['switch-tower-2'];
      if (sw.dir === 'left') return roadByName.get('West Path 7')?.guid || node.nextTop;
      return roadByName.get('Middle Path 6')?.guid || node.nextTop;
    }
    return node.nextTop;
  }

  // Enemy (TowardsBottom)
  if (node.name === 'East Path 6' && switches?.['switch-east-lane']) {
    const sw = switches['switch-east-lane'];
    return sw.dir === 'left' ? sw.leftRoad : sw.rightRoad;
  }
  if (node.name === 'East Path 10' && switches?.['switch-tower-3']) {
    const sw = switches['switch-tower-3'];
    return sw.dir === 'left' ? sw.leftRoad : sw.rightRoad;
  }
  if (node.name === 'West Path 7' && switches?.['switch-tower-2']) {
    const sw = switches['switch-tower-2'];
    if (sw.dir === 'right') return sw.rightRoad;
  }
  return node.nextBottom;
}

export function pickInitialNodeId(x, z, team) {
  // Check official deploy areas first for exact lane assignment
  for (const da of DEPLOY_AREA_DEFS) {
    if (x >= da.xMin && x <= da.xMax && z >= da.zMin && z <= da.zMax) {
      const candidate = team === 'player' ? da.topRoad : da.bottomRoad;
      if (candidate && WAYPOINT_NODES[candidate]) return candidate;
    }
  }

  let bestId = team === 'player' ? roadByName.get('Middle Path 0')?.guid || 'BOSS' : 'P_BASE';
  let bestScore = Infinity;
  for (const node of Object.values(WAYPOINT_NODES)) {
    if (team === 'player' && node.id === 'P_BASE') continue;
    if (team === 'enemy' && node.id === 'BOSS') continue;
    const d = dist2D(x, z, node.x, node.z);
    // Forward preference: player advances +z, enemy advances -z
    const forwardBias = team === 'player' ? (node.z >= z - 1.5 ? -2.4 : 4.0) : (node.z <= z + 1.5 ? -2.4 : 4.0);
    const score = d + forwardBias;
    if (score < bestScore) {
      bestScore = score;
      bestId = node.id;
    }
  }
  return bestId;
}

export function getPlayerDeployZones(state) {
  const friendlyGuids = new Set(
    (state.structures || [])
      .filter((s) => s.team === 'player' && s.hp > 0 && !s.rebuilding)
      .map((s) => s.guid)
  );
  return DEPLOY_AREA_DEFS.filter((da) => !da.name.startsWith('Boss') && friendlyGuids.has(da.unitGuid));
}

export function getBossDeployAreas() {
  return DEPLOY_AREA_DEFS.filter((da) => da.name.startsWith('Boss'));
}

export function getStructureDeployAreas(structureGuid) {
  return DEPLOY_AREA_DEFS.filter((da) => da.unitGuid === structureGuid);
}

export function isValidDeployPosition(x, z, spec, state) {
  if (x < ARENA_BOUNDS.xMin || x > ARENA_BOUNDS.xMax || z < ARENA_BOUNDS.zMin || z > ARENA_BOUNDS.zMax) {
    return { valid: false, reason: '超出战场边界' };
  }

  if (spec?.isSpell) {
    return { valid: true };
  }

  if (!spec?.isFlying && isInsideUnwalkable(x, z, 0.25)) {
    return { valid: false, reason: '不可部署在熔岩/岩壁障碍上' };
  }

  if (dist2D(x, z, ONYXIA_POS.x, ONYXIA_POS.z) < ONYXIA_POS.radius + 0.5) {
    return { valid: false, reason: '不可直接部署在奥妮克希亚本体内' };
  }

  if (spec?.slug === 'ragnaros') {
    const nearFriendly = (state.structures || []).some(
      (s) => s.team === 'player' && s.hp > 0 && !s.rebuilding && dist2D(x, z, s.x, s.z) <= (s.radius || 2.5) + 4.5
    );
    return nearFriendly
      ? { valid: true }
      : { valid: false, reason: '拉格纳罗斯必须部署在己方基地或防御塔上' };
  }

  if (spec?.isUnbound) {
    return { valid: true };
  }

  const zones = getPlayerDeployZones(state);
  for (const da of zones) {
    if (x >= da.xMin && x <= da.xMax && z >= da.zMin && z <= da.zMax) {
      return { valid: true };
    }
  }

  return { valid: false, reason: '请部署在蓝色部署网格（基地或已占领哨塔区域）内' };
}

export const ONYXIA_TAUNTS = missionData.onyxiaTaunts || [
  '真走运……我的下一餐自己送上门来了。',
  '你会付出代价的！',
  '要明白你的处境！',
];

import { MINIS } from '../data/minis.js';
import { MINI_ART } from '../data/mini-art.js';
import { DISPLAY_MINI_ART } from '../data/mini-art-display.js';

export const MINI_BY_SLUG = new Map(MINIS.map((m) => [m.slug, m]));
export const MINI_BY_SHORT_ID = new Map(MINIS.filter((m) => m.shortId != null).map((m) => [m.shortId, m]));

export const SPEED_YARDS_PER_SEC = {
  Stationary: 0,
  Slow: 1.55,
  Medium: 2.35,
  'Med-Fast': 3.15,
  Fast: 4.15,
};

/**
 * Explicit Squad calibration table so per-member HP/damage matches official in-game squads
 * (some entries in minis.js record per-member stats, others record total or summary stats).
 */
export const SQUAD_SPECS = {
  'angry-chickens': { count: 5, hpEach: 65, dmgEach: 45, weight: 'light' },
  'vultures': { count: 2, hpEach: 115, dmgEach: 70, weight: 'light' },
  'dire-batlings': { count: 3, hpEach: 90, dmgEach: 48, weight: 'light' },
  'defias-bandits': { count: 2, hpEach: 120, dmgEach: 35, weight: 'light' },
  'spiderlings': { count: 4, hpEach: 95, dmgEach: 40, weight: 'light' },
  'murloc-tidehunters': { count: 2, hpEach: 110, dmgEach: 90, weight: 'light' },
  'goblin-sapper': { count: 2, hpEach: 130, dmgEach: 450, suicideSiege: true, weight: 'light' },
  'skeletons': { count: 3, hpEach: 150, dmgEach: 46, weight: 'light' },
  'skeleton-party': { count: 5, hpEach: 200, dmgEach: 48, weight: 'light' },
  'harpies': { count: 3, hpEach: 150, dmgEach: 140, weight: 'light' },
  'raptors': { count: 3, hpEach: 220, dmgEach: 110, weight: 'light' },
  'whelp-eggs': { count: 3, hpEach: 35, dmgEach: 0, hatchesInto: 'player-whelp', whelpHp: 140, whelpDmg: 110, weight: 'light' },
  'footmen': { count: 4, hpEach: 800, dmgEach: 70, weight: 'heavy' },
  'warsong-grunts': { count: 2, hpEach: 860, dmgEach: 95, weight: 'medium' },
  'core-hounds': { count: 2, hpEach: 1600, dmgEach: 220, eternalBond: true, weight: 'heavy' },
  'mountaineer': {
    count: 2,
    weight: 'medium',
    members: [
      { role: 'bear', nameZh: '铁炉堡战熊', hp: 1300, dmg: 110, range: 1.5, attackInterval: 1.5, traits: ['Tank', 'Armored', 'Melee'] },
      { role: 'hunter', nameZh: '矮人狙击手', hp: 400, dmg: 170, range: 8.5, attackInterval: 1.6, traits: ['Ranged', 'Heal Squadmate'] },
    ],
  },
  'treant': { count: 2, hpEach: 225, dmgEach: 90, weight: 'medium' },
};

/**
 * Non-collectible & synthetic unit templates (Kobold Miner, Onyxia Boss, Warders, Whelps, Summons).
 */
export const SPECIAL_UNITS = {
  'kobold-miner': {
    slug: 'kobold-miner',
    name: 'Kobold Miner',
    nameZh: '狗头人矿工',
    type: 'Troop',
    families: ['Neutral'],
    cost: 1,
    health: 150,
    damage: 25,
    speed: 'Medium',
    range: 1.4,
    attackInterval: 1.5,
    traits: ['Miner', 'Cycle', 'Melee', 'One-Target'],
    weight: 'light',
    sprite: './r/d/m/kobold-overseer.webp',
  },
  'onyxia-warder': {
    slug: 'onyxia-warder',
    name: 'Onyxia Warder',
    nameZh: '奥妮克希亚守卫',
    type: 'Troop',
    families: ['Blackrock'],
    cost: 5,
    health: 2400,
    damage: 115,
    speed: 'Slow',
    range: 8.5,
    attackInterval: 1.3,
    splashRadius: 2.8,
    knockback: 1.2,
    traits: ['Resistant', 'Elemental', 'Ranged', 'AoE'],
    weight: 'heavy',
    sprite: './r/d/m/onyxia-warder.webp',
  },
  'onyxia-whelp': {
    slug: 'onyxia-whelp',
    name: 'Onyxian Whelp',
    nameZh: '奥妮克希亚雏龙',
    type: 'Troop',
    families: ['Blackrock'],
    cost: 1,
    health: 110,
    damage: 48,
    speed: 'Med-Fast',
    range: 3.5,
    attackInterval: 1.4,
    traits: ['Flying', 'Poisonous', 'Elemental', 'Ranged'],
    weight: 'light',
    sprite: './r/d/m/whelp-eggs.webp',
  },
  'onyxia-egg': {
    slug: 'onyxia-egg',
    name: 'Onyxian Whelp Egg',
    nameZh: '奥妮克希亚龙蛋',
    type: 'Troop',
    families: ['Blackrock'],
    cost: 0,
    health: 30,
    damage: 0,
    speed: 'Stationary',
    range: 0,
    attackInterval: 99,
    traits: ['Hatching'],
    weight: 'light',
    sprite: './r/d/m/whelp-eggs.webp',
  },
  'player-whelp': {
    slug: 'player-whelp',
    name: 'Whelp',
    nameZh: '黑龙雏龙',
    type: 'Troop',
    families: ['Blackrock'],
    cost: 1,
    health: 140,
    damage: 110,
    speed: 'Med-Fast',
    range: 3.8,
    attackInterval: 1.4,
    traits: ['Flying', 'Elemental', 'AoE'],
    weight: 'light',
    sprite: './r/d/m/whelp-eggs.webp',
  },
  'spirit-wolf': {
    slug: 'spirit-wolf',
    name: 'Spirit Wolf',
    nameZh: '幽灵狼',
    type: 'Troop',
    families: ['Horde'],
    cost: 1,
    health: 700,
    damage: 100,
    speed: 'Fast',
    range: 1.5,
    attackInterval: 1.2,
    traits: ['Elemental', 'Charge', 'Melee'],
    weight: 'medium',
    sprite: './r/d/m/prowler.webp',
  },
  'skeleton-minion': {
    slug: 'skeleton-minion',
    name: 'Skeleton',
    nameZh: '骷髅兵',
    type: 'Troop',
    families: ['Undead'],
    cost: 1,
    health: 180,
    damage: 46,
    speed: 'Medium',
    range: 1.4,
    attackInterval: 1.4,
    traits: ['Melee', 'Squad'],
    weight: 'light',
    sprite: './r/d/m/skeletons.webp',
  },
  'skeleton-mage': {
    slug: 'skeleton-mage',
    name: 'Skeleton Mage',
    nameZh: '骷髅法师',
    type: 'Troop',
    families: ['Undead'],
    cost: 1,
    health: 200,
    damage: 55,
    speed: 'Medium',
    range: 7.0,
    attackInterval: 1.5,
    traits: ['Elemental', 'Frost', 'Ranged'],
    weight: 'light',
    sprite: './r/d/m/skeleton-party.webp',
  },
  'scarab': {
    slug: 'scarab',
    name: 'Scarab',
    nameZh: '圣甲虫',
    type: 'Troop',
    families: ['Undead'],
    cost: 1,
    health: 120,
    damage: 45,
    speed: 'Fast',
    range: 1.3,
    attackInterval: 1.1,
    traits: ['Poisonous', 'Melee'],
    weight: 'light',
    sprite: './r/d/m/spiderlings.webp',
  },
};

export function resolveMiniSprite(slug) {
  if (!slug) return './r/crest.png';
  if (SPECIAL_UNITS[slug]) return SPECIAL_UNITS[slug].sprite;
  const disp = DISPLAY_MINI_ART[slug]?.model?.src;
  if (disp) return disp;
  const orig = MINI_ART[slug]?.model;
  if (orig) return orig;
  const mini = MINI_BY_SLUG.get(slug);
  return mini?.img || './r/crest.png';
}

export function resolvePortraitSprite(slug) {
  const disp = DISPLAY_MINI_ART[slug]?.portrait?.src;
  if (disp) return disp;
  const orig = MINI_ART[slug]?.portrait;
  if (orig) return orig;
  return resolveMiniSprite(slug);
}

const SPLIT_STATUE_BASES = new Map([
  ['Horde|Blackrock', './r/authentic/statue-base-split-horde-blackrock.webp'],
  ['Blackrock|Horde', './r/authentic/statue-base-split-blackrock-horde.webp'],
  ['Alliance|Undead', './r/authentic/statue-base-split-alliance-undead.webp'],
  ['Undead|Alliance', './r/authentic/statue-base-split-alliance-undead.webp'],
  ['Alliance|Cenarion', './r/authentic/statue-base-split-alliance-cenarion.webp'],
  ['Cenarion|Alliance', './r/authentic/statue-base-split-alliance-cenarion.webp'],
  ['Beast|Blackrock', './r/authentic/statue-base-split-beast-blackrock.webp'],
  ['Blackrock|Beast', './r/authentic/statue-base-split-beast-blackrock.webp'],
  ['Undead|Beast', './r/authentic/statue-base-split-undead-beast.webp'],
  ['Beast|Undead', './r/authentic/statue-base-split-undead-beast.webp'],
  ['Undead|Horde', './r/authentic/statue-base-split-undead-horde.webp'],
  ['Horde|Undead', './r/authentic/statue-base-split-undead-horde.webp'],
]);

export function resolveStatueBase(families = []) {
  const list = Array.isArray(families) && families.length > 0 ? families : ['Neutral'];
  if (list.length >= 2) {
    const key = `${list[0]}|${list[1]}`;
    if (SPLIT_STATUE_BASES.has(key)) return SPLIT_STATUE_BASES.get(key);
  }
  const fam = String(list[0] || 'Neutral').toLowerCase();
  const valid = new Set(['alliance', 'horde', 'blackrock', 'beast', 'undead', 'cenarion', 'neutral']);
  return valid.has(fam) ? `./r/authentic/statue-base-${fam}.webp` : './r/authentic/statue-base-neutral.webp';
}

/**
 * Strictly maps share-code talentIndex to the mini.talents entry using t.codeIndex.
 * Never confuse UI array position with protobuf codeIndex!
 */
export function getEquippedTalent(mini, talentIndex) {
  if (!mini || !Array.isArray(mini.talents) || mini.talents.length === 0) return null;
  if (talentIndex === null || talentIndex === undefined) return null;
  const matched = mini.talents.find((t) => t.codeIndex === talentIndex);
  return matched || mini.talents[talentIndex] || mini.talents[0];
}

function parseExtraNumber(mini, keywordRegex) {
  if (!Array.isArray(mini?.statsExtra)) return null;
  for (const item of mini.statsExtra) {
    const text = `${item.label || ''} ${item.value || ''}`;
    if (keywordRegex.test(text)) {
      const m = String(item.value || '').match(/(\d+(?:\.\d+)?)/);
      if (m) return Number(m[1]);
    }
  }
  return null;
}

function inferSpeedKey(mini) {
  if (mini.speed && SPEED_YARDS_PER_SEC[mini.speed] !== undefined) return mini.speed;
  const traits = mini.traits || [];
  if (traits.includes('Fast')) return 'Fast';
  if (traits.includes('Slow')) return 'Slow';
  return 'Medium';
}

function inferWeight(mini, traits) {
  if (SQUAD_SPECS[mini.slug]?.weight) return SQUAD_SPECS[mini.slug].weight;
  if (traits.has('Flying')) return 'light';
  if (traits.has('Tank') || (mini.health || 0) >= 1200) return 'heavy';
  if (traits.has('Cycle') || (mini.cost || 0) <= 2) return 'light';
  return 'medium';
}

export function getLevelMultiplier(levelDelta = 0) {
  return Math.pow(1.1, levelDelta);
}

/**
 * Returns normalized combat specification for any of the 93 minis or synthetic special units.
 */
export function getUnitCombatSpec(slug, talentIndex = 0, levelDelta = 0) {
  const scale = getLevelMultiplier(levelDelta);
  const special = SPECIAL_UNITS[slug];
  if (special) {
    const traits = new Set(special.traits || []);
    return {
      slug: special.slug,
      nameZh: special.nameZh,
      type: special.type,
      families: special.families || ['Neutral'],
      cost: special.cost,
      talentIndex: 0,
      talent: null,
      hp: Math.round(special.health * scale),
      damage: Math.round(special.damage * scale),
      range: special.range,
      attackInterval: special.attackInterval,
      splashRadius: special.splashRadius || (traits.has('AoE') ? 2.2 : 0),
      speed: SPEED_YARDS_PER_SEC[special.speed] ?? 2.35,
      speedKey: special.speed,
      weight: special.weight || 'medium',
      isFlying: traits.has('Flying'),
      isUnbound: traits.has('Unbound'),
      isRanged: traits.has('Ranged') || special.range >= 3.0,
      isBombard: traits.has('Bombard'),
      isSiegeOnly: traits.has('Siege Specialist'),
      isSiegeDamage: traits.has('Siege Damage'),
      isMiner: traits.has('Miner'),
      isHealer: traits.has('Healer'),
      isArmored: traits.has('Armored'),
      isResistant: traits.has('Resistant'),
      isElemental: traits.has('Elemental'),
      isPoisonous: traits.has('Poisonous'),
      isBurn: traits.has('Burn'),
      isFrost: traits.has('Frost'),
      isStealth: traits.has('Stealth'),
      isDetect: traits.has('Detect'),
      isUnstoppable: traits.has('Unstoppable'),
      isSpell: special.type === 'Spell',
      count: 1,
      knockback: special.knockback || 0,
      traits: Array.from(traits),
      sprite: special.sprite,
    };
  }

  const mini = MINI_BY_SLUG.get(slug);
  if (!mini) {
    throw new Error(`Unknown mini slug: ${slug}`);
  }

  const traits = new Set(mini.traits || []);
  const talent = getEquippedTalent(mini, talentIndex);
  const squad = SQUAD_SPECS[slug];

  let cost = Math.max(1, mini.cost || 1);
  if (slug === 'ancient-of-war') cost = 3; // Surge default minimum practical cast
  if (slug === 'treant') cost = 1;

  let baseHp = mini.health || 300;
  let baseDmg = mini.damage || 60;
  let count = squad?.count || 1;
  if (squad?.hpEach) baseHp = squad.hpEach;
  if (squad?.dmgEach) baseDmg = squad.dmgEach;

  // Ysera special: deploys as Emerald Drake squad instead of 0 HP
  if (slug === 'ysera') {
    baseHp = 560;
    baseDmg = 185;
    traits.add('Flying');
  }

  const speedKey = inferSpeedKey(mini);
  let speed = SPEED_YARDS_PER_SEC[speedKey] ?? 2.35;

  let range = parseExtraNumber(mini, /射程|附身射程/);
  if (range == null) {
    if (traits.has('Ranged') || traits.has('Flying') || traits.has('Healer')) range = 6.5;
    else range = 1.55;
  }
  if (slug === 'drake' && range < 5) range = 6.5;
  if (slug === 'chimaera') range = 6.0;
  if (slug === 'whelp-eggs') range = 3.8;

  let attackInterval = parseExtraNumber(mini, /攻击间隔|治疗间隔/);
  if (!attackInterval || attackInterval < 0.4) {
    if (mini.dps > 0 && baseDmg > 0) {
      attackInterval = Math.min(3.5, Math.max(0.7, Number((baseDmg / mini.dps).toFixed(2))));
    } else {
      attackInterval = 1.6;
    }
  }

  let splashRadius = traits.has('AoE') ? 2.4 : 0;
  let stationary = speedKey === 'Stationary';

  // Talent overrides (deep mechanics for meta & Onyxia units)
  if (slug === 'vultures' && talentIndex === 2) count = 3; // Migration (+1 vulture)
  if (slug === 'warsong-grunts' && talentIndex === 1) {
    cost = Math.max(1, cost - 1);
    traits.add('Armored');
  }
  if (slug === 'gryphon-rider' && talentIndex === 2) {
    range += 3.0; // Stormhammer (+3 range -> ~8.0-10.5)
  }
  if (slug === 'meat-wagon' && talentIndex === 1) {
    range = Math.max(range, 12.8); // Filet Trebuchet (out-ranges Onyxia 12.0!)
  }
  if (slug === 'meat-wagon' && talentIndex === 2) {
    attackInterval *= 0.78;
  }
  if (slug === 'plague-farmer' && talentIndex === 2) {
    range += 1.0; // Splashing Pumpkins
    splashRadius = 3.6;
  }
  if (slug === 'pyromancer' && talentIndex === 1) {
    splashRadius = 3.8; // Conflagrate double splash
  }
  if (slug === 'skeleton-party' && talentIndex === 2) {
    // Ritual of Rime: 5 stationary Frost Mages
    range = 7.0;
    stationary = true;
    traits.add('Ranged');
    traits.add('Frost');
    traits.add('Elemental');
  }
  if (slug === 'darkspear-troll' && talentIndex === 2) {
    traits.add('Poisonous');
  }
  if (slug === 'defias-bandits' && talentIndex === 0) {
    traits.add('Poisonous');
  }
  if (slug === 's-a-f-e-pilot' && talentIndex === 0) {
    traits.add('Stealth');
  }
  if (slug === 'harpy' || slug === 'harpies') {
    if (talentIndex === 1) traits.add('Poisonous');
  }
  if (slug === 'chimaera' && talentIndex === 2) {
    baseHp = Math.round(baseHp * 1.35);
  }
  if (slug === 'quilboar' && talentIndex === 0) {
    speed *= 1.15;
  }
  if (slug === 'execute') {
    baseDmg = 450;
  }

  return {
    slug: mini.slug,
    shortId: mini.shortId,
    nameZh: mini.nameZh,
    type: mini.type,
    families: mini.families || ['Neutral'],
    cost,
    talentIndex,
    talent,
    hp: Math.round(baseHp * scale),
    damage: Math.round(baseDmg * scale),
    range,
    attackInterval,
    splashRadius,
    speed: stationary ? 0 : speed,
    speedKey,
    stationary,
    weight: inferWeight(mini, traits),
    isLeader: mini.type === 'Leader',
    isSpell: mini.type === 'Spell',
    isFlying: traits.has('Flying'),
    isUnbound: traits.has('Unbound'),
    isRanged: traits.has('Ranged') || range >= 3.2,
    isBombard: traits.has('Bombard'),
    isSiegeOnly: traits.has('Siege Specialist') || slug === 'gargoyle',
    isSiegeDamage: traits.has('Siege Damage'),
    isMiner: traits.has('Miner'),
    isHealer: traits.has('Healer'),
    isArmored: traits.has('Armored'),
    isResistant: traits.has('Resistant'),
    isElemental: traits.has('Elemental') || traits.has('Burn') || traits.has('Frost'),
    isPoisonous: traits.has('Poisonous'),
    isBurn: traits.has('Burn'),
    isFrost: traits.has('Frost'),
    isStealth: traits.has('Stealth'),
    isDetect: traits.has('Detect'),
    isUnstoppable: traits.has('Unstoppable'),
    count,
    squad,
    traits: Array.from(traits),
    sprite: resolveMiniSprite(slug),
  };
}

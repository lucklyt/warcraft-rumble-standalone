import { dist2D } from './onyxia-map.js';
import { getUnitCombatSpec } from './unit-stats.js';

/**
 * Computes final damage after Siege, Armored, Resistant, and Vulnerability modifiers.
 */
export function computeDamage(baseDamage, options, target) {
  const {
    damageKind = 'physical',
    isSiege = false,
  } = options || {};

  if (!target || target.invulnTimer > 0) return 0;

  let dmg = baseDamage;
  if (isSiege && (target.isStructure || target.isBoss)) {
    dmg *= 2.0;
  }
  if (damageKind === 'physical' && target.hasArmored) {
    dmg *= 0.5;
  }
  if (damageKind === 'elemental' && target.hasResistant) {
    dmg *= 0.5;
  }
  if (damageKind === 'elemental' && target.elementalVulnTimer > 0) {
    dmg *= 1.5;
  }
  if (damageKind === 'elemental' && target.hasVulnerable) {
    dmg *= 2.0;
  }
  return Math.max(1, Math.round(dmg));
}

export function canAttackTarget(attacker, target) {
  if (!target || !target.alive || target.hp <= 0) return false;
  if (target.team === attacker.team) return false;

  // Stealth check (structures/boss/detect units see stealth)
  if (target.stealthActive && !attacker.isDetect && !attacker.isStructure && !attacker.isBoss) {
    return false;
  }

  // Flying filter
  if (target.isFlying) {
    if (!attacker.isRanged && !attacker.isFlying && !attacker.isStructure && !attacker.isBoss) {
      return false;
    }
    if (attacker.isBombard) {
      return false;
    }
  }

  // Siege-only filter (e.g. Gargoyle, Earth Elemental, Goblin Sapper)
  if (attacker.isSiegeOnly) {
    return Boolean(target.isStructure || target.isBoss || target.isChest);
  }

  return true;
}

export function applyStatusPoison(target, stacks = 1, sourceSlug = 'poison', perTickDmg = 12, sourceTeam = 'player') {
  if (!target || !target.alive || target.isNullify) return;
  target.poisonStacks = Math.min(25, (target.poisonStacks || 0) + stacks);
  target.poisonTimer = 5.0;
  target.poisonTickDmg = Math.max(target.poisonTickDmg || 12, perTickDmg);
  target.poisonSourceSlug = sourceSlug;
  target.poisonSourceTeam = sourceTeam;
}

export function applyStatusBurn(target, sourceSlug = 'burn', perTickDmg = 22, sourceTeam = 'player') {
  if (!target || !target.alive || target.isNullify) return;
  target.burnTimer = 6.0;
  target.burnTickDmg = Math.max(target.burnTickDmg || 22, perTickDmg);
  target.burnSourceSlug = sourceSlug;
  target.burnSourceTeam = sourceTeam;
}

export function applyStatusFrost(target, duration = 3.0) {
  if (!target || !target.alive || target.isUnstoppable || target.isNullify) return;
  target.frostTimer = Math.max(target.frostTimer || 0, duration);
}

export function applyStatusStun(target, duration = 1.5) {
  if (!target || !target.alive || target.isUnstoppable || target.isNullify || target.isBoss || target.isStructure) return;
  target.stunTimer = Math.max(target.stunTimer || 0, duration);
}

export function applyDeployEffects(unit, sim) {
  const spec = unit.spec;
  if (!spec) return;

  // S.A.F.E. Pilot crash-landing AoE
  if (spec.slug === 's-a-f-e-pilot') {
    const crashDmg = Math.round(spec.damage * 1.45);
    sim.dealAreaDamage(unit.x, unit.y, 3.6, crashDmg, {
      team: unit.team,
      damageKind: 'elemental',
      sourceSlug: spec.slug,
      canHitFlying: true,
    });
    sim.addFx({ kind: 'explosion', x: unit.x, y: unit.y, radius: 3.6, color: '#fb923c', duration: 0.45 });
    sim.emitAudio('explosion');
    if (unit.talentIndex === 0) {
      unit.stealthActive = true;
    }
  }

  // Worgen & Defias Bandits start stealthed
  if (spec.isStealth) {
    unit.stealthActive = true;
  }

  // Warsong Grunts talent 1 (Keep Guard): guard mode + armored
  if (spec.slug === 'warsong-grunts' && unit.talentIndex === 1) {
    unit.hasArmored = true;
  }

  // Thrall: Totemic Mastery plants initial totem; Horde deploy check triggers Call of the Horde
  if (spec.slug === 'thrall' && unit.talentIndex === 0) {
    spawnThrallTotem(unit, sim);
    unit.totemTimer = 10.0;
  }

  if (unit.team === 'player' && spec.families?.includes('Horde')) {
    for (const ally of sim.units) {
      if (
        ally.alive &&
        ally.team === 'player' &&
        ally.id !== unit.id &&
        ally.spec?.slug === 'thrall' &&
        ally.talentIndex === 2
      ) {
        ally.bloodlustTimer = Math.max(ally.bloodlustTimer || 0, 5.0);
        sim.dealAreaDamage(ally.x, ally.y, 4.5, 200, {
          team: 'player',
          damageKind: 'elemental',
          sourceSlug: 'thrall',
          canHitFlying: true,
        });
        sim.addFx({ kind: 'ring', x: ally.x, y: ally.y, radius: 4.5, color: '#38bdf8', duration: 0.4 });
      }
    }
  }

  // Ragnaros attaches to nearest friendly structure (or triggers Blast Wave if already attached)
  if (spec.slug === 'ragnaros') {
    const existingRag = sim.units.find(
      (u) => u.alive && u.team === unit.team && u.id !== unit.id && u.spec?.slug === 'ragnaros'
    );
    if (existingRag) {
      const waveDmg = Math.round(240 * sim.getLevelMultiplier(unit.team));
      for (const s of sim.structures) {
        if (s.team === unit.team && s.hp > 0 && !s.rebuilding) {
          sim.dealAreaDamage(s.x, s.y, 6.5, waveDmg, {
            team: unit.team,
            damageKind: 'elemental',
            sourceSlug: 'ragnaros',
            canHitFlying: true,
            applyBurn: true,
          });
          sim.addFx({ kind: 'explosion', x: s.x, y: s.y, radius: 6.5, color: '#f97316', duration: 0.55 });
        }
      }
      sim.emitAudio('explosion');
      unit.hp = 0;
      unit.alive = false;
      return;
    }

    const targetStruct = sim.structures
      .filter((s) => s.team === unit.team && s.hp > 0 && !s.rebuilding)
      .sort((a, b) => dist2D(a.x, a.y, unit.x, unit.y) - dist2D(b.x, b.y, unit.x, unit.y))[0];
    if (targetStruct) {
      unit.x = targetStruct.x;
      unit.y = targetStruct.y + 0.8;
      unit.stationary = true;
      unit.range = 10.5;
      unit.isRanged = true;
      unit.splashRadius = 2.8;
      unit.damage = Math.round(240 * sim.getLevelMultiplier(unit.team));
      unit.attachedStructureId = targetStruct.id;
      targetStruct.ragnarosShield = (targetStruct.ragnarosShield || 0) + unit.maxHp;
      targetStruct.ragnarosMaxShield = targetStruct.ragnarosShield;
      sim.addFx({ kind: 'ring', x: targetStruct.x, y: targetStruct.y, radius: 4.0, color: '#f97316', duration: 0.6 });
    }
  }
}

const TOTEM_ROTATION = ['windfury', 'healing', 'searing', 'earthbind'];

function spawnThrallTotem(thrall, sim) {
  const idx = thrall.totemRotationIdx || 0;
  const kind = TOTEM_ROTATION[idx % TOTEM_ROTATION.length];
  thrall.totemRotationIdx = idx + 1;
  sim.totems.push({
    id: `totem-${sim.nextId()}`,
    team: thrall.team,
    kind,
    x: thrall.x,
    y: thrall.y,
    ttl: 10.0,
    tickTimer: 1.0,
    ownerSlug: 'thrall',
  });
  sim.addFx({ kind: 'ring', x: thrall.x, y: thrall.y, radius: 3.2, color: '#22d3ee', duration: 0.45 });
}

export function castSpell(sim, team, spec, x, y) {
  const slug = spec.slug;
  const scale = sim.getLevelMultiplier(team);
  const jainaAlive = sim.units.some((u) => u.alive && u.team === team && u.spec?.slug === 'jaina-proudmoore');
  const spellBoost = jainaAlive ? 1.3 : 1.0;
  const dmgScale = scale * spellBoost;

  sim.emitAudio('spell');

  switch (slug) {
    case 'blizzard': {
      sim.activeSpells.push({
        id: `spell-${sim.nextId()}`,
        slug,
        team,
        x,
        y,
        radius: 5.5,
        remaining: 4.5,
        tickTimer: 0.05,
        dmgPerTick: Math.round(62 * dmgScale),
      });
      sim.addFx({ kind: 'blizzard', x, y, radius: 5.5, duration: 4.5 });
      break;
    }
    case 'execute': {
      const radius = 4.2;
      sim.addFx({ kind: 'explosion', x, y, radius, color: '#ef4444', duration: 0.5 });
      for (const u of sim.units) {
        if (!u.alive || u.team === team) continue;
        if (dist2D(x, y, u.x, u.y) <= radius) {
          const hit = u.isBoss ? Math.round(450 * dmgScale) : Math.round(u.maxHp * 0.5);
          sim.applyDamage(u, hit, { damageKind: 'physical', isSiege: true, sourceSlug: slug, sourceTeam: team });
        }
      }
      for (const s of sim.structures) {
        if (s.team === team || s.hp <= 0 || s.rebuilding) continue;
        if (dist2D(x, y, s.x, s.y) <= radius + s.radius) {
          sim.applyDamage(s, Math.round(s.maxHp * 0.5), { damageKind: 'physical', isSiege: true, sourceSlug: slug, sourceTeam: team });
        }
      }
      if (team === 'player' && sim.boss && sim.boss.alive && dist2D(x, y, sim.boss.x, sim.boss.y) <= radius + sim.boss.radius) {
        // Execute deals capped siege damage to Onyxia (halved in P3 by Armored)
        sim.applyDamage(sim.boss, Math.round(480 * dmgScale), {
          damageKind: 'physical',
          isSiege: true,
          sourceSlug: slug,
          sourceTeam: team,
        });
      }
      break;
    }
    case 'chain-lightning': {
      const baseDmg = Math.round(150 * dmgScale);
      const targets = sim
        .getAllAttackableTargets(team)
        .filter((t) => dist2D(x, y, t.x, t.y) <= 6.0)
        .sort((a, b) => dist2D(x, y, a.x, a.y) - dist2D(x, y, b.x, b.y))
        .slice(0, 4);
      let prevX = x;
      let prevY = y;
      for (const t of targets) {
        sim.applyDamage(t, baseDmg, { damageKind: 'elemental', sourceSlug: slug, sourceTeam: team });
        sim.addFx({ kind: 'beam', x1: prevX, y1: prevY, x2: t.x, y2: t.y, color: '#38bdf8', duration: 0.35 });
        prevX = t.x;
        prevY = t.y;
      }
      sim.emitAudio('lightning');
      break;
    }
    case 'arcane-blast': {
      sim.dealAreaDamage(x, y, 4.0, Math.round(145 * dmgScale), {
        team,
        damageKind: 'elemental',
        sourceSlug: slug,
        canHitFlying: true,
      });
      sim.addFx({ kind: 'ring', x, y, radius: 4.0, color: '#c084fc', duration: 0.4 });
      break;
    }
    case 'deep-breath': {
      // Sweeps a vertical flame lane northward (for player) or southward (for enemy)
      const dir = team === 'player' ? -1 : 1;
      const dmg = Math.round(320 * dmgScale);
      for (let step = 0; step <= 14; step += 2.2) {
        const py = y + dir * step;
        sim.dealAreaDamage(x, py, 2.8, Math.round(dmg * 0.45), {
          team,
          damageKind: 'elemental',
          sourceSlug: slug,
          canHitFlying: true,
          applyBurn: true,
        });
      }
      sim.addFx({ kind: 'breath-lane', x, y, dir, length: 15, color: '#f97316', duration: 0.65 });
      break;
    }
    case 'holy-nova': {
      const radius = 5.0;
      sim.dealAreaDamage(x, y, radius, Math.round(180 * dmgScale), {
        team,
        damageKind: 'elemental',
        sourceSlug: slug,
        canHitFlying: true,
      });
      for (const u of sim.units) {
        if (u.alive && u.team === team && dist2D(x, y, u.x, u.y) <= radius) {
          sim.healUnit(u, Math.round(220 * dmgScale));
        }
      }
      sim.addFx({ kind: 'ring', x, y, radius, color: '#fde047', duration: 0.5 });
      break;
    }
    case 'living-bomb': {
      const radius = 4.8;
      const targets = sim.units.filter((u) => u.alive && u.team !== team && dist2D(x, y, u.x, u.y) <= radius);
      const chainBonus = Math.min(4, targets.length);
      sim.dealAreaDamage(x, y, radius, Math.round((260 + chainBonus * 110) * dmgScale), {
        team,
        damageKind: 'elemental',
        sourceSlug: slug,
        canHitFlying: true,
        applyBurn: true,
      });
      sim.addFx({ kind: 'explosion', x, y, radius, color: '#fb7185', duration: 0.55 });
      break;
    }
    case 'polymorph': {
      const radius = 4.6;
      for (const u of sim.units) {
        if (u.alive && u.team !== team && !u.isBoss && !u.isUnstoppable && dist2D(x, y, u.x, u.y) <= radius) {
          u.polymorphTimer = 5.0;
          u.hasArmored = false;
          u.hasResistant = false;
        }
      }
      sim.addFx({ kind: 'ring', x, y, radius, color: '#f472b6', duration: 0.45 });
      break;
    }
    case 'smoke-bomb': {
      const radius = 4.5;
      for (const u of sim.units) {
        if (u.alive && u.team === team && dist2D(x, y, u.x, u.y) <= radius) {
          u.stealthActive = true;
          u.bloodlustTimer = Math.max(u.bloodlustTimer || 0, 3.0);
        }
      }
      sim.addFx({ kind: 'ring', x, y, radius, color: '#94a3b8', duration: 0.5 });
      break;
    }
    case 'cheat-death': {
      const radius = 4.5;
      for (const u of sim.units) {
        if (u.alive && u.team === team && dist2D(x, y, u.x, u.y) <= radius) {
          u.cheatDeathTimer = 6.0;
        }
      }
      sim.addFx({ kind: 'ring', x, y, radius, color: '#a855f7', duration: 0.5 });
      break;
    }
    case 'eclipse':
    case 'earth-and-moon':
    default: {
      const radius = 5.0;
      sim.dealAreaDamage(x, y, radius, Math.round((spec.damage || 320) * dmgScale), {
        team,
        damageKind: 'elemental',
        sourceSlug: slug,
        canHitFlying: true,
        applyBurn: slug === 'eclipse',
      });
      sim.addFx({ kind: 'explosion', x, y, radius, color: '#38bdf8', duration: 0.5 });
      break;
    }
  }
}

export function handleAttackHitEffects(sim, attacker, target, dmgDealt) {
  const slug = attacker.spec?.slug;
  if (!slug || dmgDealt <= 0) return;

  // Stealth break ambush bonus
  if (attacker.stealthActive) {
    attacker.stealthActive = false;
    if (attacker.spec?.traits?.includes('Cheap Shot') || attacker.spec?.traits?.includes('Ambush')) {
      applyStatusStun(target, 1.8);
    }
  }

  // Poisonous / Burn / Frost generic traits
  if (attacker.spec?.isPoisonous) {
    const perTick = slug === 'spiderlings' && attacker.talentIndex === 0 ? 24 : 12;
    applyStatusPoison(target, 1, slug, perTick, attacker.team);
  }
  if (attacker.spec?.isBurn) {
    applyStatusBurn(target, slug, 22, attacker.team);
  }
  if (attacker.spec?.isFrost) {
    applyStatusFrost(target, 3.0);
  }

  // Unit-specific combat triggers
  if (slug === 'thrall') {
    // Chain lightning bounce to up to 2 nearby enemies
    const bounceDmg = Math.round(attacker.damage * 0.65);
    const bounces = sim
      .getAllAttackableTargets(attacker.team)
      .filter((t) => t.id !== target.id && dist2D(target.x, target.y, t.x, t.y) <= 4.5)
      .slice(0, 2);
    for (const b of bounces) {
      sim.applyDamage(b, bounceDmg, {
        damageKind: 'elemental',
        sourceSlug: 'thrall',
        sourceTeam: attacker.team,
      });
      sim.addFx({ kind: 'beam', x1: target.x, y1: target.y, x2: b.x, y2: b.y, color: '#38bdf8', duration: 0.22 });
    }
    sim.emitAudio('lightning');
  } else if (slug === 'general-drakkisath') {
    target.elementalVulnTimer = 5.0;
  } else if (slug === 'arthas') {
    applyStatusFrost(target, 3.0);
  } else if (slug === 'pyromancer') {
    attacker.firstStrikeDone = true;
  } else if (slug === 'witch-doctor' && !target.alive) {
    // Spirit explosion on kill + Spirit Ward shield
    sim.dealAreaDamage(target.x, target.y, 3.2, Math.round(attacker.damage * 1.15), {
      team: attacker.team,
      damageKind: 'elemental',
      sourceSlug: 'witch-doctor',
      canHitFlying: true,
    });
    sim.addFx({ kind: 'ring', x: target.x, y: target.y, radius: 3.2, color: '#4ade80', duration: 0.35 });
    if (attacker.talentIndex === 2) {
      for (const ally of sim.units) {
        if (ally.alive && ally.team === attacker.team && dist2D(attacker.x, attacker.y, ally.x, ally.y) <= 5.5) {
          ally.shieldOneHit = true;
        }
      }
    }
  } else if (slug === 'goblin-sapper' && attacker.alive) {
    // Suicide bomb on contact
    sim.addFx({ kind: 'explosion', x: attacker.x, y: attacker.y, radius: 2.8, color: '#f97316', duration: 0.4 });
    attacker.hp = 0;
    attacker.alive = false;
  } else if (slug === 'banshee' && target && !target.isBoss && !target.isStructure && target.alive) {
    // Possess regular unit and flip its team
    if (target.hp <= 2600) {
      target.team = attacker.team;
      target.hp = target.maxHp;
      target.nodeId = null;
      attacker.hp = 0;
      attacker.alive = false;
      sim.addFx({ kind: 'ring', x: target.x, y: target.y, radius: 2.2, color: '#c084fc', duration: 0.5 });
    }
  }
}

export function tickUnitSpecialsAndAuras(sim, dt) {
  // Reset dynamic aura flags each tick before recalculating
  for (const u of sim.units) {
    if (!u.alive) continue;
    u.auraDamageMult = 1.0;
    u.auraAtkSpeedMult = 1.0;
    u.auraMoveSpeedMult = 1.0;
    u.hasArmored = Boolean(u.baseArmored);
    u.hasResistant = Boolean(u.baseResistant);
  }

  // Totems (Thrall)
  for (let i = sim.totems.length - 1; i >= 0; i--) {
    const totem = sim.totems[i];
    totem.ttl -= dt;
    if (totem.ttl <= 0) {
      sim.totems.splice(i, 1);
      continue;
    }
    if (totem.kind === 'windfury') {
      for (const u of sim.units) {
        if (u.alive && u.team === totem.team) u.auraAtkSpeedMult *= 1.25;
      }
    } else if (totem.kind === 'earthbind') {
      for (const u of sim.units) {
        if (u.alive && u.team !== totem.team) u.auraMoveSpeedMult *= 0.75;
      }
    }
    totem.tickTimer -= dt;
    if (totem.tickTimer <= 0) {
      totem.tickTimer = 1.0;
      if (totem.kind === 'healing') {
        for (const u of sim.units) {
          if (u.alive && u.team === totem.team && dist2D(u.x, u.y, totem.x, totem.y) <= 6.0) {
            sim.healUnit(u, 38);
          }
        }
      } else if (totem.kind === 'searing') {
        const target = sim.findClosestTarget(totem.x, totem.y, totem.team, 8.5, true);
        if (target) {
          sim.spawnProjectile({
            team: totem.team,
            x: totem.x,
            y: totem.y,
            target,
            damage: 65,
            damageKind: 'elemental',
            sourceSlug: 'thrall',
            color: '#f97316',
            speed: 14,
          });
        }
      }
    }
  }

  // Unit auras & periodic abilities
  for (const u of sim.units) {
    if (!u.alive || u.polymorphTimer > 0) continue;
    const slug = u.spec?.slug;

    // Thrall aura + Totem timer
    if (slug === 'thrall') {
      for (const ally of sim.units) {
        if (
          ally.alive &&
          ally.team === u.team &&
          dist2D(u.x, u.y, ally.x, ally.y) <= 6.0 &&
          (ally.spec?.families?.includes('Horde') || ally.spec?.isElemental)
        ) {
          ally.auraDamageMult *= 1.2;
          ally.hasResistant = true;
        }
      }
      if (u.talentIndex === 0) {
        u.totemTimer = (u.totemTimer ?? 10.0) - dt;
        if (u.totemTimer <= 0) {
          u.totemTimer = 10.0;
          spawnThrallTotem(u, sim);
        }
      }
      if (u.talentIndex === 1 && !u.wolvesTriggered && u.hp <= u.maxHp * 0.5) {
        u.wolvesTriggered = true;
        const wolfSpec = getUnitCombatSpec('spirit-wolf', 0, sim.getLevelDelta(u.team));
        for (const ox of [-1.1, 1.1]) {
          sim.spawnUnitFromSpec(wolfSpec, u.team, u.x + ox, u.y - 0.6, { nodeId: u.nodeId });
        }
        sim.addFx({ kind: 'ring', x: u.x, y: u.y, radius: 3.5, color: '#38bdf8', duration: 0.45 });
      }
    }

    // Drakkisath Chromatic Scales aura
    if (slug === 'general-drakkisath' && u.talentIndex === 0) {
      for (const ally of sim.units) {
        if (ally.alive && ally.team === u.team && dist2D(u.x, u.y, ally.x, ally.y) <= 5.5) {
          ally.hasResistant = true;
        }
      }
    }

    // Arthas Remorseless Winter + Death Grip + Army of the Dead
    if (slug === 'arthas') {
      u.winterTimer = (u.winterTimer ?? 0.5) - dt;
      if (u.winterTimer <= 0) {
        u.winterTimer = 0.8;
        for (const enemy of sim.units) {
          if (enemy.alive && enemy.team !== u.team && dist2D(u.x, u.y, enemy.x, enemy.y) <= 4.5) {
            applyStatusFrost(enemy, 2.0);
          }
        }
      }
      u.gripTimer = (u.gripTimer ?? 4.0) - dt;
      if (u.gripTimer <= 0) {
        const rangedTarget = sim.units.find(
          (e) => e.alive && e.team !== u.team && !e.isBoss && e.spec?.isRanged && dist2D(u.x, u.y, e.x, e.y) <= 8.5 && dist2D(u.x, u.y, e.x, e.y) > 2.2
        );
        if (rangedTarget) {
          u.gripTimer = 9.0;
          rangedTarget.x = u.x;
          rangedTarget.y = u.y - (u.team === 'player' ? 1.2 : -1.2);
          applyStatusStun(rangedTarget, 1.5);
          sim.addFx({ kind: 'beam', x1: u.x, y1: u.y, x2: rangedTarget.x, y2: rangedTarget.y, color: '#60a5fa', duration: 0.35 });
        } else {
          u.gripTimer = 1.5;
        }
      }
      u.armyTimer = (u.armyTimer ?? 10.0) - dt;
      if (u.armyTimer <= 0) {
        u.armyTimer = 13.0;
        const skSpec = getUnitCombatSpec('skeleton-minion', 0, sim.getLevelDelta(u.team));
        sim.spawnUnitFromSpec(skSpec, u.team, u.x + 0.9, u.y, { nodeId: u.nodeId });
      }
    }

    // Baron Rivendare spawns skeleton at friendly towers
    if (slug === 'baron-rivendare') {
      u.baronSpawnTimer = (u.baronSpawnTimer ?? 11.0) - dt;
      if (u.baronSpawnTimer <= 0) {
        u.baronSpawnTimer = 13.0;
        const friendlyTower = sim.structures.find((s) => s.team === u.team && s.hp > 0 && !s.rebuilding);
        if (friendlyTower) {
          const skSpec = getUnitCombatSpec('skeleton-minion', 0, sim.getLevelDelta(u.team));
          sim.spawnUnitFromSpec(skSpec, u.team, friendlyTower.x, friendlyTower.y + 1.0);
        }
      }
    }

    // Drake Mother Drake lays egg every 10s
    if (slug === 'drake' && u.talentIndex === 0) {
      u.eggTimer = (u.eggTimer ?? 8.5) - dt;
      if (u.eggTimer <= 0) {
        u.eggTimer = 10.0;
        const eggSpec = getUnitCombatSpec('whelp-eggs', 0, sim.getLevelDelta(u.team));
        sim.spawnFriendlyEgg(u.team, u.x, u.y, eggSpec.hp);
      }
    }

    // Gryphon Rider Mighty Throw / Air Drop potion
    if (slug === 'gryphon-rider' && u.talentIndex === 0) {
      u.potionTimer = (u.potionTimer ?? 8.0) - dt;
      if (u.potionTimer <= 0) {
        u.potionTimer = 9.0;
        const ally = sim.units.find((a) => a.alive && a.team === u.team && a.id !== u.id && dist2D(u.x, u.y, a.x, a.y) <= 5.5);
        if (ally) {
          ally.maxHp = Math.round(ally.maxHp * 1.1);
          ally.hp = Math.min(ally.maxHp, ally.hp + Math.round(ally.maxHp * 0.1));
          ally.damage = Math.round(ally.damage * 1.1);
          sim.addFx({ kind: 'ring', x: ally.x, y: ally.y, radius: 1.5, color: '#facc15', duration: 0.4 });
        }
      }
    }

    // Necromancer summons skeletons every 8s
    if (slug === 'necromancer') {
      u.summonTimer = (u.summonTimer ?? 7.5) - dt;
      if (u.summonTimer <= 0) {
        u.summonTimer = 8.0;
        const skSpec = getUnitCombatSpec('skeleton-minion', 0, sim.getLevelDelta(u.team));
        sim.spawnUnitFromSpec(skSpec, u.team, u.x - 0.8, u.y, { nodeId: u.nodeId });
        sim.spawnUnitFromSpec(skSpec, u.team, u.x + 0.8, u.y, { nodeId: u.nodeId });
      }
    }

    // Darkspear Troll passive regen
    if (slug === 'darkspear-troll' && u.talentIndex === 0 && u.outOfCombatTimer > 1.5) {
      sim.healUnit(u, Math.round(u.maxHp * 0.12 * dt));
    }

    // Healers (Frostwolf Shaman, Priestess, Tirion, Cenarius, Malfurion)
    if (u.spec?.isHealer) {
      u.healTimer = (u.healTimer ?? 0.6) - dt;
      if (u.healTimer <= 0) {
        u.healTimer = slug === 'priestess' ? 1.5 : 2.0;
        const injured = sim.units
          .filter((a) => a.alive && a.team === u.team && a.hp < a.maxHp && dist2D(u.x, u.y, a.x, a.y) <= (u.range || 7.5))
          .sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
        if (injured) {
          const healAmt = slug === 'priestess' ? 115 : slug === 'frostwolf-shaman' ? 95 : 100;
          sim.healUnit(injured, Math.round(healAmt * sim.getLevelMultiplier(u.team)));
          if (slug === 'frostwolf-shaman' && u.talentIndex === 2 && !injured.baseArmored) {
            injured.baseArmored = true;
            injured.hasArmored = true;
          }
          if (slug === 'priestess' && u.talentIndex === 1) {
            sim.healUnit(injured, Math.round(injured.maxHp * 0.1));
          }
          if (slug === 'priestess' && u.talentIndex === 2 && !injured.priestShielded) {
            injured.priestShielded = true;
            injured.invulnTimer = Math.max(injured.invulnTimer || 0, 2.0);
          }
          sim.addFx({ kind: 'beam', x1: u.x, y1: u.y, x2: injured.x, y2: injured.y, color: '#4ade80', duration: 0.25 });
        }
      }
    }
  }

  // Ragnaros Dazzling Flame pulse around friendly structures
  const ragnarosActive = sim.units.find((u) => u.alive && u.spec?.slug === 'ragnaros' && u.talentIndex === 0);
  if (ragnarosActive) {
    ragnarosActive.pulseTimer = (ragnarosActive.pulseTimer ?? 2.0) - dt;
    if (ragnarosActive.pulseTimer <= 0) {
      ragnarosActive.pulseTimer = 2.0;
      for (const s of sim.structures) {
        if (s.team === ragnarosActive.team && s.hp > 0 && !s.rebuilding) {
          sim.dealAreaDamage(s.x, s.y, 6.0, 90, {
            team: ragnarosActive.team,
            damageKind: 'elemental',
            sourceSlug: 'ragnaros',
            canHitFlying: true,
          });
          sim.addFx({ kind: 'ring', x: s.x, y: s.y, radius: 6.0, color: '#fb923c', duration: 0.35 });
        }
      }
    }
  }
}

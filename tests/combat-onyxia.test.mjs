import test from 'node:test';
import assert from 'node:assert/strict';

import { PRESET_DECKS, USER_DEFAULT_THRALL_CODE, getDifficultyById } from '../src/data/presets.js';
import { MISSIONS_CATALOG, getMissionById } from '../src/data/missions-catalog.js';
import { decodeRumblo } from '../src/services/rumblo.js';
import { CombatSimulation, TICK_DT } from '../src/engine/combat-sim.js';
import { tickPlayerAutopilot } from '../src/engine/player-autopilot.js';
import {
  ONYXIA_POS,
  PHASE_WIPE_RADIUS,
  WAYPOINT_NODES,
  dist2D,
  isValidDeployPosition,
  resolveNextNodeId,
} from '../src/engine/onyxia-map.js';
import { getUnitCombatSpec } from '../src/engine/unit-stats.js';
import { applyStatusPoison, canAttackTarget, computeDamage } from '../src/engine/unit-behaviors.js';

test('Combat damage counter matrix: Armored, Resistant, Siege, Flying, and Poison', () => {
  const armoredTarget = { hp: 1000, maxHp: 1000, hasArmored: true, hasResistant: false, isStructure: false, isBoss: false };
  const resistantTarget = { hp: 1000, maxHp: 1000, hasArmored: false, hasResistant: true, isStructure: false, isBoss: false };
  const towerTarget = { hp: 1900, maxHp: 1900, hasArmored: false, hasResistant: false, isStructure: true, isBoss: false };
  const p3BossTarget = { hp: 5000, maxHp: 18000, hasArmored: true, hasResistant: true, isStructure: false, isBoss: true };

  assert.equal(computeDamage(200, { damageKind: 'physical', isSiege: false }, armoredTarget), 100);
  assert.equal(computeDamage(200, { damageKind: 'elemental', isSiege: false }, resistantTarget), 100);
  assert.equal(computeDamage(200, { damageKind: 'physical', isSiege: true }, towerTarget), 400);
  assert.equal(computeDamage(200, { damageKind: 'physical', isSiege: true }, p3BossTarget), 200);

  const meleeGround = { team: 'player', isRanged: false, isFlying: false, isBombard: false, isStructure: false, isBoss: false };
  const bombardUnit = { team: 'player', isRanged: true, isFlying: false, isBombard: true, isStructure: false, isBoss: false };
  const rangedAA = { team: 'player', isRanged: true, isFlying: false, isBombard: false, isStructure: false, isBoss: false };
  const flyingEnemy = { team: 'enemy', alive: true, hp: 100, isFlying: true };

  assert.equal(canAttackTarget(meleeGround, flyingEnemy), false);
  assert.equal(canAttackTarget(bombardUnit, flyingEnemy), false);
  assert.equal(canAttackTarget(rangedAA, flyingEnemy), true);

  const dummy = { alive: true, isNullify: false, poisonStacks: 0 };
  applyStatusPoison(dummy, 3, 'plague-farmer', 12, 'player');
  applyStatusPoison(dummy, 2, 'plague-farmer', 12, 'player');
  assert.equal(dummy.poisonStacks, 5);
});

test('Authentic 56x114 missiondata_onyxia_v1 geometry, road termination, deploy rects, and switches', () => {
  const deck = decodeRumblo(PRESET_DECKS[0].code);
  const sim = new CombatSimulation({ deck, seed: 101 });

  assert.equal(ONYXIA_POS.x, 0);
  assert.equal(ONYXIA_POS.z, 78.5);
  assert.equal(ONYXIA_POS.radius, 8.0);
  assert.equal(PHASE_WIPE_RADIUS, 47.0);

  // Every waypoint node must terminate cleanly at BOSS (player) and P_BASE (enemy)
  for (const id of Object.keys(WAYPOINT_NODES)) {
    for (const team of ['player', 'enemy']) {
      let cur = id;
      for (let i = 0; i < 40; i++) {
        if ((team === 'player' && cur === 'BOSS') || (team === 'enemy' && cur === 'P_BASE')) break;
        cur = resolveNextNodeId(cur, team, sim.switches);
      }
      assert.equal(cur, team === 'player' ? 'BOSS' : 'P_BASE', `Disconnected node ${id} for ${team}`);
    }
  }

  const gruntSpec = getUnitCombatSpec('footmen', 0, 0);
  const spellSpec = getUnitCombatSpec('blizzard', 0, 0);
  const unboundSpec = getUnitCombatSpec('quilboar', 0, 0);
  const ragSpec = getUnitCombatSpec('ragnaros', 0, 0);

  // Standard ground troop allowed in Player Deploy 1/2/3 (x: -15..+15, z: -6.5..7)
  assert.equal(isValidDeployPosition(0, 4, gruntSpec, sim).valid, true);
  assert.equal(isValidDeployPosition(-12, 4, gruntSpec, sim).valid, true);
  // Not allowed near Onyxia or enemy towers until captured
  assert.equal(isValidDeployPosition(0, 62, gruntSpec, sim).valid, false);
  // Cannot drop ground troops inside Unwalkable03 lava island (1.83, 38.23)
  assert.equal(isValidDeployPosition(1.8, 38.2, unboundSpec, sim).valid, false);
  // Spell & Unbound allowed near Onyxia (outside boss collider)
  assert.equal(isValidDeployPosition(0, 65, spellSpec, sim).valid, true);
  assert.equal(isValidDeployPosition(-8, 65, unboundSpec, sim).valid, true);
  // Ragnaros must deploy near friendly structure (HomeBase at (0,0) initially)
  assert.equal(isValidDeployPosition(0, 22, ragSpec, sim).valid, false);
  assert.equal(isValidDeployPosition(0, 1, ragSpec, sim).valid, true);

  // Capturing Tower 1 (-2, 25) unlocks Tower 1 Deploy 1/2 (-8..4, 19..31)
  const midTower = sim.structures.find((s) => s.id === 'tower-mid');
  assert.equal(midTower.x, -2);
  assert.equal(midTower.z, 25);
  midTower.team = 'player';
  assert.equal(isValidDeployPosition(-5, 25, gruntSpec, sim).valid, true);

  // Interactive switches
  assert.equal(sim.switches['switch-tower-1'].dir, 'left');
  sim.toggleSwitch('switch-tower-1');
  assert.equal(sim.switches['switch-tower-1'].dir, 'right');

  // Thrall Totemic Mastery & Drakkisath Chromatic Scales aura
  const thrallSpec = getUnitCombatSpec('thrall', 0, 0);
  sim.spawnUnitFromSpec(thrallSpec, 'player', 0, 4);
  assert.ok(sim.totems.length >= 1);

  const drakSpec = getUnitCombatSpec('general-drakkisath', 0, 0);
  const pyroSpec = getUnitCombatSpec('pyromancer', 0, 0);
  sim.spawnUnitFromSpec(drakSpec, 'player', 0, 5);
  const pyro = sim.spawnUnitFromSpec(pyroSpec, 'player', 0, 6);
  sim.step(TICK_DT);
  assert.equal(pyro.hasResistant, true);
});

test('Onyxia Boss P1 eggs (20s), P2 BoardWipe (70%), and P3 BoardWipe (40%) match 47m radius', () => {
  const deck = decodeRumblo(PRESET_DECKS[1].code);
  const sim = new CombatSimulation({ deck, seed: 777 });

  // Advance 20.5s -> 6 eggs (3 west + 3 east from authentic nests)
  for (let i = 0; i < 410; i++) sim.step(TICK_DT);
  const eggs = sim.units.filter((u) => u.slug === 'onyxia-egg' && u.alive);
  assert.equal(eggs.length, 6, 'Expected 6 Onyxia eggs at 20s');

  const midTower = sim.structures.find((s) => s.id === 'tower-mid'); // (-2, 25), dist 53.54 > 47
  const leftTower = sim.structures.find((s) => s.id === 'tower-left'); // (-12, 44), dist 36.53 <= 47
  midTower.team = 'player';
  midTower.hp = midTower.maxHp;
  leftTower.team = 'player';
  leftTower.hp = leftTower.maxHp;

  const skelSpec = getUnitCombatSpec('skeleton-party', 2, 0);
  const upperUnit = sim.spawnUnitFromSpec(skelSpec, 'player', -10, 45); // dist ~35 <= 47 -> wiped
  const lowerUnit = sim.spawnUnitFromSpec(skelSpec, 'player', -2, 20); // dist ~58.5 > 47 -> survives + knocked south

  assert.ok(dist2D(upperUnit.x, upperUnit.z, ONYXIA_POS.x, ONYXIA_POS.z) <= PHASE_WIPE_RADIUS);
  assert.ok(dist2D(lowerUnit.x, lowerUnit.z, ONYXIA_POS.x, ONYXIA_POS.z) > PHASE_WIPE_RADIUS);

  sim.boss.poisonStacks = 5;
  sim.boss.poisonTimer = 4.0;
  sim.applyDamage(sim.boss, Math.ceil(sim.boss.maxHp * 0.35), {
    damageKind: 'physical',
    sourceSlug: 'test',
    sourceTeam: 'player',
  });
  sim.step(TICK_DT);

  assert.equal(sim.boss.phase, 2);
  assert.equal(sim.boss.hasResistant, true);
  assert.equal(sim.boss.hasArmored, false);
  assert.equal(sim.boss.poisonStacks, 0, 'Phase transition must cleanse boss debuffs');
  assert.equal(upperUnit.alive, false, 'Unit inside 47m BoardWipe must be wiped');
  assert.equal(lowerUnit.alive, true, 'Unit outside 47m BoardWipe must survive');
  assert.ok(lowerUnit.z < 20.0, 'Surviving unit must be knocked back southward (-z)');
  assert.equal(leftTower.team, 'enemy', 'Tower 2 inside BoardWipe must reset to Onyxia control');
  assert.equal(midTower.team, 'player', 'Tower 1 outside BoardWipe must remain player-owned');

  const earthElementals = sim.units.filter((u) => u.slug === 'earth-elemental' && u.team === 'enemy' && u.alive);
  assert.ok(earthElementals.length >= 3, 'P2 must spawn 3 CaveIn earth elementals');

  // Verify P2 Elemental Resistance halves elemental damage
  const hpBeforeElem = sim.boss.hp;
  sim.applyDamage(sim.boss, Math.ceil(sim.boss.maxHp * 0.40), {
    damageKind: 'elemental',
    sourceSlug: 'test',
    sourceTeam: 'player',
  });
  assert.equal(hpBeforeElem - sim.boss.hp, Math.round(Math.ceil(sim.boss.maxHp * 0.40) * 0.5));
  sim.step(TICK_DT);
  assert.equal(sim.boss.phase, 2);

  // Drop Boss HP below 40% to trigger P3
  sim.applyDamage(sim.boss, Math.ceil(sim.boss.maxHp * 0.15), {
    damageKind: 'physical',
    sourceSlug: 'test',
    sourceTeam: 'player',
  });
  sim.step(TICK_DT);

  assert.equal(sim.boss.phase, 3);
  assert.equal(sim.boss.hasResistant, true);
  assert.equal(sim.boss.hasArmored, true);
  const warders = sim.units.filter((u) => u.slug === 'onyxia-warder' && u.alive);
  assert.equal(warders.length, 2, 'P3 must spawn 2 Onyxia Warders');
});

test('Headless 120s simulation stress test across all 5 preset decks with zero NaNs', () => {
  for (const preset of PRESET_DECKS) {
    const deck = decodeRumblo(preset.code);
    const sim = new CombatSimulation({ deck, seed: 2026 });

    for (let tick = 0; tick < 2400; tick++) {
      if (tick % 80 === 0 && !sim.finished) {
        for (let slot = 0; slot < 4; slot++) {
          const spec = sim.getHandCardSpec(slot);
          if (spec && sim.playerGold >= spec.cost) {
            const tx = 0.0;
            const tz = spec.slug === 'ragnaros' ? 0.5 : spec.isSpell ? 70.0 : spec.isUnbound ? 55.0 : 4.5;
            const res = sim.deployCard(slot, tx, tz);
            if (res.ok) break;
          }
        }
        if (tick % 320 === 0) {
          sim.toggleSwitch('switch-tower-1');
        }
      }
      sim.step(TICK_DT);
      if (sim.finished) break;
    }

    const snap = sim.getHudSnapshot();
    assert.ok(Number.isFinite(snap.bossHp) && snap.bossHp >= 0, `${preset.id} invalid bossHp`);
    assert.ok(Number.isFinite(snap.playerGold) && snap.playerGold >= 0, `${preset.id} invalid playerGold`);
    for (const u of sim.units) {
      assert.ok(Number.isFinite(u.x) && Number.isFinite(u.z) && Number.isFinite(u.yaw), `${preset.id} unit NaN coords`);
      assert.ok(Number.isFinite(u.hp), `${preset.id} unit NaN hp`);
    }
  }
});

test('Ragnaros second deploy triggers Blast Wave without stacking idle copies', () => {
  const deck = decodeRumblo(PRESET_DECKS[2].code);
  const sim = new CombatSimulation({ deck, seed: 404 });
  const ragSpec = getUnitCombatSpec('ragnaros', 0, 0);

  const r1 = sim.spawnUnitFromSpec(ragSpec, 'player', 0.0, 0.5);
  assert.equal(r1.alive, true);
  assert.equal(r1.range, 12.0);

  const gruntSpec = getUnitCombatSpec('footmen', 0, 0);
  const enemy = sim.spawnUnitFromSpec(gruntSpec, 'enemy', 0.0, 4.0);
  const hpBefore = enemy.hp;

  const r2 = sim.spawnUnitFromSpec(ragSpec, 'player', 0.0, 0.5);
  assert.equal(r2.alive, false, 'Second Ragnaros triggers Blast Wave and does not stack');
  assert.ok(enemy.hp < hpBefore, 'Blast Wave must damage nearby enemies');
});

test('Full-match practice autopilot with User Default Thrall deck clears Onyxia on 56x114 map', () => {
  const deck = decodeRumblo(USER_DEFAULT_THRALL_CODE);
  const practice = getDifficultyById('practice');
  const sim = new CombatSimulation({
    deck,
    playerLevelDelta: practice.playerLevelDelta,
    enemyLevelDelta: practice.enemyLevelDelta,
    seed: 20261118,
  });

  for (let tick = 0; tick < 9600; tick++) {
    tickPlayerAutopilot(sim, TICK_DT);
    sim.step(TICK_DT);
    if (sim.finished) break;
  }

  const snap = sim.getHudSnapshot();
  assert.equal(
    snap.victory,
    true,
    `Expected Thrall practice autopilot to defeat Onyxia, ended at P${snap.bossPhase} (${snap.bossHpPct.toFixed(1)}% HP, reason=${snap.defeatReason})`
  );
});

test('All Campaign, Raid, Quest, and PvP missions simulate cleanly and allow card deploy in Player Deploy', () => {
  const deck = decodeRumblo(USER_DEFAULT_THRALL_CODE);
  for (const mission of MISSIONS_CATALOG) {
    const sim = new CombatSimulation({ deck, missionId: mission.id, seed: 555 });
    assert.equal(sim.boss.nameZh, mission.nameZh);
    assert.equal(sim.boss.maxHp, mission.maxHp);
    sim.playerGold = 10;
    const res = sim.deployCard(0, 0, 5.5);
    assert.equal(res.ok, true, `Failed to deploy slot 0 on ${mission.id}: ${res.reason}`);
    for (let i = 0; i < 40; i++) sim.step(TICK_DT);
    assert.ok(Number.isFinite(sim.boss.hp));
  }
  assert.equal(getMissionById('nonexistent').id, 'onyxia_lair');
});

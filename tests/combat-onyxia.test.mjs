import test from 'node:test';
import assert from 'node:assert/strict';

import { PRESET_DECKS, USER_DEFAULT_THRALL_CODE, getDifficultyById } from '../src/data/presets.js';
import { decodeRumblo } from '../src/services/rumblo.js';
import { CombatSimulation, TICK_DT } from '../src/engine/combat-sim.js';
import { tickPlayerAutopilot } from '../src/engine/player-autopilot.js';
import { PHASE_CLEAR_Y, isValidDeployPosition } from '../src/engine/onyxia-map.js';
import { getUnitCombatSpec } from '../src/engine/unit-stats.js';
import { applyStatusPoison, canAttackTarget, computeDamage } from '../src/engine/unit-behaviors.js';

test('Combat damage counter matrix: Armored, Resistant, Siege, Flying, and Poison', () => {
  const armoredTarget = { hp: 1000, maxHp: 1000, hasArmored: true, hasResistant: false, isStructure: false, isBoss: false };
  const resistantTarget = { hp: 1000, maxHp: 1000, hasArmored: false, hasResistant: true, isStructure: false, isBoss: false };
  const towerTarget = { hp: 1800, maxHp: 1800, hasArmored: false, hasResistant: false, isStructure: true, isBoss: false };
  const p3BossTarget = { hp: 5000, maxHp: 18000, hasArmored: true, hasResistant: true, isStructure: false, isBoss: true };

  assert.equal(computeDamage(200, { damageKind: 'physical', isSiege: false }, armoredTarget), 100);
  assert.equal(computeDamage(200, { damageKind: 'elemental', isSiege: false }, resistantTarget), 100);
  assert.equal(computeDamage(200, { damageKind: 'physical', isSiege: true }, towerTarget), 400);
  // Siege (2x) against P3 Onyxia with Armored (0.5x) cancels to 1.0x
  assert.equal(computeDamage(200, { damageKind: 'physical', isSiege: true }, p3BossTarget), 200);

  // Flying targeting rules
  const meleeGround = { team: 'player', isRanged: false, isFlying: false, isBombard: false, isStructure: false, isBoss: false };
  const bombardUnit = { team: 'player', isRanged: true, isFlying: false, isBombard: true, isStructure: false, isBoss: false };
  const rangedAA = { team: 'player', isRanged: true, isFlying: false, isBombard: false, isStructure: false, isBoss: false };
  const flyingEnemy = { team: 'enemy', alive: true, hp: 100, isFlying: true };

  assert.equal(canAttackTarget(meleeGround, flyingEnemy), false);
  assert.equal(canAttackTarget(bombardUnit, flyingEnemy), false);
  assert.equal(canAttackTarget(rangedAA, flyingEnemy), true);

  // Poison stack accumulation
  const dummy = { alive: true, isNullify: false, poisonStacks: 0 };
  applyStatusPoison(dummy, 3, 'plague-farmer', 12, 'player');
  applyStatusPoison(dummy, 2, 'plague-farmer', 12, 'player');
  assert.equal(dummy.poisonStacks, 5);
});

test('Onyxia Lair deployment validation, switch toggling, and unit special talents', () => {
  const deck = decodeRumblo(PRESET_DECKS[0].code);
  const sim = new CombatSimulation({ deck, seed: 101 });

  const gruntSpec = getUnitCombatSpec('footmen', 0, 0);
  const spellSpec = getUnitCombatSpec('blizzard', 0, 0);
  const unboundSpec = getUnitCombatSpec('quilboar', 0, 0);
  const ragSpec = getUnitCombatSpec('ragnaros', 0, 0);

  // Standard ground unit cannot deploy in top half before capturing towers
  assert.equal(isValidDeployPosition(18, 15, gruntSpec, sim).valid, false);
  // Standard ground unit CAN deploy near player base
  assert.equal(isValidDeployPosition(18, 52, gruntSpec, sim).valid, true);
  // Spell & Unbound can deploy near Onyxia
  assert.equal(isValidDeployPosition(18, 15, spellSpec, sim).valid, true);
  assert.equal(isValidDeployPosition(18, 15, unboundSpec, sim).valid, true);
  // Ragnaros must deploy near friendly structure
  assert.equal(isValidDeployPosition(18, 30, ragSpec, sim).valid, false);
  assert.equal(isValidDeployPosition(18, 54, ragSpec, sim).valid, true);

  // Switch toggling
  assert.equal(sim.switches['switch-bottom'].dir, 'left');
  sim.toggleSwitch('switch-bottom');
  assert.equal(sim.switches['switch-bottom'].dir, 'right');

  // Thrall Totemic Mastery spawns initial totem on deploy
  const thrallSpec = getUnitCombatSpec('thrall', 0, 0);
  sim.spawnUnitFromSpec(thrallSpec, 'player', 18, 50);
  assert.ok(sim.totems.length >= 1);

  // Drakkisath Chromatic Scales grants Resistant to nearby ally
  const drakSpec = getUnitCombatSpec('general-drakkisath', 0, 0);
  const pyroSpec = getUnitCombatSpec('pyromancer', 0, 0);
  sim.spawnUnitFromSpec(drakSpec, 'player', 18, 49);
  const pyro = sim.spawnUnitFromSpec(pyroSpec, 'player', 18, 50);
  sim.step(TICK_DT);
  assert.equal(pyro.hasResistant, true);
});

test('Onyxia Boss P1 eggs (20s), P2 transition (70%), and P3 transition (40%) trigger cleanly', () => {
  const deck = decodeRumblo(PRESET_DECKS[1].code); // Drakkisath deck
  const sim = new CombatSimulation({ deck, seed: 777 });

  // Advance to 20.5s -> first egg wave (3 left + 3 right = 6 eggs)
  for (let i = 0; i < 410; i++) sim.step(TICK_DT);
  const eggs = sim.units.filter((u) => u.slug === 'onyxia-egg' && u.alive);
  assert.equal(eggs.length, 6, 'Expected 6 Onyxia eggs at 20s');

  // Capture mid tower for player and keep one unit below PHASE_CLEAR_Y, one unit above PHASE_CLEAR_Y
  const midTower = sim.structures.find((s) => s.id === 'tower-mid');
  const leftTower = sim.structures.find((s) => s.id === 'tower-left');
  midTower.team = 'player';
  midTower.hp = 1800;
  leftTower.team = 'player';
  leftTower.hp = 1800;

  const skelSpec = getUnitCombatSpec('skeleton-party', 2, 0);
  const upperUnit = sim.spawnUnitFromSpec(skelSpec, 'player', 11.2, 22.0); // above 26.5 -> wiped
  const lowerUnit = sim.spawnUnitFromSpec(skelSpec, 'player', 18.0, 33.0); // below 26.5 -> survives + knocked back

  // Drop Boss HP below 70% to trigger P2
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
  assert.equal(upperUnit.alive, false, 'Unit above phase clear line must be destroyed');
  assert.equal(lowerUnit.alive, true, 'Unit below phase clear line must survive');
  assert.ok(lowerUnit.y > 33.0, 'Surviving unit must be knocked back southward');
  assert.equal(leftTower.team, 'enemy', 'Top tower must reset to Onyxia control');
  assert.equal(midTower.team, 'player', 'Mid tower below clear line must stay player-owned');

  const earthElementals = sim.units.filter((u) => u.slug === 'earth-elemental' && u.team === 'enemy' && u.alive);
  assert.ok(earthElementals.length >= 3, 'P2 must spawn 3 landslide earth elementals');

  // Verify P2 Elemental Resistance halves elemental damage (0.40 * maxHp -> 0.20 * maxHp, leaving ~45% HP)
  const hpBeforeElem = sim.boss.hp;
  sim.applyDamage(sim.boss, Math.ceil(sim.boss.maxHp * 0.40), {
    damageKind: 'elemental',
    sourceSlug: 'test',
    sourceTeam: 'player',
  });
  assert.equal(hpBeforeElem - sim.boss.hp, Math.round(Math.ceil(sim.boss.maxHp * 0.40) * 0.5));
  sim.step(TICK_DT);
  assert.equal(sim.boss.phase, 2, 'Still P2 at ~45% HP');

  // Drop Boss HP below 40% using physical damage to trigger P3
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
      // Every 4 seconds try playing an affordable card at base/mid
      if (tick % 80 === 0 && !sim.finished) {
        for (let slot = 0; slot < 4; slot++) {
          const spec = sim.getHandCardSpec(slot);
          if (spec && sim.playerGold >= spec.cost) {
            const tx = spec.isSpell || spec.isUnbound ? 18.0 : 18.0;
            const ty = spec.slug === 'ragnaros' ? 55.0 : spec.isSpell ? 12.0 : spec.isUnbound ? 24.0 : 50.5;
            const res = sim.deployCard(slot, tx, ty);
            if (res.ok) break;
          }
        }
        if (tick % 320 === 0) {
          sim.toggleSwitch('switch-bottom');
        }
      }
      sim.step(TICK_DT);
      if (sim.finished) break;
    }

    const snap = sim.getHudSnapshot();
    assert.ok(Number.isFinite(snap.bossHp) && snap.bossHp >= 0, `${preset.id} invalid bossHp`);
    assert.ok(Number.isFinite(snap.playerGold) && snap.playerGold >= 0, `${preset.id} invalid playerGold`);
    for (const u of sim.units) {
      assert.ok(Number.isFinite(u.x) && Number.isFinite(u.y), `${preset.id} unit NaN coords`);
      assert.ok(Number.isFinite(u.hp), `${preset.id} unit NaN hp`);
    }
  }
});

test('Ragnaros second deploy triggers Blast Wave without stacking idle copies', () => {
  const deck = decodeRumblo(PRESET_DECKS[2].code);
  const sim = new CombatSimulation({ deck, seed: 404 });
  const ragSpec = getUnitCombatSpec('ragnaros', 0, 0);

  const r1 = sim.spawnUnitFromSpec(ragSpec, 'player', 18.0, 55.0);
  assert.equal(r1.alive, true);
  assert.equal(r1.range, 10.5);

  // Place enemy near player base to receive Blast Wave damage
  const gruntSpec = getUnitCombatSpec('footmen', 0, 0);
  const enemy = sim.spawnUnitFromSpec(gruntSpec, 'enemy', 18.0, 52.0);
  const hpBefore = enemy.hp;

  const r2 = sim.spawnUnitFromSpec(ragSpec, 'player', 18.0, 55.0);
  assert.equal(r2.alive, false, 'Second Ragnaros triggers Blast Wave and does not stack');
  assert.ok(enemy.hp < hpBefore, 'Blast Wave must damage nearby enemies');
});

test('Full-match practice autopilot with User Default Thrall deck clears Onyxia', () => {
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
  assert.equal(snap.victory, true, `Expected Thrall practice autopilot to defeat Onyxia, ended at P${snap.bossPhase} (${snap.bossHpPct.toFixed(1)}% HP, reason=${snap.defeatReason})`);
});

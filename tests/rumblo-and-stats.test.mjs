import test from 'node:test';
import assert from 'node:assert/strict';

import { MINIS } from '../src/data/minis.js';
import { PRESET_DECKS, USER_DEFAULT_THRALL_CODE } from '../src/data/presets.js';
import { decodeRumblo, encodeRumblo } from '../src/services/rumblo.js';
import {
  MINI_BY_SLUG,
  getEquippedTalent,
  getLevelMultiplier,
  getUnitCombatSpec,
} from '../src/engine/unit-stats.js';

test('All 93 official minis load and produce valid combat specs', () => {
  assert.equal(MINIS.length, 93);
  for (const m of MINIS) {
    const spec = getUnitCombatSpec(m.slug, 0, 0);
    assert.ok(spec.nameZh.length > 0, `missing nameZh for ${m.slug}`);
    assert.ok(Number.isFinite(spec.cost) && spec.cost >= 1, `invalid cost for ${m.slug}: ${spec.cost}`);
    assert.ok(Number.isFinite(spec.hp) && spec.hp >= 0, `invalid hp for ${m.slug}: ${spec.hp}`);
    assert.ok(Number.isFinite(spec.damage) && spec.damage >= 0, `invalid damage for ${m.slug}: ${spec.damage}`);
    assert.ok(Number.isFinite(spec.range) && spec.range >= 0, `invalid range for ${m.slug}: ${spec.range}`);
    assert.ok(Number.isFinite(spec.speed) && spec.speed >= 0, `invalid speed for ${m.slug}: ${spec.speed}`);
  }
});

test('User default Thrall code and all 4 Onyxia preset codes round-trip identically', () => {
  assert.equal(PRESET_DECKS.length, 5);
  for (const preset of PRESET_DECKS) {
    const decoded = decodeRumblo(preset.code);
    assert.equal(decoded.troops.length, 6, `preset ${preset.id} must have 6 troops`);
    const reencoded = encodeRumblo(decoded);
    assert.equal(reencoded, preset.code, `round-trip mismatch for ${preset.id}`);
  }

  const thrallDecoded = decodeRumblo(USER_DEFAULT_THRALL_CODE);
  assert.equal(thrallDecoded.leader.slug, 'thrall');
  assert.equal(thrallDecoded.leader.talentIndex, 0);
  assert.deepEqual(
    thrallDecoded.troops.map((t) => `${t.slug}:${t.talentIndex}`),
    [
      'darkspear-troll:0',
      'vultures:2',
      'pyromancer:0',
      'plague-farmer:2',
      'spiderlings:0',
      'gryphon-rider:2',
    ]
  );
});

test('codeIndex talent mapping maps Thrall talentIndex 0 to 图腾掌握 (not array index 0)', () => {
  const thrall = MINI_BY_SLUG.get('thrall');
  assert.ok(thrall);
  const t0 = getEquippedTalent(thrall, 0);
  assert.equal(t0.nameZh, '图腾掌握');
  assert.equal(t0.codeIndex, 0);

  const t2 = getEquippedTalent(thrall, 2);
  assert.equal(t2.nameZh, '部落的召唤');
  assert.equal(t2.codeIndex, 2);

  // Verify Squad and level multiplier accuracy
  const vulturesSpec = getUnitCombatSpec('vultures', 2, 0);
  assert.equal(vulturesSpec.count, 3);
  assert.ok(Math.abs(getLevelMultiplier(2) - 1.21) < 1e-6);
});

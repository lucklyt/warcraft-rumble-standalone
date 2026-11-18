import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

function readGlbJson(filePath) {
  const buf = fs.readFileSync(filePath);
  assert.ok(buf.length >= 20, `${filePath} too small`);
  const magic = buf.subarray(0, 4).toString('ascii');
  assert.equal(magic, 'glTF', `${filePath} invalid glTF magic`);
  const jsonLen = buf.readUInt32LE(12);
  const jsonType = buf.readUInt32LE(16);
  assert.equal(jsonType, 0x4e4f534a, `${filePath} missing JSON chunk`);
  const jsonText = buf.subarray(20, 20 + jsonLen).toString('utf8');
  return JSON.parse(jsonText);
}

test('All extracted 3D .glb environment, POIs, pedestals, and 81 minis are valid core glTF 2.0 files', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/models-manifest.json'), 'utf8'));

  const envPath = path.join(PUBLIC_DIR, manifest.env.onyxiaLair.replace(/^\.\//, ''));
  assert.ok(fs.existsSync(envPath), 'onyxia-lair.glb must exist');
  const envJson = readGlbJson(envPath);
  assert.ok(envJson.nodes.length >= 6, 'onyxia-lair.glb must contain Terrain, RockWall, Unwalkables, and SpikeRocks');
  for (const im of envJson.images || []) {
    assert.ok(['image/jpeg', 'image/png'].includes(im.mimeType), `Unsupported mimeType in env: ${im.mimeType}`);
  }

  for (const [slug, info] of Object.entries(manifest.poi)) {
    const p = path.join(PUBLIC_DIR, info.glb.replace(/^\.\//, ''));
    assert.ok(fs.existsSync(p), `Missing POI glb: ${slug}`);
    const g = readGlbJson(p);
    for (const im of g.images || []) {
      assert.ok(['image/jpeg', 'image/png'].includes(im.mimeType), `Unsupported mimeType in ${slug}: ${im.mimeType}`);
    }
  }

  for (const [fam, rel] of Object.entries(manifest.pedestals)) {
    const p = path.join(PUBLIC_DIR, rel.replace(/^\.\//, ''));
    assert.ok(fs.existsSync(p), `Missing pedestal glb: ${fam}`);
    readGlbJson(p);
  }

  const miniEntries = Object.entries(manifest.minis);
  assert.ok(miniEntries.length >= 85, 'Expected 81 playable minis plus special unit models');
  for (const [slug, info] of miniEntries) {
    const p = path.join(PUBLIC_DIR, info.glb.replace(/^\.\//, ''));
    assert.ok(fs.existsSync(p), `Missing mini glb for ${slug}: ${p}`);
    const g = readGlbJson(p);
    for (const im of g.images || []) {
      assert.ok(['image/jpeg', 'image/png'].includes(im.mimeType), `Unsupported mimeType in mini ${slug}: ${im.mimeType}`);
    }
  }
});

test('Official missiondata_onyxia_v1 JSON and referenced CombatHUD sprites exist on disk', () => {
  const mission = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/onyxia-mission-data.json'), 'utf8'));
  assert.equal(mission.cameraBounds.width, 56);
  assert.equal(mission.cameraBounds.depth, 114);
  assert.ok(mission.roads.length >= 34);
  assert.ok(mission.deployAreas.length >= 10);
  assert.ok(mission.unwalkables.length === 4);

  const hudManifest = JSON.parse(fs.readFileSync(path.join(PUBLIC_DIR, 'r/hud/manifest.json'), 'utf8'));
  assert.ok(Object.keys(hudManifest).length >= 100);

  // Verify every /r/hud/... or ./r/hud/... referenced in src/ exists in public/r/hud/
  const srcFiles = [];
  function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (/\.(js|css)$/.test(ent.name)) srcFiles.push(full);
    }
  }
  walk(path.join(ROOT, 'src'));

  const checkedRefs = new Set();
  for (const f of srcFiles) {
    const txt = fs.readFileSync(f, 'utf8');
    const matches = txt.match(/\.?\/r\/hud\/[A-Za-z0-9_.-]+/g) || [];
    for (const m of matches) {
      const rel = m.replace(/^\.\//, '').replace(/^\//, '');
      checkedRefs.add(rel);
      assert.ok(fs.existsSync(path.join(PUBLIC_DIR, rel)), `Referenced HUD asset missing: ${rel} (from ${f})`);
    }
  }
  assert.ok(checkedRefs.size >= 10, 'Expected CombatHUD sprite references in src/');
});

test('No hardcoded personal paths or 2D battlefield emojis exist in committed code', () => {
  const scanDirs = ['src', 'scripts', 'tests'];
  const bannedPatterns = ['/Users/', '🏰', '🗼', '🐑'];

  for (const d of scanDirs) {
    const dirPath = path.join(ROOT, d);
    const stack = [dirPath];
    while (stack.length > 0) {
      const cur = stack.pop();
      for (const ent of fs.readdirSync(cur, { withFileTypes: true })) {
        const full = path.join(cur, ent.name);
        if (ent.isDirectory()) stack.push(full);
        else if (/\.(js|mjs|py|css|html)$/.test(ent.name) && full !== fileURLToPath(import.meta.url)) {
          const text = fs.readFileSync(full, 'utf8');
          for (const pat of bannedPatterns) {
            assert.equal(text.includes(pat), false, `Found banned pattern "${pat}" in ${full}`);
          }
        }
      }
    }
  }
});

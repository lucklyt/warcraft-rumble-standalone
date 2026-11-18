import { cpSync, copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const SOURCE_ROOT = resolve(process.env.MINIAPP_SOURCE || resolve(PROJECT_ROOT, '../warcraft-rumble-miniapp'));

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function copyTree(src, dst) {
  if (!existsSync(src)) {
    throw new Error(`Missing source directory: ${src}`);
  }
  ensureDir(dirname(dst));
  cpSync(src, dst, { recursive: true, force: true });
}

function copySingle(src, dst) {
  if (!existsSync(src)) {
    throw new Error(`Missing source file: ${src}`);
  }
  ensureDir(dirname(dst));
  copyFileSync(src, dst);
}

console.log('[sync-assets] Syncing official art & data from warcraft-rumble-miniapp (read-only)...');

// 1. Copy public/r (fonts, ui, d, m, t, f, onyxia, leaders, models, bosses, crest.png, etc.)
copyTree(resolve(SOURCE_ROOT, 'public/r'), resolve(PROJECT_ROOT, 'public/r'));

// 2. Copy bg-tavern.jpg
copySingle(
  resolve(SOURCE_ROOT, 'src/assets/bg-tavern.jpg'),
  resolve(PROJECT_ROOT, 'public/r/ui/bg-tavern.jpg')
);

// 3. Copy core data modules
const DATA_FILES = [
  'minis.js',
  'mini-art.js',
  'mini-art-cache.js',
  'mini-art-wiki.js',
  'mini-art-display.js',
  'translations.js',
  'onyxia-guide.js',
];

for (const file of DATA_FILES) {
  copySingle(resolve(SOURCE_ROOT, 'src/data', file), resolve(PROJECT_ROOT, 'src/data', file));
}

// 4. Copy rumblo share-code codec
copySingle(
  resolve(SOURCE_ROOT, 'src/services/rumblo.js'),
  resolve(PROJECT_ROOT, 'src/services/rumblo.js')
);

console.log('[sync-assets] Sync complete.');

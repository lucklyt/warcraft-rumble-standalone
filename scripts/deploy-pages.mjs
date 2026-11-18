import { cpSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const DIST_DIR = resolve(PROJECT_ROOT, 'dist');

if (!existsSync(resolve(DIST_DIR, 'index.html'))) {
  throw new Error('dist/index.html not found. Run `npm run build` first.');
}
if (!existsSync(resolve(DIST_DIR, '.nojekyll'))) {
  throw new Error('dist/.nojekyll not found. Ensure public/.nojekyll exists before building.');
}

const originUrl = execFileSync('git', ['remote', 'get-url', 'origin'], {
  cwd: PROJECT_ROOT,
  encoding: 'utf8',
}).trim();

if (!originUrl) {
  throw new Error('No git remote `origin` configured.');
}

const stagingDir = mkdtempSync(resolve(tmpdir(), 'wr-gh-pages-'));
console.log(`[deploy-pages] Staging dist/ in ${stagingDir}...`);

try {
  cpSync(DIST_DIR, stagingDir, {
    recursive: true,
    filter: (src) => !src.endsWith('.DS_Store'),
  });

  const runGit = (args) =>
    execFileSync('git', args, {
      cwd: stagingDir,
      stdio: 'inherit',
    });

  runGit(['init', '-b', 'gh-pages']);
  runGit(['add', '-A']);
  runGit(['commit', '-m', 'chore: deploy GitHub Pages']);
  runGit(['push', '-f', originUrl, 'gh-pages:gh-pages']);

  console.log('[deploy-pages] Successfully pushed dist/ to gh-pages.');
} finally {
  rmSync(stagingDir, { recursive: true, force: true });
}

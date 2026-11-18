import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const ROOT = resolve(__dirname, '..');
const DIST_DIR = resolve(ROOT, 'dist');
const PUBLIC_DIR = resolve(ROOT, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
};

function parseArgs(argv) {
  let port = Number(process.env.PORT) || 4173;
  let open = false;
  let devFallback = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--port' && argv[i + 1]) {
      port = Number(argv[++i]) || port;
    } else if (a.startsWith('--port=')) {
      port = Number(a.slice(7)) || port;
    } else if (a === '--open') {
      open = true;
    } else if (a === '--dev') {
      devFallback = true;
    }
  }
  return { port, open, devFallback };
}

function safeJoin(base, relPath) {
  const cleaned = normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const full = resolve(base, '.' + (cleaned.startsWith('/') ? cleaned : '/' + cleaned));
  if (!full.startsWith(base)) return null;
  return full;
}

const { port, open, devFallback } = parseArgs(process.argv.slice(2));
const useDist = !devFallback && existsSync(resolve(DIST_DIR, 'index.html'));

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url || '/', `http://127.0.0.1:${port}`);
  let pathname = decodeURIComponent(urlObj.pathname);
  if (pathname === '/') pathname = '/index.html';

  if (pathname === '/favicon.ico') {
    const crest = resolve(PUBLIC_DIR, 'r/crest.png');
    if (existsSync(crest)) {
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' });
      createReadStream(crest).pipe(res);
      return;
    }
    res.writeHead(204);
    res.end();
    return;
  }

  let filePath = null;
  if (useDist) {
    filePath = safeJoin(DIST_DIR, pathname);
    if (!filePath || !existsSync(filePath) || statSync(filePath).isDirectory()) {
      const pubFallback = safeJoin(PUBLIC_DIR, pathname);
      if (pubFallback && existsSync(pubFallback) && !statSync(pubFallback).isDirectory()) {
        filePath = pubFallback;
      } else {
        filePath = null;
      }
    }
  } else {
    const rootCandidate = safeJoin(ROOT, pathname);
    const pubCandidate = safeJoin(PUBLIC_DIR, pathname);
    if (rootCandidate && existsSync(rootCandidate) && !statSync(rootCandidate).isDirectory()) {
      filePath = rootCandidate;
    } else if (pubCandidate && existsSync(pubCandidate) && !statSync(pubCandidate).isDirectory()) {
      filePath = pubCandidate;
    }
  }

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const ext = extname(filePath).toLowerCase();
  const mime = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': mime,
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
  });
  createReadStream(filePath).pipe(res);
});

server.listen(port, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${port}/`;
  console.log(`[serve] Warcraft Rumble Standalone serving ${useDist ? 'dist/' : 'dev root'} at ${url}`);
  if (open) {
    const cmd = process.platform === 'darwin' ? `open "${url}"` : process.platform === 'win32' ? `start "" "${url}"` : `xdg-open "${url}"`;
    exec(cmd);
  }
});

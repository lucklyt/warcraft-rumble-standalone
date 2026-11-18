const IMAGE_CACHE = new Map();

export function normalizeAssetPath(rawPath) {
  if (!rawPath) return './r/crest.png';
  let p = String(rawPath).trim();
  if (p.startsWith('/r/')) p = '.' + p;
  else if (p.startsWith('r/')) p = './' + p;
  return p;
}

export function getCachedImage(rawPath) {
  if (typeof Image === 'undefined') return null;
  const src = normalizeAssetPath(rawPath);
  const existing = IMAGE_CACHE.get(src);
  if (existing) {
    return existing.loaded ? existing.img : null;
  }
  const img = new Image();
  const entry = { img, loaded: false, failed: false };
  img.onload = () => {
    entry.loaded = true;
  };
  img.onerror = () => {
    entry.failed = true;
  };
  img.src = src;
  IMAGE_CACHE.set(src, entry);
  return null;
}

export function preloadBattleAssets(paths = []) {
  const corePaths = [
    './r/d/m/onyxia.webp',
    './r/d/m/onyxia-warder.webp',
    './r/d/m/kobold-overseer.webp',
    './r/d/m/whelp-eggs.webp',
    './r/d/m/earth-elemental.webp',
    './r/d/m/drake.webp',
    './r/d/m/gargoyle.webp',
    './r/d/m/gryphon-rider.webp',
    './r/d/m/necromancer.webp',
    './r/d/m/spiderlings.webp',
    './r/d/m/warsong-grunts.webp',
    './r/d/m/prowler.webp',
    './r/d/m/skeletons.webp',
    './r/d/m/skeleton-party.webp',
    './r/onyxia/Onyxia_Smug.webp',
    './r/onyxia/Onyxia_Annoyed.webp',
    './r/onyxia/Onyxia_Angry.webp',
    './r/ui/gold-cost.webp',
    ...paths,
  ];
  for (const p of corePaths) {
    getCachedImage(p);
  }
}

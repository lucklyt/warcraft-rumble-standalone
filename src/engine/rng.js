/**
 * Deterministic Mulberry32 PRNG for reproducible combat & unit testing.
 */
export function createRng(seed = 20261118) {
  let a = (seed >>> 0) || 1;
  return {
    next() {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    range(min, max) {
      return min + (max - min) * this.next();
    },
    int(min, maxInclusive) {
      return Math.floor(min + (maxInclusive - min + 1) * this.next());
    },
    pick(list) {
      if (!list || list.length === 0) return undefined;
      return list[Math.floor(this.next() * list.length)];
    },
  };
}

export function shuffleWithRng(array, rng) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

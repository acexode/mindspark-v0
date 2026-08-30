/**
 * Fisher–Yates shuffle. Returns a new array; the input is never mutated.
 * Pass `random` in tests so the permutation is deterministic.
 */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const current = next[i];
    next[i] = next[j]!;
    next[j] = current!;
  }
  return next;
}

export function pickRandom<T>(items: readonly T[], random: () => number = Math.random): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(random() * items.length)];
}

/**
 * Spread a quiz across difficulties, then shuffle so the paper is never
 * the same order — or the same first items from each bucket — twice.
 */
export function balancedSample<T extends { difficulty: number }>(
  pool: readonly T[],
  count: number,
  random: () => number = Math.random,
): T[] {
  const byDifficulty = new Map<number, T[]>();
  for (const item of pool) {
    byDifficulty.set(item.difficulty, [...(byDifficulty.get(item.difficulty) ?? []), item]);
  }

  for (const [difficulty, bucket] of byDifficulty) {
    byDifficulty.set(difficulty, shuffle(bucket, random));
  }

  const selected: T[] = [];
  const difficulties = [...byDifficulty.keys()].sort((a, b) => a - b);
  let index = 0;

  while (selected.length < Math.min(count, pool.length)) {
    const difficulty = difficulties[index % difficulties.length];
    const next = byDifficulty.get(difficulty)?.shift();
    if (next) selected.push(next);
    index += 1;
    if (difficulties.every((d) => (byDifficulty.get(d)?.length ?? 0) === 0)) break;
  }

  return shuffle(selected, random);
}

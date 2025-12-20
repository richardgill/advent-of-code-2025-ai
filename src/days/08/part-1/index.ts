import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Point = { x: number; y: number; z: number };

const parsePoints = (input: string): Point[] =>
  lines(input).map((line) => {
    const [x, y, z] = line.split(",").map(Number) as [number, number, number];
    return { x, y, z };
  });

const distanceSquared = (a: Point, b: Point): number =>
  (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;

const createUnionFind = (n: number) => {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = Array<number>(n).fill(0);
  const size = Array<number>(n).fill(1);

  const find = (x: number): number => {
    const px = parent[x];
    if (px === undefined) return x;
    if (px !== x) {
      parent[x] = find(px);
    }
    return parent[x] ?? x;
  };

  const union = (x: number, y: number): void => {
    const px = find(x);
    const py = find(y);
    if (px === py) return;

    const rankPx = rank[px] ?? 0;
    const rankPy = rank[py] ?? 0;
    const sizePx = size[px] ?? 0;
    const sizePy = size[py] ?? 0;

    if (rankPx < rankPy) {
      parent[px] = py;
      size[py] = sizePy + sizePx;
    } else if (rankPx > rankPy) {
      parent[py] = px;
      size[px] = sizePx + sizePy;
    } else {
      parent[py] = px;
      size[px] = sizePx + sizePy;
      rank[px] = rankPx + 1;
    }
  };

  const getSize = (x: number): number => size[find(x)] ?? 0;

  return { find, union, getSize };
};

export const solve = (input: string, connections = 1000) => {
  const points = parsePoints(input);
  const n = points.length;

  const pairs: { i: number; j: number; dist: number }[] = [];
  for (let i = 0; i < n; i++) {
    const pi = points[i];
    if (!pi) continue;
    for (let j = i + 1; j < n; j++) {
      const pj = points[j];
      if (!pj) continue;
      pairs.push({ i, j, dist: distanceSquared(pi, pj) });
    }
  }

  pairs.sort((a, b) => a.dist - b.dist);

  const uf = createUnionFind(n);
  const limit = Math.min(connections, pairs.length);
  for (let k = 0; k < limit; k++) {
    const pair = pairs[k];
    if (!pair) continue;
    uf.union(pair.i, pair.j);
  }

  const circuitSizes = Array.from({ length: n }, (_, i) => i)
    .filter((i) => uf.find(i) === i)
    .map((i) => uf.getSize(i))
    .sort((a, b) => b - a);

  const [a, b, c] = circuitSizes as [number, number, number];
  return a * b * c;
};

console.log(solve(input));

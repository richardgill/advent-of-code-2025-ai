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
  let numComponents = n;

  const find = (x: number): number => {
    const px = parent[x];
    if (px === undefined) return x;
    if (px !== x) {
      parent[x] = find(px);
    }
    return parent[x] ?? x;
  };

  const union = (x: number, y: number): boolean => {
    const px = find(x);
    const py = find(y);
    if (px === py) return false;

    const rankPx = rank[px] ?? 0;
    const rankPy = rank[py] ?? 0;

    if (rankPx < rankPy) {
      parent[px] = py;
    } else if (rankPx > rankPy) {
      parent[py] = px;
    } else {
      parent[py] = px;
      rank[px] = rankPx + 1;
    }
    numComponents--;
    return true;
  };

  const getNumComponents = () => numComponents;

  return { find, union, getNumComponents };
};

export const solve = (input: string) => {
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

  for (const pair of pairs) {
    const merged = uf.union(pair.i, pair.j);
    if (merged && uf.getNumComponents() === 1) {
      const pi = points[pair.i];
      const pj = points[pair.j];
      if (!pi || !pj) return 0;
      return pi.x * pj.x;
    }
  }

  return 0;
};

console.log(solve(input));

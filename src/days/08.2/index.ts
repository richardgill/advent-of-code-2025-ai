// Connect junction boxes by shortest distances until all form one circuit.
// Return the product of X coordinates of the final connecting pair.

import { lines } from "../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Point = { x: number; y: number; z: number };

const parseInput = (input: string): Point[] => {
  return lines(input).map((line) => {
    const parts = line.split(",").map(Number);
    return { x: parts[0] ?? 0, y: parts[1] ?? 0, z: parts[2] ?? 0 };
  });
};

const distance = (a: Point, b: Point): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

// Union-find tracks connected components, counting how many remain
const createUnionFind = (n: number) => {
  const parent: number[] = Array.from({ length: n }, (_, i) => i);
  const rank: number[] = Array(n).fill(0) as number[];
  let numComponents = n;

  const find = (x: number): number => {
    const px = parent[x] ?? x;
    if (px !== x) {
      parent[x] = find(px); // path compression
    }
    return parent[x] ?? x;
  };

  const union = (x: number, y: number): boolean => {
    const rootX = find(x);
    const rootY = find(y);

    if (rootX === rootY) return false;

    const rankX = rank[rootX] ?? 0;
    const rankY = rank[rootY] ?? 0;

    if (rankX < rankY) {
      parent[rootX] = rootY;
    } else if (rankX > rankY) {
      parent[rootY] = rootX;
    } else {
      parent[rootY] = rootX;
      rank[rootX] = rankX + 1;
    }
    numComponents--;
    return true;
  };

  const getNumComponents = () => numComponents;

  return { union, getNumComponents };
};

export const solve = (input: string) => {
  const points = parseInput(input);
  const n = points.length;

  // Generate all pairs with their distances
  const pairs: { i: number; j: number; dist: number }[] = [];
  for (let i = 0; i < n; i++) {
    const pi = points[i];
    for (let j = i + 1; j < n; j++) {
      const pj = points[j];
      if (pi && pj) {
        pairs.push({ i, j, dist: distance(pi, pj) });
      }
    }
  }

  // Process shortest pairs first, stop when all connected
  pairs.sort((a, b) => a.dist - b.dist);

  const uf = createUnionFind(n);

  for (const pair of pairs) {
    const merged = uf.union(pair.i, pair.j);
    if (merged && uf.getNumComponents() === 1) {
      const pi = points[pair.i];
      const pj = points[pair.j];
      if (pi && pj) {
        return pi.x * pj.x;
      }
    }
  }

  return 0;
};

console.log(solve(input));

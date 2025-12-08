// Connect junction boxes by shortest distances, track circuit sizes with union-find.
// After 1000 connections, multiply the 3 largest circuit sizes.

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

// Union-find tracks connected components efficiently.
// Each node starts as its own parent; find() follows parent links to the root.
// union() merges two components by linking roots, using rank to keep trees shallow.
const createUnionFind = (n: number) => {
  const parent: number[] = Array.from({ length: n }, (_, i) => i);
  const rank: number[] = Array(n).fill(0) as number[];
  const size: number[] = Array(n).fill(1) as number[];

  const find = (x: number): number => {
    const px = parent[x] ?? x;
    if (px !== x) {
      parent[x] = find(px); // path compression: flatten tree on lookup
    }
    return parent[x] ?? x;
  };

  const union = (x: number, y: number): void => {
    const rootX = find(x);
    const rootY = find(y);

    if (rootX === rootY) return;

    const rankX = rank[rootX] ?? 0;
    const rankY = rank[rootY] ?? 0;
    const sizeX = size[rootX] ?? 0;
    const sizeY = size[rootY] ?? 0;

    if (rankX < rankY) {
      parent[rootX] = rootY;
      size[rootY] = sizeY + sizeX;
    } else if (rankX > rankY) {
      parent[rootY] = rootX;
      size[rootX] = sizeX + sizeY;
    } else {
      parent[rootY] = rootX;
      size[rootX] = sizeX + sizeY;
      rank[rootX] = rankX + 1;
    }
  };

  const getCircuitSizes = (): number[] => {
    const sizes: Map<number, number> = new Map();
    for (let i = 0; i < n; i++) {
      const root = find(i);
      if (!sizes.has(root)) {
        sizes.set(root, size[root] ?? 0);
      }
    }
    return Array.from(sizes.values()).sort((a, b) => b - a);
  };

  return { union, getCircuitSizes };
};

export const solve = (input: string, connections = 1000) => {
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

  // Process shortest pairs first
  pairs.sort((a, b) => a.dist - b.dist);

  const uf = createUnionFind(n);
  pairs.slice(0, connections).forEach((pair) => uf.union(pair.i, pair.j));

  const sizes = uf.getCircuitSizes();
  return (sizes[0] ?? 0) * (sizes[1] ?? 0) * (sizes[2] ?? 0);
};

console.log(solve(input));

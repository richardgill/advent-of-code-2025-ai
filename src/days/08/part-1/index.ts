import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Point = [number, number, number];

const parsePoints = (input: string): Point[] =>
  lines(input).map((line) => {
    const [x, y, z] = line.split(",").map(Number) as Point;
    return [x, y, z];
  });

const distanceSquared = (a: Point, b: Point): number =>
  (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

class UnionFind {
  private parent: Int32Array;
  private rank: Int32Array;
  private readonly n: number;

  constructor(n: number) {
    this.n = n;
    this.parent = new Int32Array(n).map((_, i) => i);
    this.rank = new Int32Array(n);
  }

  private at(arr: Int32Array, x: number): number {
    return arr[x] ?? 0;
  }

  private inc(arr: Int32Array, x: number): void {
    arr[x] = this.at(arr, x) + 1;
  }

  find(x: number): number {
    const p = this.at(this.parent, x);
    if (p !== x) {
      this.parent[x] = this.find(p);
      return this.at(this.parent, x);
    }
    return p;
  }

  union(x: number, y: number): void {
    const px = this.find(x);
    const py = this.find(y);
    if (px === py) return;
    const rankPx = this.at(this.rank, px);
    const rankPy = this.at(this.rank, py);
    if (rankPx < rankPy) {
      this.parent[px] = py;
    } else if (rankPx > rankPy) {
      this.parent[py] = px;
    } else {
      this.parent[py] = px;
      this.inc(this.rank, px);
    }
  }

  getCircuitSizes(): number[] {
    const sizes = new Map<number, number>();
    for (let i = 0; i < this.n; i++) {
      const root = this.find(i);
      sizes.set(root, (sizes.get(root) ?? 0) + 1);
    }
    return [...sizes.values()].sort((a, b) => b - a);
  }
}

export const solve = (input: string, connections = 1000) => {
  const points = parsePoints(input);
  const n = points.length;

  const pairs: { dist: number; i: number; j: number }[] = [];
  for (let i = 0; i < n; i++) {
    const pi = points[i];
    if (!pi) continue;
    for (let j = i + 1; j < n; j++) {
      const pj = points[j];
      if (!pj) continue;
      pairs.push({ dist: distanceSquared(pi, pj), i, j });
    }
  }
  pairs.sort((a, b) => a.dist - b.dist);

  const uf = new UnionFind(n);

  for (const { i, j } of pairs.slice(0, connections)) {
    uf.union(i, j);
  }

  const sizes = uf.getCircuitSizes();
  return (sizes[0] ?? 0) * (sizes[1] ?? 0) * (sizes[2] ?? 0);
};

console.log(solve(input));

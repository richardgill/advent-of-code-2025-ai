import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Point = { x: number; y: number };
type Range = [number, number];
type VEdge = { x: number; minY: number; maxY: number };
type HEdge = { y: number; minX: number; maxX: number };
type YRangeInfo = { ranges: Range[]; nextY: number };

const parsePoints = (input: string): Point[] =>
  lines(input).map((line) => {
    const [x, y] = line.split(",").map(Number) as [number, number];
    return { x, y };
  });

const buildEdges = (points: Point[]): { vEdges: VEdge[]; hEdges: HEdge[] } => {
  const vEdges: VEdge[] = [];
  const hEdges: HEdge[] = [];

  for (const [i, p1] of points.entries()) {
    const p2 = points[(i + 1) % points.length] as Point;

    if (p1.x === p2.x) {
      vEdges.push({
        x: p1.x,
        minY: Math.min(p1.y, p2.y),
        maxY: Math.max(p1.y, p2.y),
      });
    } else {
      hEdges.push({
        y: p1.y,
        minX: Math.min(p1.x, p2.x),
        maxX: Math.max(p1.x, p2.x),
      });
    }
  }

  return { vEdges, hEdges };
};

const pairCrossings = (crossings: number[]): Range[] => {
  const ranges: Range[] = [];
  for (let i = 0; i < crossings.length; i += 2) {
    ranges.push([crossings[i] as number, crossings[i + 1] as number]);
  }
  return ranges;
};

// Compute x-ranges covered at a boundary y (with horizontal edges and vertical edge points)
const computeBoundaryRanges = (
  y: number,
  vEdges: VEdge[],
  hEdges: HEdge[],
): Range[] => {
  const crossings = vEdges
    .filter((e) => e.minY < y && y <= e.maxY)
    .map((e) => e.x)
    .sort((a, b) => a - b);

  const ranges = pairCrossings(crossings);

  for (const e of hEdges) {
    if (e.y === y) ranges.push([e.minX, e.maxX]);
  }

  for (const e of vEdges) {
    if (e.minY <= y && y <= e.maxY) ranges.push([e.x, e.x]);
  }

  return ranges;
};

// Compute x-ranges covered at an interior y (only paired vertical crossings)
const computeInteriorRanges = (y: number, vEdges: VEdge[]): Range[] => {
  const crossings = vEdges
    .filter((e) => e.minY < y && y < e.maxY)
    .map((e) => e.x)
    .sort((a, b) => a - b);

  return pairCrossings(crossings);
};

const buildYRanges = (points: Point[]): Map<number, YRangeInfo> => {
  const { vEdges, hEdges } = buildEdges(points);

  const criticalYs = new Set<number>();
  for (const e of vEdges) {
    criticalYs.add(e.minY);
    criticalYs.add(e.maxY);
  }
  for (const e of hEdges) {
    criticalYs.add(e.y);
  }

  const sortedYs = [...criticalYs].sort((a, b) => a - b);
  const result = new Map<number, YRangeInfo>();

  for (const [yi, y] of sortedYs.entries()) {
    const nextY =
      yi + 1 < sortedYs.length ? (sortedYs[yi + 1] as number) : y + 1;

    result.set(y, {
      ranges: mergeRanges(computeBoundaryRanges(y, vEdges, hEdges)),
      nextY,
    });

    if (nextY > y + 1) {
      result.set(y + 1, {
        ranges: mergeRanges(computeInteriorRanges(y + 1, vEdges)),
        nextY,
      });
    }
  }

  return result;
};

const mergeRanges = (ranges: Range[]): Range[] => {
  if (ranges.length === 0) return [];
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const first = sorted[0] as Range;
  const merged: Range[] = [[first[0], first[1]]];

  for (const curr of sorted.slice(1)) {
    const last = merged[merged.length - 1] as Range;
    if (curr[0] <= last[1] + 1) {
      last[1] = Math.max(last[1], curr[1]);
    } else {
      merged.push([curr[0], curr[1]]);
    }
  }
  return merged;
};

const isRowCovered = (ranges: Range[], minX: number, maxX: number): boolean =>
  ranges.some(([rMinX, rMaxX]) => rMinX <= minX && rMaxX >= maxX);

const isRectangleValid = (
  p1: Point,
  p2: Point,
  yRanges: Map<number, YRangeInfo>,
  sortedYs: number[],
): boolean => {
  const minX = Math.min(p1.x, p2.x);
  const maxX = Math.max(p1.x, p2.x);
  const minY = Math.min(p1.y, p2.y);
  const maxY = Math.max(p1.y, p2.y);

  let lo = 0;
  let hi = sortedYs.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if ((sortedYs[mid] as number) < minY) lo = mid + 1;
    else hi = mid;
  }

  let y = sortedYs[lo] as number;
  while (y <= maxY) {
    const info = yRanges.get(y);
    if (!info || !isRowCovered(info.ranges, minX, maxX)) return false;
    y = info.nextY;
  }

  return true;
};

const rectangleArea = (p1: Point, p2: Point): number =>
  (Math.abs(p2.x - p1.x) + 1) * (Math.abs(p2.y - p1.y) + 1);

export const solve = (input: string) => {
  const points = parsePoints(input);
  const yRanges = buildYRanges(points);
  const sortedYs = [...yRanges.keys()].sort((a, b) => a - b);

  let maxArea = 0;

  for (const [i, p1] of points.entries()) {
    for (const p2 of points.slice(i + 1)) {
      if (isRectangleValid(p1, p2, yRanges, sortedYs)) {
        maxArea = Math.max(maxArea, rectangleArea(p1, p2));
      }
    }
  }

  return maxArea;
};

console.log(solve(input));

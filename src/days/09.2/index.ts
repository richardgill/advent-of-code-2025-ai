// Find largest rectangle with red corners where all tiles are red or green.
// Green tiles form edges between consecutive red tiles and fill the interior.
// Uses geometric approach to avoid enumerating all tiles.

import { lines } from "../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Point = { x: number; y: number };
type Segment = { p1: Point; p2: Point; isHorizontal: boolean };

const parseInput = (input: string): Point[] => {
  return lines(input).map((line) => {
    const [x, y] = line.split(",").map(Number);
    return { x: x ?? 0, y: y ?? 0 };
  });
};

const buildSegments = (redTiles: Point[]): Segment[] =>
  redTiles.map((p1, i) => {
    const p2 = redTiles[(i + 1) % redTiles.length] ?? p1;
    return { p1, p2, isHorizontal: p1.y === p2.y };
  });

// Ray casting: count vertical segment crossings to the right
const isPointInside = (x: number, y: number, segments: Segment[]): boolean => {
  let crossings = 0;
  for (const seg of segments) {
    if (seg.isHorizontal) continue;
    const segX = seg.p1.x;
    const minY = Math.min(seg.p1.y, seg.p2.y);
    const maxY = Math.max(seg.p1.y, seg.p2.y);
    if (segX > x && y > minY && y <= maxY) {
      crossings++;
    }
  }
  return crossings % 2 === 1;
};

const rectangleArea = (p1: Point, p2: Point): number => {
  const width = Math.abs(p2.x - p1.x) + 1;
  const height = Math.abs(p2.y - p1.y) + 1;
  return width * height;
};

// Rectangle is valid if the other two corners are inside and no boundary crosses the interior
const isRectangleValid = (
  p1: Point,
  p2: Point,
  segments: Segment[],
): boolean => {
  const minX = Math.min(p1.x, p2.x);
  const maxX = Math.max(p1.x, p2.x);
  const minY = Math.min(p1.y, p2.y);
  const maxY = Math.max(p1.y, p2.y);

  // Check the other two corners (the diagonal corners p1, p2 are red, so they're on boundary)
  if (!isPointInside(minX, maxY, segments)) return false;
  if (!isPointInside(maxX, minY, segments)) return false;

  // Check no boundary segment crosses into rectangle interior
  for (const seg of segments) {
    if (seg.isHorizontal) {
      const segY = seg.p1.y;
      const segMinX = Math.min(seg.p1.x, seg.p2.x);
      const segMaxX = Math.max(seg.p1.x, seg.p2.x);
      if (segY > minY && segY < maxY && segMinX < maxX && segMaxX > minX) {
        return false;
      }
    } else {
      const segX = seg.p1.x;
      const segMinY = Math.min(seg.p1.y, seg.p2.y);
      const segMaxY = Math.max(seg.p1.y, seg.p2.y);
      if (segX > minX && segX < maxX && segMinY < maxY && segMaxY > minY) {
        return false;
      }
    }
  }

  return true;
};

export const solve = (input: string) => {
  const redTiles = parseInput(input);
  const segments = buildSegments(redTiles);

  let maxArea = 0;

  for (const [i, p1] of redTiles.entries()) {
    for (const p2 of redTiles.slice(i + 1)) {
      if (isRectangleValid(p1, p2, segments)) {
        maxArea = Math.max(maxArea, rectangleArea(p1, p2));
      }
    }
  }

  return maxArea;
};

console.log(solve(input));

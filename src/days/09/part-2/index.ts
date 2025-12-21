import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Point = { x: number; y: number };
type Segment = { p1: Point; p2: Point; isVertical: boolean };

const parsePoints = (input: string): Point[] =>
  lines(input).map((line) => {
    const parts = line.split(",").map(Number);
    return { x: parts[0]!, y: parts[1]! };
  });

const buildSegments = (redPoints: Point[]): Segment[] => {
  const segments: Segment[] = [];
  for (let i = 0; i < redPoints.length; i++) {
    const p1 = redPoints[i]!;
    const p2 = redPoints[(i + 1) % redPoints.length]!;
    segments.push({ p1, p2, isVertical: p1.x === p2.x });
  }
  return segments;
};

const isPointInPolygon = (
  x: number,
  y: number,
  segments: Segment[],
): boolean => {
  let crossings = 0;

  for (const seg of segments) {
    if (!seg.isVertical) continue;

    const segX = seg.p1.x;
    const minY = Math.min(seg.p1.y, seg.p2.y);
    const maxY = Math.max(seg.p1.y, seg.p2.y);

    if (segX > x && y >= minY && y < maxY) {
      crossings++;
    }
  }

  return crossings % 2 === 1;
};

const isPointOnBoundary = (
  x: number,
  y: number,
  segments: Segment[],
): boolean => {
  for (const seg of segments) {
    if (seg.isVertical) {
      if (x === seg.p1.x) {
        const minY = Math.min(seg.p1.y, seg.p2.y);
        const maxY = Math.max(seg.p1.y, seg.p2.y);
        if (y >= minY && y <= maxY) return true;
      }
    } else {
      if (y === seg.p1.y) {
        const minX = Math.min(seg.p1.x, seg.p2.x);
        const maxX = Math.max(seg.p1.x, seg.p2.x);
        if (x >= minX && x <= maxX) return true;
      }
    }
  }
  return false;
};

const isPointValid = (x: number, y: number, segments: Segment[]): boolean =>
  isPointOnBoundary(x, y, segments) || isPointInPolygon(x, y, segments);

const isRectangleValid = (
  p1: Point,
  p2: Point,
  segments: Segment[],
  redPoints: Point[],
): boolean => {
  const minX = Math.min(p1.x, p2.x);
  const maxX = Math.max(p1.x, p2.x);
  const minY = Math.min(p1.y, p2.y);
  const maxY = Math.max(p1.y, p2.y);

  if (!isPointValid(minX, minY, segments)) return false;
  if (!isPointValid(maxX, minY, segments)) return false;
  if (!isPointValid(minX, maxY, segments)) return false;
  if (!isPointValid(maxX, maxY, segments)) return false;

  for (const rp of redPoints) {
    if (rp.x > minX && rp.x < maxX && rp.y > minY && rp.y < maxY) {
      return false;
    }
  }

  for (const seg of segments) {
    if (seg.isVertical) {
      const segX = seg.p1.x;
      const segMinY = Math.min(seg.p1.y, seg.p2.y);
      const segMaxY = Math.max(seg.p1.y, seg.p2.y);

      if (segX > minX && segX < maxX && segMinY <= minY && segMaxY >= maxY) {
        return false;
      }
    } else {
      const segY = seg.p1.y;
      const segMinX = Math.min(seg.p1.x, seg.p2.x);
      const segMaxX = Math.max(seg.p1.x, seg.p2.x);

      if (segY > minY && segY < maxY && segMinX <= minX && segMaxX >= maxX) {
        return false;
      }
    }
  }

  return true;
};

const rectangleArea = (p1: Point, p2: Point): number => {
  const width = Math.abs(p1.x - p2.x) + 1;
  const height = Math.abs(p1.y - p2.y) + 1;
  return width * height;
};

export const solve = (input: string) => {
  const redPoints = parsePoints(input);
  const segments = buildSegments(redPoints);

  let maxArea = 0;

  for (let i = 0; i < redPoints.length; i++) {
    for (let j = i + 1; j < redPoints.length; j++) {
      const p1 = redPoints[i]!;
      const p2 = redPoints[j]!;

      if (isRectangleValid(p1, p2, segments, redPoints)) {
        const area = rectangleArea(p1, p2);
        if (area > maxArea) maxArea = area;
      }
    }
  }

  return maxArea;
};

console.log(solve(input));

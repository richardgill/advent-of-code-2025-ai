// Find the largest rectangle using two red tiles as opposite corners.
// Area = (|x2 - x1| + 1) * (|y2 - y1| + 1) since corners are included.

import { lines } from "../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Point = { x: number; y: number };

const parseInput = (input: string): Point[] => {
  return lines(input).map((line) => {
    const [x, y] = line.split(",").map(Number);
    return { x: x ?? 0, y: y ?? 0 };
  });
};

const rectangleArea = (p1: Point, p2: Point): number => {
  const width = Math.abs(p2.x - p1.x) + 1;
  const height = Math.abs(p2.y - p1.y) + 1;
  return width * height;
};

export const solve = (input: string) => {
  const points = parseInput(input);
  let maxArea = 0;

  for (const [i, p1] of points.entries()) {
    for (const p2 of points.slice(i + 1)) {
      maxArea = Math.max(maxArea, rectangleArea(p1, p2));
    }
  }

  return maxArea;
};

console.log(solve(input));

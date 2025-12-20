import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Point = { x: number; y: number };

const parsePoints = (input: string): Point[] =>
  lines(input).map((line) => {
    const [x, y] = line.split(",").map(Number) as [number, number];
    return { x, y };
  });

const rectangleArea = (p1: Point, p2: Point): number =>
  (Math.abs(p2.x - p1.x) + 1) * (Math.abs(p2.y - p1.y) + 1);

export const solve = (input: string) => {
  const points = parsePoints(input);
  let maxArea = 0;

  for (const [i, p1] of points.entries()) {
    for (const p2 of points.slice(i + 1)) {
      maxArea = Math.max(maxArea, rectangleArea(p1, p2));
    }
  }

  return maxArea;
};

console.log(solve(input));

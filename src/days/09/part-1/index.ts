import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Point = { x: number; y: number };

const parsePoints = (input: string): Point[] =>
  lines(input).map((line) => {
    const parts = line.split(",").map(Number);
    return { x: parts[0]!, y: parts[1]! };
  });

const rectangleArea = (p1: Point, p2: Point): number => {
  const width = Math.abs(p1.x - p2.x) + 1;
  const height = Math.abs(p1.y - p2.y) + 1;
  return width * height;
};

export const solve = (input: string) => {
  const points = parsePoints(input);
  let maxArea = 0;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const area = rectangleArea(points[i]!, points[j]!);
      if (area > maxArea) maxArea = area;
    }
  }

  return maxArea;
};

console.log(solve(input));

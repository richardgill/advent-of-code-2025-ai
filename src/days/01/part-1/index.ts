import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Rotation = { direction: "L" | "R"; distance: number };

const parseRotation = (line: string): Rotation => ({
  direction: line[0] as "L" | "R",
  distance: parseInt(line.slice(1), 10),
});

const applyRotation = (position: number, rotation: Rotation): number => {
  const delta =
    rotation.direction === "R" ? rotation.distance : -rotation.distance;
  return (((position + delta) % 100) + 100) % 100;
};

export const solve = (input: string) => {
  const rotations = lines(input).map(parseRotation);
  let position = 50;
  let zeroCount = 0;

  for (const rotation of rotations) {
    position = applyRotation(position, rotation);
    if (position === 0) zeroCount++;
  }

  return zeroCount;
};

console.log(solve(input));

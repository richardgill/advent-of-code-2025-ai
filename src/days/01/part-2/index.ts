import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Rotation = { direction: "L" | "R"; distance: number };

const parseRotation = (line: string): Rotation => ({
  direction: line[0] as "L" | "R",
  distance: parseInt(line.slice(1), 10),
});

const countZeroCrossings = (position: number, rotation: Rotation): number => {
  const { direction, distance } = rotation;

  if (direction === "R") {
    return Math.floor((position + distance) / 100);
  } else {
    if (position === 0) {
      return Math.floor(distance / 100);
    }
    if (distance >= position) {
      return 1 + Math.floor((distance - position) / 100);
    }
    return 0;
  }
};

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
    zeroCount += countZeroCrossings(position, rotation);
    position = applyRotation(position, rotation);
  }

  return zeroCount;
};

console.log(solve(input));

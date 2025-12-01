import { lines } from "../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const countZerosLeft = (position: number, distance: number): number => {
  if (position === 0) return Math.floor(distance / 100);
  if (position > distance) return 0;
  return Math.floor((distance - position) / 100) + 1;
};

const countZerosRight = (position: number, distance: number): number => {
  if (position === 0) return Math.floor(distance / 100);
  const firstZero = 100 - position;
  if (firstZero > distance) return 0;
  return Math.floor((distance - firstZero) / 100) + 1;
};

export const solve = (input: string) => {
  const rotations = lines(input);
  let position = 50;
  let zeroCount = 0;

  for (const rotation of rotations) {
    const direction = rotation[0];
    const distance = parseInt(rotation.slice(1), 10);

    if (direction === "L") {
      zeroCount += countZerosLeft(position, distance);
      position = (((position - distance) % 100) + 100) % 100;
    } else {
      zeroCount += countZerosRight(position, distance);
      position = (position + distance) % 100;
    }
  }

  return zeroCount;
};

console.log(solve(input));

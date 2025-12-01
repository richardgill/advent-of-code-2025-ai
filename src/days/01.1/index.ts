import { lines } from "../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

export const solve = (input: string) => {
  const rotations = lines(input);
  let position = 50;
  let zeroCount = 0;

  for (const rotation of rotations) {
    const direction = rotation[0];
    const distance = parseInt(rotation.slice(1), 10);

    if (direction === "L") {
      position = (((position - distance) % 100) + 100) % 100;
    } else {
      position = (position + distance) % 100;
    }

    if (position === 0) {
      zeroCount++;
    }
  }

  return zeroCount;
};

console.log(solve(input));

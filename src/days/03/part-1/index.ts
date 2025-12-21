import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const maxJoltage = (bank: string): number => {
  const digits = [...bank].map(Number);
  let max = 0;
  digits.forEach((first, i) => {
    digits.slice(i + 1).forEach((second) => {
      const joltage = first * 10 + second;
      if (joltage > max) max = joltage;
    });
  });
  return max;
};

export const solve = (input: string) => {
  const data = lines(input);
  return data.reduce((sum, bank) => sum + maxJoltage(bank), 0);
};

console.log(solve(input));

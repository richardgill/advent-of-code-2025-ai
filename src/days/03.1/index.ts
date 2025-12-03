import { lines } from "../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const findMaxJoltage = (bank: string): number => {
  let maxJoltage = 0;

  for (let i = 0; i < bank.length - 1; i++) {
    for (let j = i + 1; j < bank.length; j++) {
      const joltage = Number(bank[i]) * 10 + Number(bank[j]);
      maxJoltage = Math.max(maxJoltage, joltage);
    }
  }

  return maxJoltage;
};

export const solve = (input: string) => {
  const banks = lines(input);
  return banks.reduce((sum, bank) => sum + findMaxJoltage(bank), 0);
};

console.log(solve(input));

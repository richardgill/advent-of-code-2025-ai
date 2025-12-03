import { lines } from "../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const TARGET_DIGITS = 12;

const findMaxJoltage = (bank: string): bigint => {
  let result = "";
  let startIdx = 0;

  for (let digitsNeeded = TARGET_DIGITS; digitsNeeded > 0; digitsNeeded--) {
    const endIdx = bank.length - digitsNeeded + 1;
    let maxDigit = "0";
    let maxPos = startIdx;

    for (let i = startIdx; i < endIdx; i++) {
      const digit = bank.charAt(i);
      if (digit > maxDigit) {
        maxDigit = digit;
        maxPos = i;
      }
    }

    result += maxDigit;
    startIdx = maxPos + 1;
  }

  return BigInt(result);
};

export const solve = (input: string) => {
  const banks = lines(input);
  return banks.reduce((sum, bank) => sum + findMaxJoltage(bank), 0n);
};

console.log(solve(input).toString());

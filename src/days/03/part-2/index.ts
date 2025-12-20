import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const maxJoltage = (bank: string, count: number): bigint => {
  let result = "";
  let startIdx = 0;

  for (let i = 0; i < count; i++) {
    const digitsNeeded = count - i - 1;
    const endIdx = bank.length - digitsNeeded;

    let bestCode = 0;
    let bestIdx = startIdx;

    for (let j = startIdx; j < endIdx; j++) {
      const code = bank.charCodeAt(j);
      if (code > bestCode) {
        bestCode = code;
        bestIdx = j;
      }
    }

    result += String.fromCharCode(bestCode);
    startIdx = bestIdx + 1;
  }

  return BigInt(result);
};

export const solve = (input: string) => {
  const banks = lines(input);
  return banks.reduce((sum, bank) => sum + maxJoltage(bank, 12), 0n);
};

console.log(solve(input).toString());

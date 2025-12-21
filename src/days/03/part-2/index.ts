import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const selectLargest = (bank: string, count: number): bigint => {
  const digits = [...bank].map(Number);
  const selected: number[] = [];
  let start = 0;

  for (let i = 0; i < count; i++) {
    const remaining = count - i;
    const end = digits.length - remaining + 1;
    let maxIdx = start;
    let maxVal = digits[maxIdx] ?? 0;
    for (let j = start + 1; j < end; j++) {
      const val = digits[j] ?? 0;
      if (val > maxVal) {
        maxIdx = j;
        maxVal = val;
      }
    }
    selected.push(maxVal);
    start = maxIdx + 1;
  }

  return BigInt(selected.join(""));
};

export const solve = (input: string) => {
  const data = lines(input);
  return data.reduce((sum, bank) => sum + selectLargest(bank, 12), 0n);
};

console.log(solve(input).toString());

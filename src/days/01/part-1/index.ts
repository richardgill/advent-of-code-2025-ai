import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const mod = (n: number, m: number) => ((n % m) + m) % m;

const parseDelta = (s: string) =>
  s[0] === "L" ? -parseInt(s.slice(1), 10) : parseInt(s.slice(1), 10);

export const solve = (input: string) => {
  const deltas = lines(input).map(parseDelta);
  let position = 50;
  let zeroCount = 0;

  for (const delta of deltas) {
    position = mod(position + delta, 100);
    if (position === 0) zeroCount++;
  }

  return zeroCount;
};

console.log(solve(input));

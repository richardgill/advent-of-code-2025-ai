import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

export const solve = (input: string) => {
  const data = lines(input);
  return data.length;
};

console.log(solve(input));

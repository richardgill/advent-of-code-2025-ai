import { solvePuzzle } from "../part-1/index";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

export const solve = (input: string): number => solvePuzzle(input);

console.log(solve(input));

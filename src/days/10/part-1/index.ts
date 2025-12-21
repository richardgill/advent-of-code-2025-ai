import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Machine = {
  target: number[];
  buttons: number[][];
};

const parseMachine = (line: string): Machine => {
  const bracketMatch = line.match(/\[([.#]+)\]/);
  const pattern = bracketMatch?.[1] ?? "";
  const target = pattern.split("").map((c) => (c === "#" ? 1 : 0));

  const buttonMatches = [...line.matchAll(/\(([0-9,]+)\)/g)];
  const numLights = target.length;
  const buttons = buttonMatches.map((m) => {
    const indices = new Set(m[1]?.split(",").map(Number) ?? []);
    return Array.from({ length: numLights }, (_, i) =>
      indices.has(i) ? 1 : 0,
    );
  });

  return { target, buttons };
};

const xorArrays = (a: number[], b: number[]): number[] =>
  a.map((v, i) => v ^ (b[i] ?? 0));

const isAllZero = (arr: number[]): boolean => arr.every((v) => v === 0);

const findMinPresses = (machine: Machine): number => {
  const { target, buttons } = machine;

  const search = (target: number[], idx: number): number => {
    if (isAllZero(target)) return 0;
    if (idx >= buttons.length) return Infinity;

    const skip = search(target, idx + 1);
    const button = buttons[idx];
    if (!button) return skip;
    const use = 1 + search(xorArrays(target, button), idx + 1);

    return Math.min(skip, use);
  };

  return search(target, 0);
};

export const solve = (input: string) =>
  lines(input)
    .map(parseMachine)
    .reduce((sum, machine) => sum + findMinPresses(machine), 0);

console.log(solve(input));

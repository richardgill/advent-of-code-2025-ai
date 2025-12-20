import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Machine = {
  target: boolean[];
  buttons: number[][];
};

const parseLine = (line: string): Machine => {
  const indicatorMatch = line.match(/\[([.#]+)\]/);
  if (!indicatorMatch) throw new Error("No indicator pattern found");

  const indicatorStr = indicatorMatch[1] ?? "";
  const target = [...indicatorStr].map((c) => c === "#");

  const buttonMatches = line.matchAll(/\(([0-9,]+)\)/g);
  const buttons = [...buttonMatches]
    .map((m) => m[1])
    .filter((s): s is string => s !== undefined)
    .map((s) => s.split(",").map(Number));

  return { target, buttons };
};

const findMinPresses = (machine: Machine): number => {
  const { target, buttons } = machine;
  const numLights = target.length;
  const numButtons = buttons.length;

  let minPresses = Infinity;

  for (let mask = 0; mask < 1 << numButtons; mask++) {
    const state = new Array(numLights).fill(false);

    let presses = 0;
    for (let i = 0; i < numButtons; i++) {
      if (mask & (1 << i)) {
        presses++;
        const button = buttons[i];
        if (button) {
          for (const light of button) {
            state[light] = !state[light];
          }
        }
      }
    }

    const matches = state.every((s, i) => s === target[i]);
    if (matches && presses < minPresses) {
      minPresses = presses;
    }
  }

  return minPresses === Infinity ? 0 : minPresses;
};

export const solve = (input: string) => {
  const data = lines(input);
  const machines = data.map(parseLine);

  return machines.reduce((sum, machine) => sum + findMinPresses(machine), 0);
};

console.log(solve(input));

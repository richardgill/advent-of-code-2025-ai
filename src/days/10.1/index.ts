import { lines } from "../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Machine = {
  target: number;
  buttons: number[];
};

const indicesToMask = (indices: number[]): number =>
  indices.reduce((mask, i) => mask | (1 << i), 0);

const parseLine = (line: string): Machine => {
  const indicatorMatch = line.match(/\[([.#]+)\]/);
  if (!indicatorMatch) throw new Error(`Invalid line: ${line}`);

  const indicator = indicatorMatch[1] ?? "";
  const onIndices = [...indicator].flatMap((c, i) => (c === "#" ? [i] : []));
  const target = indicesToMask(onIndices);

  const buttons = [...line.matchAll(/\(([^)]+)\)/g)].map((match) =>
    indicesToMask((match[1] ?? "").split(",").map(Number)),
  );

  return { target, buttons };
};

const findMinPresses = (machine: Machine): number => {
  const { target, buttons } = machine;

  // BFS to find minimum number of button presses
  // State is the current light configuration (bitmask)
  // We start at 0 (all off) and want to reach target
  const visited = new Set<number>();
  const queue: Array<{ state: number; presses: number; usedMask: number }> = [
    { state: 0, presses: 0, usedMask: 0 },
  ];
  visited.add(0);

  let current = queue.shift();
  while (current) {
    const { state, presses, usedMask } = current;

    if (state === target) {
      return presses;
    }

    // Try pressing each button we haven't used yet
    for (const [i, button] of buttons.entries()) {
      if (usedMask & (1 << i)) continue;

      const newState = state ^ button;
      const newUsedMask = usedMask | (1 << i);

      // Create a canonical key for this state + which buttons used
      const key = newState * (1 << buttons.length) + newUsedMask;

      if (!visited.has(key)) {
        visited.add(key);
        queue.push({
          state: newState,
          presses: presses + 1,
          usedMask: newUsedMask,
        });
      }
    }
    current = queue.shift();
  }

  throw new Error("No solution found");
};

export const solve = (input: string) => {
  const machines = lines(input).map(parseLine);
  return machines.reduce((sum, machine) => sum + findMinPresses(machine), 0);
};

console.log(solve(input));

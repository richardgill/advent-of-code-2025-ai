import { lines } from "../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

const countAdjacentPaper = (grid: string[][], r: number, c: number): number =>
  DIRECTIONS.filter(([dr, dc]) => grid[r + dr]?.[c + dc] === "@").length;

export const solve = (input: string) => {
  const grid = lines(input).map((line) => line.split(""));
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  let totalRemoved = 0;
  let removedThisRound = 0;

  do {
    const toRemove: [number, number][] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r]?.[c] === "@" && countAdjacentPaper(grid, r, c) < 4) {
          toRemove.push([r, c]);
        }
      }
    }

    for (const [r, c] of toRemove) {
      const row = grid[r];
      if (row) row[c] = ".";
    }

    removedThisRound = toRemove.length;
    totalRemoved += removedThisRound;
  } while (removedThisRound > 0);

  return totalRemoved;
};

console.log(solve(input));

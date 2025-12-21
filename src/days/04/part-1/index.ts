import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const DIRS: [number, number][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const countAdjacentRolls = (
  grid: string[],
  row: number,
  col: number,
): number => {
  let count = 0;
  for (const [dr, dc] of DIRS) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < grid.length && nc >= 0 && nc < (grid[0]?.length ?? 0)) {
      if (grid[nr]?.[nc] === "@") count++;
    }
  }
  return count;
};

export const solve = (input: string) => {
  const grid = lines(input);
  let accessibleCount = 0;

  for (let row = 0; row < grid.length; row++) {
    const rowData = grid[row] ?? "";
    for (let col = 0; col < rowData.length; col++) {
      if (rowData[col] === "@") {
        const adjacent = countAdjacentRolls(grid, row, col);
        if (adjacent < 4) {
          accessibleCount++;
        }
      }
    }
  }

  return accessibleCount;
};

console.log(solve(input));

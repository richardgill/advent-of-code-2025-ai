import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const DIRECTIONS: [number, number][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const countAdjacentRolls = (grid: string[], row: number, col: number): number =>
  DIRECTIONS.filter(([dr, dc]) => {
    const nr = row + dr;
    const nc = col + dc;
    return (
      nr >= 0 &&
      nr < grid.length &&
      nc >= 0 &&
      nc < (grid[0]?.length ?? 0) &&
      grid[nr]?.[nc] === "@"
    );
  }).length;

export const solve = (input: string) => {
  const grid = lines(input);
  let accessibleCount = 0;

  for (let row = 0; row < grid.length; row++) {
    const rowData = grid[row];
    if (!rowData) continue;
    for (let col = 0; col < rowData.length; col++) {
      if (rowData[col] === "@") {
        const adjacentRolls = countAdjacentRolls(grid, row, col);
        if (adjacentRolls < 4) {
          accessibleCount++;
        }
      }
    }
  }

  return accessibleCount;
};

console.log(solve(input));

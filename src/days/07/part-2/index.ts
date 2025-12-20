import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const findStart = (grid: string[]): [number, number] => {
  for (let row = 0; row < grid.length; row++) {
    const line = grid[row];
    if (!line) continue;
    const col = line.indexOf("S");
    if (col !== -1) return [row, col];
  }
  throw new Error("No start found");
};

const addTimelines = (map: Map<number, bigint>, col: number, count: bigint) => {
  map.set(col, (map.get(col) ?? 0n) + count);
};

export const solve = (input: string) => {
  const grid = lines(input);
  const firstRow = grid[0];
  if (!firstRow) return 0n;
  const width = firstRow.length;
  const [startRow, startCol] = findStart(grid);

  let timelines = new Map<number, bigint>([[startCol, 1n]]);
  let completedTimelines = 0n;

  for (let row = startRow + 1; row < grid.length; row++) {
    const newTimelines = new Map<number, bigint>();
    const currentRow = grid[row];
    if (!currentRow) continue;

    for (const [col, count] of timelines) {
      if (col < 0 || col >= width) {
        completedTimelines += count;
        continue;
      }

      if (currentRow[col] === "^") {
        addTimelines(newTimelines, col - 1, count);
        addTimelines(newTimelines, col + 1, count);
      } else {
        addTimelines(newTimelines, col, count);
      }
    }

    timelines = newTimelines;
  }

  for (const count of timelines.values()) {
    completedTimelines += count;
  }

  return completedTimelines;
};

console.log(solve(input).toString());

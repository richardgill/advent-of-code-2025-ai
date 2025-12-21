import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const addToMap = (map: Map<number, bigint>, col: number, count: bigint) => {
  map.set(col, (map.get(col) ?? 0n) + count);
};

export const solve = (input: string) => {
  const grid = lines(input);
  const firstRow = grid[0];
  if (!firstRow) return 0n;

  const height = grid.length;
  const width = firstRow.length;
  const startCol = firstRow.indexOf("S");

  let timelines = new Map<number, bigint>([[startCol, 1n]]);

  for (let row = 1; row < height; row++) {
    const currentRow = grid[row];
    if (!currentRow) break;

    const nextTimelines = new Map<number, bigint>();

    for (const [col, count] of timelines) {
      if (currentRow[col] === "^") {
        if (col - 1 >= 0) addToMap(nextTimelines, col - 1, count);
        if (col + 1 < width) addToMap(nextTimelines, col + 1, count);
      } else {
        addToMap(nextTimelines, col, count);
      }
    }

    timelines = nextTimelines;
  }

  return [...timelines.values()].reduce((sum, count) => sum + count, 0n);
};

console.log(solve(input).toString());

import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

export const solve = (input: string) => {
  const grid = lines(input);
  const firstRow = grid[0];
  if (!firstRow) return 0;

  const height = grid.length;
  const width = firstRow.length;
  const startCol = firstRow.indexOf("S");

  let beams = new Set<number>([startCol]);
  let splitCount = 0;

  for (let row = 1; row < height; row++) {
    const currentRow = grid[row];
    if (!currentRow) break;

    const nextBeams = new Set<number>();

    for (const col of beams) {
      const cell = currentRow[col];

      if (cell === "^") {
        splitCount++;
        if (col - 1 >= 0) nextBeams.add(col - 1);
        if (col + 1 < width) nextBeams.add(col + 1);
      } else {
        nextBeams.add(col);
      }
    }

    beams = nextBeams;
  }

  return splitCount;
};

console.log(solve(input));

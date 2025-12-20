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

export const solve = (input: string) => {
  const grid = lines(input);
  const firstRow = grid[0];
  if (!firstRow) return 0;
  const width = firstRow.length;
  const [startRow, startCol] = findStart(grid);

  let beams = new Set<number>([startCol]);
  let splitCount = 0;

  for (let row = startRow + 1; row < grid.length; row++) {
    const newBeams = new Set<number>();
    const currentRow = grid[row];
    if (!currentRow) continue;

    for (const col of beams) {
      if (col < 0 || col >= width) continue;

      if (currentRow[col] === "^") {
        splitCount++;
        newBeams.add(col - 1);
        newBeams.add(col + 1);
      } else {
        newBeams.add(col);
      }
    }

    beams = newBeams;
  }

  return splitCount;
};

console.log(solve(input));

import { lines } from "../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

export const solve = (input: string) => {
  const grid = lines(input);
  const height = grid.length;
  const width = grid[0]?.length ?? 0;

  const startCol = grid[0]?.indexOf("S") ?? -1;

  let splitCount = 0;
  const beams = new Set<number>();
  beams.add(startCol);

  for (let row = 1; row < height; row++) {
    const newBeams = new Set<number>();

    for (const col of beams) {
      if (col < 0 || col >= width) {
        continue;
      }

      const cell = grid[row]?.[col];
      if (cell === "^") {
        splitCount++;
        const left = col - 1;
        const right = col + 1;
        if (left >= 0) newBeams.add(left);
        if (right < width) newBeams.add(right);
      } else {
        newBeams.add(col);
      }
    }

    beams.clear();
    newBeams.forEach((b) => beams.add(b));
  }

  return splitCount;
};

console.log(solve(input));

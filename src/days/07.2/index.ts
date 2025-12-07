import { lines } from "../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

export const solve = (input: string) => {
  const grid = lines(input);
  const height = grid.length;
  const width = grid[0]?.length ?? 0;

  const startCol = grid[0]?.indexOf("S") ?? -1;

  let timelines = new Map<number, bigint>();
  timelines.set(startCol, 1n);

  for (let row = 1; row < height; row++) {
    const newTimelines = new Map<number, bigint>();

    for (const [col, count] of timelines) {
      if (col < 0 || col >= width) {
        continue;
      }

      const cell = grid[row]?.[col];
      if (cell === "^") {
        const left = col - 1;
        const right = col + 1;
        if (left >= 0) {
          newTimelines.set(left, (newTimelines.get(left) ?? 0n) + count);
        }
        if (right < width) {
          newTimelines.set(right, (newTimelines.get(right) ?? 0n) + count);
        }
      } else {
        newTimelines.set(col, (newTimelines.get(col) ?? 0n) + count);
      }
    }

    timelines = newTimelines;
  }

  const total = [...timelines.values()].reduce((a, b) => a + b, 0n);
  return total.toString();
};

console.log(solve(input));

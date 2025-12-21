const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const makeRepeatedId = (half: number): number =>
  Number(String(half) + String(half));

const findInvalidIdsInRange = (start: number, end: number): number[] => {
  const invalidIds: number[] = [];
  const maxHalfLen = Math.ceil(String(end).length / 2);

  for (let halfLen = 1; halfLen <= maxHalfLen; halfLen++) {
    const minHalf = 10 ** (halfLen - 1);
    const maxHalf = 10 ** halfLen - 1;

    for (let half = minHalf; half <= maxHalf; half++) {
      const candidate = makeRepeatedId(half);
      if (candidate >= start && candidate <= end) {
        invalidIds.push(candidate);
      }
    }
  }
  return invalidIds;
};

const parseRanges = (input: string) =>
  input
    .trim()
    .split(",")
    .map((range) => {
      const [start, end] = range.split("-").map(Number) as [number, number];
      return { start, end };
    });

export const solve = (input: string) =>
  parseRanges(input)
    .flatMap(({ start, end }) => findInvalidIdsInRange(start, end))
    .reduce((sum, id) => sum + id, 0);

console.log(solve(input));

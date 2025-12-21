const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const isRepeatedPattern = (s: string): boolean => {
  const len = s.length;
  for (let patternLen = 1; patternLen <= len / 2; patternLen++) {
    if (len % patternLen !== 0) continue;
    const pattern = s.slice(0, patternLen);
    const repeated = pattern.repeat(len / patternLen);
    if (repeated === s) return true;
  }
  return false;
};

const findInvalidIdsInRange = (start: number, end: number): number[] => {
  const invalidIds: number[] = [];

  for (let n = start; n <= end; n++) {
    if (isRepeatedPattern(String(n))) {
      invalidIds.push(n);
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

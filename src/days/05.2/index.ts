const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Range = { start: number; end: number };

const parseRanges = (input: string): Range[] => {
  const [rangesSection] = input.trim().split("\n\n") as [string];

  return rangesSection.split("\n").map((line) => {
    const [start, end] = line.split("-").map(Number) as [number, number];
    return { start, end };
  });
};

const mergeRanges = (ranges: Range[]): Range[] => {
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged: Range[] = [];

  for (const range of sorted) {
    const last = merged[merged.length - 1];
    if (last && range.start <= last.end + 1) {
      last.end = Math.max(last.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }

  return merged;
};

const countFreshIds = (ranges: Range[]): number => {
  return ranges.reduce((sum, range) => sum + (range.end - range.start + 1), 0);
};

export const solve = (input: string) => {
  const ranges = parseRanges(input);
  const merged = mergeRanges(ranges);
  return countFreshIds(merged);
};

console.log(solve(input));

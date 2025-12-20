const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Range = { start: number; end: number };

const parseRanges = (input: string): Range[] => {
  const sections = input.trim().split("\n\n");
  const rangeSection = sections[0] ?? "";

  return rangeSection.split("\n").map((line) => {
    const parts = line.split("-").map(Number);
    return { start: parts[0] ?? 0, end: parts[1] ?? 0 };
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

const countIds = (ranges: Range[]): number =>
  ranges.reduce((sum, r) => sum + (r.end - r.start + 1), 0);

export const solve = (input: string): number => {
  const ranges = parseRanges(input);
  const merged = mergeRanges(ranges);
  return countIds(merged);
};

console.log(solve(input));

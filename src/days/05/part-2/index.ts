const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Range = { start: number; end: number };

const parseRanges = (input: string): Range[] => {
  const sections = input.trim().split("\n\n");
  const rangesSection = sections[0] ?? "";

  return rangesSection.split("\n").map((line) => {
    const parts = line.split("-").map(Number);
    return { start: parts[0] ?? 0, end: parts[1] ?? 0 };
  });
};

const mergeRanges = (ranges: Range[]): Range[] => {
  if (ranges.length === 0) return [];

  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged: Range[] = [sorted[0] as Range];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i] as Range;
    const last = merged[merged.length - 1] as Range;

    if (current.start <= last.end + 1) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }

  return merged;
};

const countTotalIds = (ranges: Range[]): number =>
  ranges.reduce((sum, r) => sum + (r.end - r.start + 1), 0);

export const solve = (input: string): number => {
  const ranges = parseRanges(input);
  const merged = mergeRanges(ranges);
  return countTotalIds(merged);
};

console.log(solve(input));

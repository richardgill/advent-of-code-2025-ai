const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Range = { start: number; end: number };

const parseInput = (
  input: string,
): { ranges: Range[]; ingredients: number[] } => {
  const sections = input.trim().split("\n\n");
  const rangesSection = sections[0] ?? "";
  const ingredientsSection = sections[1] ?? "";

  const ranges: Range[] = rangesSection.split("\n").map((line) => {
    const parts = line.split("-").map(Number);
    return { start: parts[0] ?? 0, end: parts[1] ?? 0 };
  });

  const ingredients = ingredientsSection.split("\n").map(Number);

  return { ranges, ingredients };
};

const isInAnyRange = (id: number, ranges: Range[]): boolean =>
  ranges.some((r) => id >= r.start && id <= r.end);

export const solve = (input: string): number => {
  const { ranges, ingredients } = parseInput(input);
  return ingredients.filter((id) => isInAnyRange(id, ranges)).length;
};

console.log(solve(input));

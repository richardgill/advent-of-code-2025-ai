const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Range = { start: number; end: number };

const parseInput = (
  input: string,
): { ranges: Range[]; ingredients: number[] } => {
  const sections = input.trim().split("\n\n");
  const rangeSection = sections[0] ?? "";
  const ingredientSection = sections[1] ?? "";

  const ranges = rangeSection.split("\n").map((line) => {
    const parts = line.split("-").map(Number);
    return { start: parts[0] ?? 0, end: parts[1] ?? 0 };
  });

  const ingredients = ingredientSection.split("\n").map(Number);

  return { ranges, ingredients };
};

const isFresh = (id: number, ranges: Range[]): boolean =>
  ranges.some((r) => id >= r.start && id <= r.end);

export const solve = (input: string): number => {
  const { ranges, ingredients } = parseInput(input);
  return ingredients.filter((id) => isFresh(id, ranges)).length;
};

console.log(solve(input));

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Range = { start: number; end: number };

const parseInput = (
  input: string,
): { ranges: Range[]; ingredients: number[] } => {
  const [rangesSection, ingredientsSection] = input.trim().split("\n\n") as [
    string,
    string,
  ];

  const ranges = rangesSection.split("\n").map((line) => {
    const [start, end] = line.split("-").map(Number) as [number, number];
    return { start, end };
  });

  const ingredients = ingredientsSection.split("\n").map(Number);

  return { ranges, ingredients };
};

const isInRange = (id: number, ranges: Range[]): boolean => {
  return ranges.some((range) => id >= range.start && id <= range.end);
};

export const solve = (input: string) => {
  const { ranges, ingredients } = parseInput(input);
  return ingredients.filter((id) => isInRange(id, ranges)).length;
};

console.log(solve(input));

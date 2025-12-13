import { lines } from "../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Region = { area: number; counts: number[] };

const parseShape = (shapeStr: string): number =>
  shapeStr.split("").filter((c) => c === "#").length;

const parseInput = (
  inputStr: string,
): { shapeSizes: number[]; regions: Region[] } => {
  const sections = inputStr.trim().split("\n\n");

  const shapeIdx = sections.findIndex((s) => !s.match(/^\d+:/));
  const shapeSections = sections.slice(0, shapeIdx);
  const regionSections = sections.slice(shapeIdx);

  const shapeSizes = shapeSections.map((s) =>
    parseShape(s.split(":\n")[1] ?? ""),
  );

  const regions = regionSections.flatMap((section) =>
    lines(section)
      .filter((line) => line.trim())
      .map((line) => {
        const parts = line.split(/[:\s]+/);
        const dims = parts[0] ?? "";
        const counts = parts.slice(1);
        const dimParts = dims.split("x").map(Number);
        const w = dimParts[0] ?? 0;
        const h = dimParts[1] ?? 0;
        return { area: w * h, counts: counts.map(Number) };
      }),
  );

  return { shapeSizes, regions };
};

const cellsNeeded = (region: Region, shapeSizes: number[]): number =>
  region.counts.reduce(
    (sum, count, i) => sum + count * (shapeSizes[i] ?? 0),
    0,
  );

export const solve = (inputStr: string) => {
  const { shapeSizes, regions } = parseInput(inputStr);
  return regions.filter((r) => cellsNeeded(r, shapeSizes) <= r.area).length;
};

console.log(solve(input));

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Shape = boolean[][];
type Region = { width: number; height: number; quantities: number[] };

const parseInput = (input: string) => {
  const parts = input.split("\n\n");
  const shapes: Shape[] = [];
  const regions: Region[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (trimmed.includes("x")) {
      for (const line of trimmed.split("\n")) {
        const match = line.match(/^(\d+)x(\d+):\s*(.+)$/);
        if (match) {
          regions.push({
            width: parseInt(match[1]!),
            height: parseInt(match[2]!),
            quantities: match[3]!.split(/\s+/).map(Number),
          });
        }
      }
    } else {
      const lines = trimmed.split("\n");
      if (lines[0]?.endsWith(":")) {
        shapes.push(
          lines.slice(1).map((row) => row.split("").map((c) => c === "#")),
        );
      }
    }
  }

  return { shapes, regions };
};

const getShapeArea = (shape: Shape): number =>
  shape.flat().filter(Boolean).length;

const rotateShape = (shape: Shape): Shape => {
  const rows = shape.length;
  const cols = shape[0]!.length;
  return Array.from({ length: cols }, (_, c) =>
    Array.from({ length: rows }, (_, r) => shape[rows - 1 - r]![c]!),
  );
};

const flipShapeH = (shape: Shape): Shape =>
  shape.map((row) => [...row].reverse());

const normalizeShape = (shape: Shape): string =>
  shape.map((row) => row.map((c) => (c ? "#" : ".")).join("")).join("\n");

const getVariants = (shape: Shape): Shape[] => {
  const variants: Shape[] = [];
  const seen = new Set<string>();

  let current = shape;
  for (let rot = 0; rot < 4; rot++) {
    for (const flipped of [current, flipShapeH(current)]) {
      const key = normalizeShape(flipped);
      if (!seen.has(key)) {
        seen.add(key);
        variants.push(flipped);
      }
    }
    current = rotateShape(current);
  }

  return variants;
};

const canPlace = (
  grid: boolean[][],
  shape: Shape,
  startRow: number,
  startCol: number,
  height: number,
  width: number,
): boolean => {
  if (startRow + shape.length > height || startCol + shape[0]!.length > width) {
    return false;
  }

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0]!.length; c++) {
      if (shape[r]![c] && grid[startRow + r]![startCol + c]) {
        return false;
      }
    }
  }
  return true;
};

const placeShape = (
  grid: boolean[][],
  shape: Shape,
  startRow: number,
  startCol: number,
  value: boolean,
): void => {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0]!.length; c++) {
      if (shape[r]![c]) {
        grid[startRow + r]![startCol + c] = value;
      }
    }
  }
};

const canFitRegion = (
  width: number,
  height: number,
  shapeVariants: Shape[][],
  quantities: number[],
): boolean => {
  const gridArea = width * height;
  const totalShapeArea = quantities.reduce(
    (sum, qty, i) => sum + qty * getShapeArea(shapeVariants[i]![0]!),
    0,
  );

  if (totalShapeArea > gridArea) return false;

  const grid: boolean[][] = Array.from(
    { length: height },
    () => Array(width).fill(false) as boolean[],
  );

  const pieces: Shape[][] = [];
  for (let i = 0; i < quantities.length; i++) {
    for (let j = 0; j < quantities[i]!; j++) {
      pieces.push(shapeVariants[i]!);
    }
  }

  if (pieces.length === 0) return true;

  let attempts = 0;
  const maxAttempts = 1000000;

  const solve = (pieceIdx: number): boolean => {
    if (++attempts > maxAttempts) return false;
    if (pieceIdx >= pieces.length) return true;

    for (const variant of pieces[pieceIdx]!) {
      for (let row = 0; row <= height - variant.length; row++) {
        for (let col = 0; col <= width - variant[0]!.length; col++) {
          if (canPlace(grid, variant, row, col, height, width)) {
            placeShape(grid, variant, row, col, true);
            if (solve(pieceIdx + 1)) return true;
            placeShape(grid, variant, row, col, false);
          }
        }
      }
    }

    return false;
  };

  return solve(0);
};

export const solve = (input: string) => {
  const { shapes, regions } = parseInput(input);
  const allVariants = shapes.map(getVariants);

  return regions.filter((region) =>
    canFitRegion(region.width, region.height, allVariants, region.quantities),
  ).length;
};

console.log(solve(input));

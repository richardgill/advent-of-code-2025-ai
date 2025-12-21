const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Shape = boolean[][];
type Placement = { cells: number[]; minCell: number };

const rotateShape = (shape: Shape): Shape => {
  const rows = shape.length;
  const cols = shape[0]?.length ?? 0;
  const rotated: Shape = Array.from({ length: cols }, () =>
    Array(rows).fill(false),
  );
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const row = rotated[c];
      const srcRow = shape[r];
      if (row && srcRow) row[rows - 1 - r] = srcRow[c] ?? false;
    }
  }
  return rotated;
};

const flipShape = (shape: Shape): Shape =>
  shape.map((row) => [...row].reverse());

const shapeToString = (shape: Shape): string =>
  shape.map((row) => row.map((b) => (b ? "#" : ".")).join("")).join("\n");

const getAllOrientations = (shape: Shape): Shape[] => {
  const orientations: Shape[] = [];
  const seen = new Set<string>();
  let current = shape;

  for (let flip = 0; flip < 2; flip++) {
    for (let rot = 0; rot < 4; rot++) {
      const key = shapeToString(current);
      if (!seen.has(key)) {
        seen.add(key);
        orientations.push(current);
      }
      current = rotateShape(current);
    }
    current = flipShape(shape);
  }

  return orientations;
};

const parseShapes = (block: string): Map<number, Shape[]> => {
  const shapes = new Map<number, Shape[]>();

  for (const shapeBlock of block.split(/\n\n+/)) {
    const lines = shapeBlock.trim().split("\n");
    const header = lines[0];
    if (!header) continue;
    const match = header.match(/^(\d+):$/);
    if (!match?.[1]) continue;

    const idx = parseInt(match[1], 10);
    const shape: Shape = lines
      .slice(1)
      .map((row) => [...row].map((c) => c === "#"));
    shapes.set(idx, getAllOrientations(shape));
  }

  return shapes;
};

const parseRegions = (
  block: string,
): { width: number; height: number; counts: number[] }[] =>
  block
    .trim()
    .split("\n")
    .filter((l) => l.match(/^\d+x\d+:/))
    .map((line) => {
      const parts = line.split(/\s+/);
      const dims = parts[0] ?? "";
      const countsStr = parts.slice(1);
      const [widthStr, heightStr] = dims.replace(":", "").split("x");
      return {
        width: Number(widthStr),
        height: Number(heightStr),
        counts: countsStr.map(Number),
      };
    });

const precomputePlacements = (
  orientations: Shape[],
  width: number,
  height: number,
): Placement[] => {
  const placements: Placement[] = [];

  for (const orientation of orientations) {
    const shapeH = orientation.length;
    const shapeW = orientation[0]?.length ?? 0;

    for (let r = 0; r <= height - shapeH; r++) {
      for (let c = 0; c <= width - shapeW; c++) {
        const cells: number[] = [];
        for (let sr = 0; sr < shapeH; sr++) {
          for (let sc = 0; sc < shapeW; sc++) {
            if (orientation[sr]?.[sc]) {
              cells.push((r + sr) * width + (c + sc));
            }
          }
        }
        cells.sort((a, b) => a - b);
        placements.push({ cells, minCell: cells[0] ?? 0 });
      }
    }
  }

  return placements.sort((a, b) => a.minCell - b.minCell);
};

const canPlace = (grid: boolean[], cells: number[]): boolean =>
  cells.every((cell) => !grid[cell]);

const place = (grid: boolean[], cells: number[]): void => {
  for (const cell of cells) grid[cell] = true;
};

const unplace = (grid: boolean[], cells: number[]): void => {
  for (const cell of cells) grid[cell] = false;
};

const getShapeSize = (orientations: Shape[]): number =>
  (orientations[0] ?? []).flat().filter(Boolean).length;

// Backtracking solver with canonical ordering (minCell must be non-decreasing)
const solve = (
  grid: boolean[],
  piecePlacements: Placement[][],
  pieceIdx: number,
  prevMinCell: number,
): boolean => {
  if (pieceIdx >= piecePlacements.length) return true;

  const placements = piecePlacements[pieceIdx] ?? [];
  for (const placement of placements) {
    if (placement.minCell < prevMinCell) continue;

    if (canPlace(grid, placement.cells)) {
      place(grid, placement.cells);
      if (solve(grid, piecePlacements, pieceIdx + 1, placement.minCell)) {
        return true;
      }
      unplace(grid, placement.cells);
    }
  }

  return false;
};

const canFit = (
  width: number,
  height: number,
  shapes: Map<number, Shape[]>,
  counts: number[],
): boolean => {
  const pieces: Shape[][] = [];
  for (let i = 0; i < counts.length; i++) {
    const orientations = shapes.get(i);
    if (!orientations) continue;
    for (let j = 0; j < (counts[i] ?? 0); j++) {
      pieces.push(orientations);
    }
  }

  if (pieces.length === 0) return true;

  const totalCells = pieces.reduce((sum, o) => sum + getShapeSize(o), 0);
  if (totalCells > width * height) return false;

  pieces.sort((a, b) => getShapeSize(b) - getShapeSize(a));

  const piecePlacements = pieces.map((o) =>
    precomputePlacements(o, width, height),
  );
  const grid = new Array(width * height).fill(false);
  return solve(grid, piecePlacements, 0, 0);
};

export const solvePuzzle = (input: string): number => {
  const parts = input.trim().split(/\n\n(?=\d+x\d+:)/);
  const shapes = parseShapes(parts[0] ?? "");
  const regions = parseRegions(parts.slice(1).join("\n"));

  return regions.filter((r) => canFit(r.width, r.height, shapes, r.counts))
    .length;
};

console.log(solvePuzzle(input));

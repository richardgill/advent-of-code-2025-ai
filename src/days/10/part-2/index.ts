import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Machine = {
  target: number[];
  buttons: number[][];
};

type Fraction = { num: number; den: number };

const ZERO: Fraction = { num: 0, den: 1 };

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const frac = (num: number, den = 1): Fraction => {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(Math.abs(num), Math.abs(den));
  return { num: num / g, den: den / g };
};

const fracSub = (a: Fraction, b: Fraction): Fraction =>
  frac(a.num * b.den - b.num * a.den, a.den * b.den);

const fracMul = (a: Fraction, b: Fraction): Fraction =>
  frac(a.num * b.num, a.den * b.den);

const fracDiv = (a: Fraction, b: Fraction): Fraction =>
  frac(a.num * b.den, a.den * b.num);

const fracIsZero = (f: Fraction): boolean => f.num === 0;
const fracIsInt = (f: Fraction): boolean => f.den === 1;
const fracToNum = (f: Fraction): number => f.num / f.den;

const parseMachine = (line: string): Machine => {
  const joltageMatch = line.match(/\{([0-9,]+)\}/);
  const target = joltageMatch?.[1]?.split(",").map(Number) ?? [];

  const buttonMatches = [...line.matchAll(/\(([0-9,]+)\)/g)];
  const numCounters = target.length;
  const buttons = buttonMatches.map((m) => {
    const indices = new Set(m[1]?.split(",").map(Number) ?? []);
    return Array.from({ length: numCounters }, (_, i) =>
      indices.has(i) ? 1 : 0,
    );
  });

  return { target, buttons };
};

type RrefResult = {
  matrix: Fraction[][];
  pivotCols: number[];
  numButtons: number;
};

const get = (matrix: Fraction[][], row: number, col: number): Fraction =>
  matrix[row]?.[col] ?? ZERO;

const set = (
  matrix: Fraction[][],
  row: number,
  col: number,
  val: Fraction,
): void => {
  const r = matrix[row];
  if (r) r[col] = val;
};

const toRref = (buttons: number[][], target: number[]): RrefResult => {
  const numCounters = target.length;
  const numButtons = buttons.length;

  const matrix: Fraction[][] = Array.from({ length: numCounters }, (_, i) => [
    ...buttons.map((b) => frac(b[i] ?? 0)),
    frac(target[i] ?? 0),
  ]);

  const pivotCols: number[] = [];
  let pivotRow = 0;

  for (let col = 0; col < numButtons && pivotRow < numCounters; col++) {
    let maxRow = pivotRow;
    for (let row = pivotRow + 1; row < numCounters; row++) {
      if (
        Math.abs(fracToNum(get(matrix, row, col))) >
        Math.abs(fracToNum(get(matrix, maxRow, col)))
      ) {
        maxRow = row;
      }
    }

    if (fracIsZero(get(matrix, maxRow, col))) continue;

    const tmp = matrix[pivotRow];
    matrix[pivotRow] = matrix[maxRow] ?? [];
    matrix[maxRow] = tmp ?? [];

    const pivotVal = get(matrix, pivotRow, col);
    for (let j = col; j <= numButtons; j++) {
      set(matrix, pivotRow, j, fracDiv(get(matrix, pivotRow, j), pivotVal));
    }

    for (let row = 0; row < numCounters; row++) {
      if (row !== pivotRow && !fracIsZero(get(matrix, row, col))) {
        const factor = get(matrix, row, col);
        for (let j = col; j <= numButtons; j++) {
          set(
            matrix,
            row,
            j,
            fracSub(
              get(matrix, row, j),
              fracMul(factor, get(matrix, pivotRow, j)),
            ),
          );
        }
      }
    }

    pivotCols.push(col);
    pivotRow++;
  }

  return { matrix, pivotCols, numButtons };
};

const findMinPresses = (machine: Machine): number => {
  const { target, buttons } = machine;
  const { matrix, pivotCols, numButtons } = toRref(buttons, target);

  const freeVars = Array.from({ length: numButtons }, (_, i) => i).filter(
    (col) => !pivotCols.includes(col),
  );

  const maxFreeVal = Math.max(...target);
  let minPresses = Infinity;

  const tryAssignment = (freeVals: number[]): void => {
    const solution: number[] = Array(numButtons).fill(0);
    freeVars.forEach((col, i) => {
      solution[col] = freeVals[i] ?? 0;
    });

    for (let i = pivotCols.length - 1; i >= 0; i--) {
      const col = pivotCols[i] ?? 0;
      let val = get(matrix, i, numButtons);

      for (let j = col + 1; j < numButtons; j++) {
        val = fracSub(val, fracMul(get(matrix, i, j), frac(solution[j] ?? 0)));
      }

      if (!fracIsInt(val) || fracToNum(val) < 0) return;
      solution[col] = fracToNum(val);
    }

    const total = solution.reduce((sum, v) => sum + v, 0);
    if (total < minPresses) minPresses = total;
  };

  const iterate = (idx: number, current: number[]): void => {
    if (idx >= freeVars.length) {
      tryAssignment(current);
      return;
    }
    for (let v = 0; v <= maxFreeVal; v++) {
      current.push(v);
      iterate(idx + 1, current);
      current.pop();
    }
  };

  iterate(0, []);
  return minPresses;
};

export const solve = (input: string) =>
  lines(input)
    .map(parseMachine)
    .reduce((sum, machine) => sum + findMinPresses(machine), 0);

console.log(solve(input));

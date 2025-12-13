import { lines } from "../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Machine = {
  targets: number[];
  buttons: number[][];
};

const parseLine = (line: string): Machine => {
  const joltageMatch = line.match(/\{([^}]+)\}/);
  if (!joltageMatch) throw new Error(`Invalid line: ${line}`);
  const targets = (joltageMatch[1] ?? "").split(",").map(Number);

  const buttons = [...line.matchAll(/\(([^)]+)\)/g)].map((match) =>
    (match[1] ?? "").split(",").map(Number),
  );

  return { targets, buttons };
};

// Rational number arithmetic to avoid floating point errors in Gaussian elimination
type Frac = [bigint, bigint];

const gcd = (a: bigint, b: bigint): bigint => (b === 0n ? a : gcd(b, a % b));
const abs = (a: bigint): bigint => (a < 0n ? -a : a);

const simplify = ([n, d]: Frac): Frac => {
  if (d === 0n) throw new Error("Division by zero");
  const g = gcd(abs(n), abs(d));
  const sign = d < 0n ? -1n : 1n;
  return [(sign * n) / g, (sign * d) / g];
};

const fracSub = (a: Frac, b: Frac): Frac =>
  simplify([a[0] * b[1] - b[0] * a[1], a[1] * b[1]]);
const fracMul = (a: Frac, b: Frac): Frac =>
  simplify([a[0] * b[0], a[1] * b[1]]);
const fracDiv = (a: Frac, b: Frac): Frac =>
  simplify([a[0] * b[1], a[1] * b[0]]);
const fracZero = (): Frac => [0n, 1n];
const fracOne = (): Frac => [1n, 1n];
const fracFromInt = (n: number): Frac => [BigInt(n), 1n];
const fracIsZero = (a: Frac): boolean => a[0] === 0n;
const fracIsNonNegInt = (a: Frac): boolean =>
  a[1] === 1n || a[1] === -1n ? a[0] * a[1] >= 0n : false;
const fracToInt = (a: Frac): number => {
  if (a[1] !== 1n && a[1] !== -1n) throw new Error("Not an integer");
  return Number(a[0] * a[1]);
};

const at = <T>(arr: T[], i: number): T => {
  const val = arr[i];
  if (val === undefined) throw new Error(`Index ${i} out of bounds`);
  return val;
};

const findMinPresses = (machine: Machine): number => {
  const { targets, buttons } = machine;
  const numCounters = targets.length;
  const numButtons = buttons.length;

  // Build augmented matrix [A | b]
  const matrix: Frac[][] = Array.from({ length: numCounters }, (_, i) => {
    const row: Frac[] = Array.from({ length: numButtons + 1 }, () =>
      fracZero(),
    );
    row[numButtons] = fracFromInt(at(targets, i));
    return row;
  });

  for (const [j, button] of buttons.entries()) {
    for (const i of button) {
      at(matrix, i)[j] = fracOne();
    }
  }

  // Gaussian elimination
  let pivotRow = 0;
  const pivotCols: number[] = [];

  for (let col = 0; col < numButtons && pivotRow < numCounters; col++) {
    let maxRow = -1;
    for (let row = pivotRow; row < numCounters; row++) {
      if (!fracIsZero(at(at(matrix, row), col))) {
        maxRow = row;
        break;
      }
    }

    if (maxRow === -1) continue;

    [matrix[pivotRow], matrix[maxRow]] = [
      at(matrix, maxRow),
      at(matrix, pivotRow),
    ];
    pivotCols.push(col);

    for (let row = pivotRow + 1; row < numCounters; row++) {
      const rowArr = at(matrix, row);
      const pivotRowArr = at(matrix, pivotRow);
      if (!fracIsZero(at(rowArr, col))) {
        const factor = fracDiv(at(rowArr, col), at(pivotRowArr, col));
        for (let c = col; c <= numButtons; c++) {
          rowArr[c] = fracSub(
            at(rowArr, c),
            fracMul(factor, at(pivotRowArr, c)),
          );
        }
      }
    }
    pivotRow++;
  }

  // Check for inconsistency
  for (let row = pivotRow; row < numCounters; row++) {
    if (!fracIsZero(at(at(matrix, row), numButtons))) {
      throw new Error("No solution");
    }
  }

  const freeVars: number[] = [];
  const pivotSet = new Set(pivotCols);
  for (let col = 0; col < numButtons; col++) {
    if (!pivotSet.has(col)) freeVars.push(col);
  }

  let bestTotal = Infinity;

  const searchFree = (freeIdx: number, freeVals: number[]): void => {
    const currentFreeSum = freeVals
      .slice(0, freeIdx)
      .reduce((a, b) => a + b, 0);
    if (currentFreeSum >= bestTotal) return;

    if (freeIdx === freeVars.length) {
      const solution = Array<number>(numButtons).fill(0);
      for (const [i, col] of freeVars.entries()) {
        solution[col] = at(freeVals, i);
      }

      for (let r = pivotCols.length - 1; r >= 0; r--) {
        const col = at(pivotCols, r);
        const rowArr = at(matrix, r);
        let val = at(rowArr, numButtons);
        for (let c = col + 1; c < numButtons; c++) {
          val = fracSub(
            val,
            fracMul(at(rowArr, c), fracFromInt(at(solution, c))),
          );
        }
        val = fracDiv(val, at(rowArr, col));
        if (!fracIsNonNegInt(val)) return;
        solution[col] = fracToInt(val);
        if (at(solution, col) < 0) return;
      }

      const total = solution.reduce((a, b) => a + b, 0);
      if (total < bestTotal) bestTotal = total;
      return;
    }

    const freeCol = at(freeVars, freeIdx);
    const button = at(buttons, freeCol);
    const max = Math.min(...button.map((i: number) => at(targets, i)));

    for (let v = 0; v <= max; v++) {
      freeVals[freeIdx] = v;
      searchFree(freeIdx + 1, freeVals);
    }
  };

  searchFree(0, Array(freeVars.length).fill(0));

  if (bestTotal === Infinity) throw new Error("No solution found");
  return bestTotal;
};

export const solve = (input: string) => {
  const machines = lines(input).map(parseLine);
  return machines.reduce((sum, machine) => sum + findMinPresses(machine), 0);
};

console.log(solve(input));

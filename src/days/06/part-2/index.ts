import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Problem = { numbers: bigint[]; operator: string };

const extractColumnNumber = (
  numberRows: string[],
  col: number,
): bigint | null => {
  const digits = numberRows
    .map((row) => row[col] ?? " ")
    .join("")
    .trim();
  if (digits === "") return null;
  const num = parseInt(digits, 10);
  return Number.isNaN(num) ? null : BigInt(num);
};

const parseProblems = (input: string): Problem[] => {
  const rows = lines(input).filter((r) => r.length > 0);
  if (rows.length === 0) return [];

  const maxLen = Math.max(...rows.map((r) => r.length));
  const grid = rows.map((r) => r.padEnd(maxLen, " "));
  const operatorRow = grid.at(-1) ?? "";
  const numberRows = grid.slice(0, -1);

  const problems: Problem[] = [];
  let currentCols: number[] = [];
  let currentOperator = "";

  const finalizeProblem = () => {
    if (currentCols.length === 0) return;
    const numbers = currentCols
      .map((col) => extractColumnNumber(numberRows, col))
      .filter((n): n is bigint => n !== null);
    if (numbers.length > 0) {
      problems.push({ numbers, operator: currentOperator });
    }
    currentCols = [];
    currentOperator = "";
  };

  // Process columns right-to-left
  for (let col = maxLen - 1; col >= 0; col--) {
    const isSpaceCol = numberRows.every((row) => row[col] === " ");
    const opChar = operatorRow[col] ?? " ";

    if (isSpaceCol && opChar === " ") {
      finalizeProblem();
    } else {
      currentCols.push(col);
      if (opChar === "+" || opChar === "*") {
        currentOperator = opChar;
      }
    }
  }
  finalizeProblem();

  return problems;
};

const evaluateProblem = (p: Problem): bigint =>
  p.operator === "+"
    ? p.numbers.reduce((a, b) => a + b, 0n)
    : p.numbers.reduce((a, b) => a * b, 1n);

export const solve = (input: string): bigint =>
  parseProblems(input)
    .filter((p) => p.numbers.length > 0)
    .reduce((total, p) => total + evaluateProblem(p), 0n);

console.log(solve(input).toString());

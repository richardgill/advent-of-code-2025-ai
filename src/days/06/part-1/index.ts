import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Problem = { numbers: bigint[]; operator: string };

const extractNumbers = (numberRows: string[], cols: number[]): bigint[] =>
  numberRows
    .map((row) => {
      const str = cols.map((c) => row[c]).join("");
      const num = parseInt(str.trim(), 10);
      return Number.isNaN(num) ? null : BigInt(num);
    })
    .filter((n): n is bigint => n !== null);

const parseProblems = (input: string): Problem[] => {
  const rows = lines(input).filter((r) => r.length > 0);
  if (rows.length === 0) return [];

  const maxLen = Math.max(...rows.map((r) => r.length));
  const grid = rows.map((r) => r.padEnd(maxLen, " "));
  const operatorRow = grid.at(-1) ?? "";
  const numberRows = grid.slice(0, -1);

  const problems: Problem[] = [];
  let currentProblem: { cols: number[]; operator: string } | null = null;

  const finalizeProblem = () => {
    if (currentProblem === null) return;
    const numbers = extractNumbers(numberRows, currentProblem.cols);
    problems.push({ numbers, operator: currentProblem.operator });
    currentProblem = null;
  };

  for (let col = 0; col < maxLen; col++) {
    const isSpaceCol = numberRows.every((row) => row[col] === " ");
    const opChar = operatorRow[col] ?? " ";

    if (isSpaceCol && opChar === " ") {
      finalizeProblem();
    } else if (currentProblem === null) {
      currentProblem = { cols: [col], operator: opChar };
    } else {
      currentProblem.cols.push(col);
      if (opChar === "+" || opChar === "*") {
        currentProblem.operator = opChar;
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

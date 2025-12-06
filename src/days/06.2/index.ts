const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Problem = {
  numbers: number[];
  operator: "*" | "+";
};

const isBlankColumn = (rows: string[], col: number): boolean =>
  rows.every((row) => row[col] === " " || row[col] === undefined);

const extractColumnNumber = (rows: string[], col: number): number => {
  const digits = rows
    .map((row) => row[col])
    .filter((c) => c !== " " && c !== undefined);
  return Number(digits.join(""));
};

const parseInput = (input: string): Problem[] => {
  const rows = input.split("\n").filter((row) => row.length > 0);
  if (rows.length === 0) return [];

  const maxLen = Math.max(...rows.map((r) => r.length));
  const paddedRows = rows.map((r) => r.padEnd(maxLen, " "));
  const operatorRow = paddedRows.at(-1) as string;
  const numberRows = paddedRows.slice(0, -1);

  const problems: Problem[] = [];
  let currentNumbers: number[] = [];
  let lastNonBlankCol = -1;
  let inProblem = false;

  for (let col = maxLen - 1; col >= -1; col--) {
    const isBlank = col < 0 || isBlankColumn(numberRows, col);

    if (isBlank) {
      if (inProblem) {
        const op = operatorRow[lastNonBlankCol] === "+" ? "+" : "*";
        problems.push({ numbers: currentNumbers, operator: op });
        currentNumbers = [];
        inProblem = false;
      }
    } else {
      inProblem = true;
      lastNonBlankCol = col;
      const num = extractColumnNumber(numberRows, col);
      currentNumbers.push(num);
    }
  }

  return problems;
};

const solveProblem = (problem: Problem): number =>
  problem.operator === "+"
    ? problem.numbers.reduce((acc, n) => acc + n, 0)
    : problem.numbers.reduce((acc, n) => acc * n, 1);

export const solve = (input: string) => {
  const problems = parseInput(input);
  return problems.reduce((sum, p) => sum + solveProblem(p), 0);
};

console.log(solve(input));

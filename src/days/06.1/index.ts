const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Problem = {
  numbers: number[];
  operator: "*" | "+";
};

const extractNumbers = (
  rows: string[],
  startCol: number,
  endCol: number,
): number[] =>
  rows
    .map((row) => row.slice(startCol, endCol).trim())
    .filter((s) => s.length > 0)
    .map(Number);

const isBlankColumn = (rows: string[], col: number): boolean =>
  rows.every((row) => row[col] === " " || row[col] === undefined);

const parseInput = (input: string): Problem[] => {
  const rows = input.split("\n").filter((row) => row.length > 0);
  if (rows.length === 0) return [];

  const maxLen = Math.max(...rows.map((r) => r.length));
  const paddedRows = rows.map((r) => r.padEnd(maxLen, " "));
  const operatorRow = paddedRows.at(-1) as string;
  const numberRows = paddedRows.slice(0, -1);

  const problems: Problem[] = [];
  let colStart = -1;

  for (let col = 0; col <= maxLen; col++) {
    const isBlank = col === maxLen || isBlankColumn(numberRows, col);

    if (isBlank && colStart >= 0) {
      problems.push({
        numbers: extractNumbers(numberRows, colStart, col),
        operator: operatorRow[colStart] === "+" ? "+" : "*",
      });
      colStart = -1;
    } else if (!isBlank && colStart < 0) {
      colStart = col;
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

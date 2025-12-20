const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Problem = { numbers: number[]; operator: "+" | "*" };

const parseProblems = (input: string): Problem[] => {
  const rows = input.split("\n").filter((line) => line.length > 0);
  if (rows.length === 0) return [];

  const operatorRow = rows[rows.length - 1];
  const numberRows = rows.slice(0, -1);
  const width = Math.max(...rows.map((r) => r.length));

  const problems: Problem[] = [];
  let numberStrs: string[] | null = null;
  let operator: "+" | "*" = "+";

  const finalizeProblem = () => {
    if (numberStrs) {
      problems.push({
        numbers: numberStrs.map((n) => parseInt(n.trim(), 10)),
        operator,
      });
      numberStrs = null;
    }
  };

  for (let col = 0; col < width; col++) {
    const colChars = numberRows.map((row) => row[col] ?? " ");
    const opChar = operatorRow?.[col] ?? " ";
    const isSpaceCol = colChars.every((c) => c === " ") && opChar === " ";

    if (isSpaceCol) {
      finalizeProblem();
    } else {
      if (!numberStrs) {
        numberStrs = numberRows.map(() => "");
      }
      const strs = numberStrs;
      colChars.forEach((char, row) => {
        strs[row] += char;
      });
      if (opChar === "+" || opChar === "*") {
        operator = opChar;
      }
    }
  }
  finalizeProblem();

  return problems;
};

const evaluateProblem = (problem: Problem): number =>
  problem.operator === "+"
    ? problem.numbers.reduce((a, b) => a + b, 0)
    : problem.numbers.reduce((a, b) => a * b, 1);

export const solve = (input: string) =>
  parseProblems(input)
    .map(evaluateProblem)
    .reduce((a, b) => a + b, 0);

console.log(solve(input));

import { lines } from "../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

type Graph = Map<string, string[]>;

const parseInput = (input: string): Graph => {
  const graph: Graph = new Map();

  for (const line of lines(input)) {
    const [from, rest] = line.split(": ");
    if (!from || !rest) continue;
    const outputs = rest.split(" ");
    graph.set(from, outputs);
  }

  return graph;
};

const countPathsWithRequired = (
  graph: Graph,
  from: string,
  to: string,
  required: [string, string],
): number => {
  const memo = new Map<string, number>();

  const count = (
    node: string,
    visitedFirst: boolean,
    visitedSecond: boolean,
  ): number => {
    const atFirst = node === required[0];
    const atSecond = node === required[1];
    const newVisitedFirst = visitedFirst || atFirst;
    const newVisitedSecond = visitedSecond || atSecond;

    if (node === to) {
      return newVisitedFirst && newVisitedSecond ? 1 : 0;
    }

    const stateKey = `${node}:${newVisitedFirst}:${newVisitedSecond}`;
    const cached = memo.get(stateKey);
    if (cached !== undefined) return cached;

    const outputs = graph.get(node) ?? [];
    const total = outputs.reduce(
      (sum, next) => sum + count(next, newVisitedFirst, newVisitedSecond),
      0,
    );

    memo.set(stateKey, total);
    return total;
  };

  return count(from, false, false);
};

export const solve = (input: string) => {
  const graph = parseInput(input);
  return countPathsWithRequired(graph, "svr", "out", ["dac", "fft"]);
};

console.log(solve(input));

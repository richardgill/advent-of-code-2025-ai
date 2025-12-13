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

const countPaths = (graph: Graph, from: string, to: string): number => {
  const memo = new Map<string, number>();

  const count = (node: string): number => {
    if (node === to) return 1;

    const cached = memo.get(node);
    if (cached !== undefined) return cached;

    const outputs = graph.get(node) ?? [];
    const total = outputs.reduce((sum, next) => sum + count(next), 0);

    memo.set(node, total);
    return total;
  };

  return count(from);
};

export const solve = (input: string) => {
  const graph = parseInput(input);
  return countPaths(graph, "you", "out");
};

console.log(solve(input));

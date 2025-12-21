import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const parseGraph = (input: string): Map<string, string[]> => {
  const graph = new Map<string, string[]>();
  for (const line of lines(input)) {
    const [node, targets] = line.split(": ") as [string, string];
    graph.set(node, targets.split(" "));
  }
  return graph;
};

const countPaths = (
  graph: Map<string, string[]>,
  from: string,
  to: string,
  memo: Map<string, number> = new Map(),
): number => {
  if (from === to) return 1;
  const cached = memo.get(from);
  if (cached !== undefined) return cached;

  const neighbors = graph.get(from) ?? [];
  const total = neighbors.reduce(
    (sum, neighbor) => sum + countPaths(graph, neighbor, to, memo),
    0,
  );

  memo.set(from, total);
  return total;
};

export const solve = (input: string) => {
  const graph = parseGraph(input);
  return countPaths(graph, "you", "out");
};

console.log(solve(input));

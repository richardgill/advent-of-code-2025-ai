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

  const svrToDac = countPaths(graph, "svr", "dac");
  const dacToFft = countPaths(graph, "dac", "fft");
  const fftToOut = countPaths(graph, "fft", "out");

  const svrToFft = countPaths(graph, "svr", "fft");
  const fftToDac = countPaths(graph, "fft", "dac");
  const dacToOut = countPaths(graph, "dac", "out");

  return svrToDac * dacToFft * fftToOut + svrToFft * fftToDac * dacToOut;
};

console.log(solve(input));

import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

export const solve = (input: string) => {
  const graph = new Map<string, string[]>();

  for (const line of lines(input)) {
    const [src, dests] = line.split(": ") as [string, string];
    graph.set(src, dests.split(" "));
  }

  const memo = new Map<string, number>();

  const countPaths = (node: string): number => {
    if (node === "out") return 1;
    const cached = memo.get(node);
    if (cached !== undefined) return cached;

    const neighbors = graph.get(node) ?? [];
    const total = neighbors.reduce((sum, next) => sum + countPaths(next), 0);
    memo.set(node, total);
    return total;
  };

  return countPaths("you");
};

console.log(solve(input));

import { lines } from "../../../lib/utils";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

export const solve = (input: string) => {
  const graph = new Map<string, string[]>();

  for (const line of lines(input)) {
    const [src, dests] = line.split(": ") as [string, string];
    graph.set(src, dests.split(" "));
  }

  const countPaths = (
    from: string,
    to: string,
    exclude: Set<string>,
    memo = new Map<string, number>(),
  ): number => {
    if (from === to) return 1;
    if (exclude.has(from)) return 0;
    const cached = memo.get(from);
    if (cached !== undefined) return cached;

    const neighbors = graph.get(from) ?? [];
    const total = neighbors.reduce(
      (sum, next) => sum + countPaths(next, to, exclude, memo),
      0,
    );
    memo.set(from, total);
    return total;
  };

  // Paths: svr → dac (avoiding fft) → fft → out
  const svrToDacNoFft = countPaths("svr", "dac", new Set(["fft"]));
  const dacToFft = countPaths("dac", "fft", new Set());
  const fftToOut = countPaths("fft", "out", new Set());
  const dacFirst = svrToDacNoFft * dacToFft * fftToOut;

  // Paths: svr → fft (avoiding dac) → dac → out
  const svrToFftNoDac = countPaths("svr", "fft", new Set(["dac"]));
  const fftToDac = countPaths("fft", "dac", new Set());
  const dacToOut = countPaths("dac", "out", new Set());
  const fftFirst = svrToFftNoDac * fftToDac * dacToOut;

  return dacFirst + fftFirst;
};

console.log(solve(input));

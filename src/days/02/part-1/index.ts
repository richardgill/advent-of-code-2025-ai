const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const isRepeatedSequence = (n: number): boolean => {
  const s = String(n);
  if (s.length % 2 !== 0) return false;
  const half = s.length / 2;
  return s.slice(0, half) === s.slice(half);
};

export const solve = (input: string) => {
  const ranges = input.trim().split(",");
  let sum = 0;

  for (const range of ranges) {
    const parts = range.split("-").map(Number);
    const start = parts[0] ?? 0;
    const end = parts[1] ?? 0;
    for (let id = start; id <= end; id++) {
      if (isRepeatedSequence(id)) {
        sum += id;
      }
    }
  }

  return sum;
};

console.log(solve(input));

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const isRepeatedSequence = (n: number): boolean => {
  const s = String(n);
  const len = s.length;

  for (let patternLen = 1; patternLen <= len / 2; patternLen++) {
    if (len % patternLen !== 0) continue;
    const pattern = s.slice(0, patternLen);
    if (pattern.repeat(len / patternLen) === s) return true;
  }
  return false;
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

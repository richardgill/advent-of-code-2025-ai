const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const isInvalidId = (n: bigint): boolean => {
  const str = n.toString();
  const len = str.length;
  for (let patternLen = 1; patternLen <= len / 2; patternLen++) {
    if (len % patternLen !== 0) continue;
    const pattern = str.slice(0, patternLen);
    let matches = true;
    for (let i = patternLen; i < len; i += patternLen) {
      if (str.slice(i, i + patternLen) !== pattern) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }
  return false;
};

export const solve = (input: string) => {
  const ranges = input.trim().split(",");
  let sum = 0n;

  for (const range of ranges) {
    const [start, end] = range.split("-").map(BigInt) as [bigint, bigint];
    for (let id = start; id <= end; id++) {
      if (isInvalidId(id)) {
        sum += id;
      }
    }
  }

  return sum;
};

console.log(solve(input).toString());

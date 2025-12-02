const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

const isInvalidId = (n: bigint): boolean => {
  const str = n.toString();
  if (str.length % 2 !== 0) return false;
  const half = str.length / 2;
  return str.slice(0, half) === str.slice(half);
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

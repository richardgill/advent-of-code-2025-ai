const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

export const solve = (_input: string) => {
  // Part 2 is a freebie - star given automatically after completing part 1
  return "free star";
};

console.log(solve(input));

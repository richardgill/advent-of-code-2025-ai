import { expect, test } from "bun:test";
import { solve } from "./index";

const example1 = await Bun.file(import.meta.dir + "/data/example1.txt").text();

test("example1", () => {
  expect(solve(example1)).toBe(3263827n);
});

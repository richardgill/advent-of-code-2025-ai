import { expect, test } from "bun:test";
import { solvePuzzle } from "./index";

const example1 = await Bun.file(import.meta.dir + "/data/example1.txt").text();

test("example 1", () => {
  expect(solvePuzzle(example1)).toBe(2);
});

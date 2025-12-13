import { expect, test } from "bun:test";
import { solve } from "./index";

const input = await Bun.file(import.meta.dir + "/data/input.txt").text();

test("solves puzzle input", () => {
  expect(solve(input)).toBe(408);
});

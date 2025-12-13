import { expect, test } from "bun:test";
import { solve } from "./index";

const example1 = await Bun.file(import.meta.dir + "/data/example1.txt").text();

test("example1 - 2 paths from svr to out visiting both dac and fft", () => {
  expect(solve(example1)).toBe(2);
});

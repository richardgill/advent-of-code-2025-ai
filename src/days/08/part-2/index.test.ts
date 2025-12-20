import { expect, test } from "bun:test";
import { solve } from "./index";

const example1 = await Bun.file(import.meta.dir + "/data/example1.txt").text();

test("example1 - last connection to form single circuit", () => {
  expect(solve(example1)).toBe(25272);
});

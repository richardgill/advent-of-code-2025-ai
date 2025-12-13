import { expect, test } from "bun:test";
import { solve } from "./index";

test("part 2 is a freebie", () => {
  expect(solve("")).toBe("free star");
});

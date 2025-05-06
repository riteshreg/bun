import { expect, it, describe, test } from "bun:test";
import { sum } from "./math";

it("2+3 is 5", () => {
  const output = sum(2, 3);
  expect(output).toBe(5);
});

it("2+2 should not be  5", () => {
  const output = sum(2, 2);
  expect(output).not.toBe(5);
});

test("NODE_ENV is set to test", () => {
  expect(process.env.NODE_ENV).toBe("test");
});

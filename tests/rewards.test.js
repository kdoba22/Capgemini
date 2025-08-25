// tests/rewards.test.js
import { calcPoints } from "../js/rewards.js";
import { REWARD_THRESHOLDS } from "../js/constants.js";

describe("calcPoints - whole dollar amounts", () => {
  test("$49 earns 0 points", () => expect(calcPoints(49)).toBe(0));
  test("$50 earns 0 points", () => expect(calcPoints(50)).toBe(0));
  test("$75 earns 25 points", () => expect(calcPoints(75)).toBe(25)); // 75-50
  test("$100 earns 50 points", () => expect(calcPoints(100)).toBe(50)); // 100-50
  test("$120 earns 90 points", () => expect(calcPoints(120)).toBe(90)); // 50 + (20*2)
  test("$200 earns 250 points", () => expect(calcPoints(200)).toBe(250)); // 50 + 100*2
});

describe("calcPoints - fractional amounts (floored)", () => {
  test("$50.99 earns o points", () => expect(calcPoints(50.99)).toBe(0));
  test("$100.01 earns 50 points (because floor to 100)", () =>
    expect(calcPoints(100.01)).toBe(50));
  test("$120.99 earns 90 points (floor to 120)", () =>
    expect(calcPoints(120.99)).toBe(90));
});

describe("calcPoints - invalid inputs", () => {
  test("negative earns 0 points", () => expect(calcPoints(-10)).toBe(0));
  test("NaN earns 0 points", () => expect(calcPoints(Number.NaN)).toBe(0));
  test("Infinity earns 0 points", () => expect(calcPoints(Infinity)).toBe(0));
});

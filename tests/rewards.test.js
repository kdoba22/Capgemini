// tests/rewards.test.js
import { calcPoints } from '../js/rewards.js';
import { REWARD_THRESHOLDS } from '../js/constants.js';

describe('calcPoints - whole dollar amounts', () => {
  test('$49 → 0', () => expect(calcPoints(49)).toBe(0));
  test('$50 → 0', () => expect(calcPoints(50)).toBe(0));
  test('$75 → 25', () => expect(calcPoints(75)).toBe(25)); // 75-50
  test('$100 → 50', () => expect(calcPoints(100)).toBe(50)); // 100-50
  test('$120 → 90', () => expect(calcPoints(120)).toBe(90)); // 50 + (20*2)
  test('$200 → 250', () => expect(calcPoints(200)).toBe(250)); // 50 + 100*2
});

describe('calcPoints - fractional amounts (floored)', () => {
  test('$50.99 → 0', () => expect(calcPoints(50.99)).toBe(0));
  test('$100.01 → 50 (because floor to 100)', () => expect(calcPoints(100.01)).toBe(50));
  test('$120.99 → 90 (floor to 120)', () => expect(calcPoints(120.99)).toBe(90));
});

describe('calcPoints - invalid inputs', () => {
  test('negative → 0', () => expect(calcPoints(-10)).toBe(0));
  test('NaN → 0', () => expect(calcPoints(Number.NaN)).toBe(0));
  test('Infinity → 0', () => expect(calcPoints(Infinity)).toBe(0));
});

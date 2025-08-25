// rewards.js
/**
 * Reward calculation utilities.
 * @module rewards
 */

import { REWARD_THRESHOLDS, FLOOR_TO_WHOLE_DOLLARS } from "./constants.js";

/**
 * Calculate reward points for a single transaction amount.
 * Business rule: "per dollar spent" -> floor to whole dollars first if configured.
 * @param {number} amount - transaction amount (>= 0)
 * @returns {number} points earned
 */
export function calcPoints(amount) {
  if (typeof amount !== "number" || !isFinite(amount) || amount < 0) return 0;
  const a = FLOOR_TO_WHOLE_DOLLARS ? Math.floor(amount) : amount;
  if (a > REWARD_THRESHOLDS.UPPER) {
    return (
      (a - REWARD_THRESHOLDS.UPPER) * 2 +
      (REWARD_THRESHOLDS.UPPER - REWARD_THRESHOLDS.LOWER)
    );
  }
  if (a > REWARD_THRESHOLDS.LOWER) {
    return a - REWARD_THRESHOLDS.LOWER;
  }
  return 0;
}

/**
 * Group transactions by customerId, then by year-month.
 * @param {Array<{customerId:string, transactionId:string, amount:number, date:string}>} txs
 */
// export function summarizeByCustomerAndMonth(txs) {
//   const summary = {};
//   for (const t of txs) {
//     const cid = t.customerId;
//     const dt = new Date(t.date);
//     if (isNaN(dt)) continue;
//     const ym = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(
//       2,
//       "0"
//     )}`;
//     const pts = calcPoints(t.amount);
//     if (!summary[cid]) summary[cid] = { months: {}, total: 0 };
//     if (!summary[cid].months[ym]) summary[cid].months[ym] = 0;
//     summary[cid].months[ym] += pts;
//     summary[cid].total += pts;
//   }
//   return summary;
// }

/**
 * Filter transactions by year & (optional) month
 * @param {Array} txs
 * @param {number} year
 * @param {number|null} monthIndex - 0..11 or null for all months
 */
export function filterByYearMonth(txs, year, monthIndex = null) {
  return txs.filter((t) => {
    const d = new Date(t.date);
    return (
      d.getFullYear() === year &&
      (monthIndex === null || d.getMonth() === monthIndex)
    );
  });
}

/**
 * Return a set of the most recent N months (year-month strings) relative to now.
 * @param {number} n
 * @returns {Array<string>} like ['2025-08','2025-07','2025-06']
 */
export function recentMonths(n) {
  const now = new Date();
  const arr = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    arr.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return arr;
}

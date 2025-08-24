// constants.js
// Centralized static values (no hard-coded literals elsewhere)

/**
 * @module constants
 */

/** Default logging level (info|debug|error|silent) */
export const LOG_LEVEL = 'info';

/** Number of customers to show per page in the directory table */
export const PAGE_SIZE = 10;

/** Rewards program thresholds */
export const REWARD_THRESHOLDS = Object.freeze({
  LOWER: 50,   // dollars > 50 earn 1 point each up to 100
  UPPER: 100   // dollars > 100 earn 2 points each, plus 50 from the LOWER band
});

/** Year filter values (2025 default) */
export const YEAR_OPTIONS = [2025, 2024, 2023, 2022, 2021];

/** Month names used for display & filtering */
export const MONTHS = Object.freeze([
  'JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'
]);

/**
 * Whether to floor amounts to whole dollars before reward calculation.
 * Business rule: "per dollar spent" -> floor cents.
 */
export const FLOOR_TO_WHOLE_DOLLARS = true;

/** Default last-N-months window shown on load */
export const DEFAULT_LAST_N_MONTHS = 3;

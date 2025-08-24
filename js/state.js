// state.js
/**
 * Central app state (kept minimal).
 * @module state
 */

export const state = {
  allTxs: [],
  filteredYear: 2025,
  filteredMonthIndex: null, // 0..11 or null
  selectedCustomerId: null,
  page: 1,
  pageSize: 10,
};

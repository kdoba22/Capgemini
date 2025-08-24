// index.js
/**
 * App entrypoint.
 * @module index
 */

import { LOG_LEVEL } from './js/constants.js';
import { setLevel, info } from './js/logger.js';
import { fetchTransactions } from './js/api.js';
import { state } from './js/state.js';
import { renderFilters, renderCustomerTable, wireHandlers, renderCustomerSummary, renderTransactionsForSelectedMonth, applyDefaultRecent3 } from './js/ui.js';

async function init(){
  setLevel(LOG_LEVEL);
  info('App starting');

  applyDefaultRecent3();
  renderFilters();
  wireHandlers();

  try {
    state.allTxs = await fetchTransactions();
  } catch (e){
    document.getElementById('appError').textContent = 'Failed to load transactions. Please try again.';
    return;
  }

  renderCustomerTable();
  // Auto-select first customer for convenience
  const first = [...new Set(state.allTxs.map(t=>t.customerId))].sort()[0];
  state.selectedCustomerId = first || null;
  renderCustomerSummary();
  renderTransactionsForSelectedMonth();
}

window.addEventListener('DOMContentLoaded', init);

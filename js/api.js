// api.js
/**
 * Simulated async API that reads local JSON.
 * Adds an artificial delay & handles errors.
 * @module api
 */

import { info, debug, error } from './logger.js';

/**
 * Fetch transactions from local JSON.
 * @returns {Promise<Array<{customerId:string, transactionId:string, amount:number, date:string}>>}
 */
export async function fetchTransactions(){
  info('API: fetching transactions.json');
  await new Promise(r => setTimeout(r, 400)); // simulate latency
  try {
    const res = await fetch('./public/data/transactions.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    /** @type {Array} */
    const data = await res.json();
    debug('API: fetched count', { count: data.length });
    return data;
  } catch (e){
    error('API: fetch failed', { message: e.message });
    throw e;
  }
}

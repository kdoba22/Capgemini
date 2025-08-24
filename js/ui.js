// ui.js
/**
 * UI rendering & interactions
 * @module ui
 */

import { MONTHS, PAGE_SIZE, YEAR_OPTIONS, DEFAULT_LAST_N_MONTHS } from './constants.js';
import { info, debug } from './logger.js';
import { state } from './state.js';
import { calcPoints, filterByYearMonth, recentMonths } from './rewards.js';

/** Utility */
function el(id){ return document.getElementById(id); }

/** Format currency */
function money(n){ return n.toLocaleString(undefined,{ style:'currency', currency:'USD' }); }

/** Render year & month dropdowns */
export function renderFilters(){
  const yearSel = el('yearFilter');
  yearSel.innerHTML = '';
  for (const y of YEAR_OPTIONS){
    const opt = document.createElement('option');
    opt.value = y; opt.textContent = y;
    if (y === state.filteredYear) opt.selected = true;
    yearSel.appendChild(opt);
  }
  const monthSel = el('monthFilter');
  monthSel.innerHTML = '<option value="">All Months</option>';
  MONTHS.forEach((m, idx) => {
    const opt = document.createElement('option');
    opt.value = String(idx);
    opt.textContent = m;
    if (state.filteredMonthIndex === idx) opt.selected = true;
    monthSel.appendChild(opt);
  });
}

/** Initialize default to last 3 recent months */
export function applyDefaultRecent3(){
  const recents = recentMonths(DEFAULT_LAST_N_MONTHS);
  const [y,m] = recents[0].split('-'); // current month as default selection
  state.filteredYear = Number(y);
  state.filteredMonthIndex = Number(m) - 1;
}

/** Build customer directory table with pagination */
export function renderCustomerTable(){
  const container = el('customersBody');
  const customers = Array.from(new Set(state.allTxs.map(t => t.customerId))).sort();
  const totalPages = Math.max(1, Math.ceil(customers.length / PAGE_SIZE));
  if (state.page > totalPages) state.page = totalPages;

  const start = (state.page - 1) * PAGE_SIZE;
  const pageItems = customers.slice(start, start + PAGE_SIZE);

  container.innerHTML = '';
  for (const cid of pageItems){
    const tr = document.createElement('tr');
    const tdId = document.createElement('td'); tdId.textContent = cid;
    tdId.className = 'cid';
    const tdBtn = document.createElement('td');
    const btn = document.createElement('button');
    btn.textContent = 'View';
    btn.className = 'btn';
    btn.addEventListener('click', () => {
      state.selectedCustomerId = cid;
      renderCustomerSummary();
      renderTransactionsForSelectedMonth();
      info('UI: Selected customer', { customerId: cid });
    });
    tdBtn.appendChild(btn);
    tr.append(tdId, tdBtn);
    container.appendChild(tr);
  }

  el('paginationInfo').textContent = `Page ${state.page} / ${totalPages}`;
  el('prevPage').disabled = state.page <= 1;
  el('nextPage').disabled = state.page >= totalPages;
}

/** Render summary (per month + total) for selected customer */
export function renderCustomerSummary(){
  const cid = state.selectedCustomerId;
  const wrap = el('summary');
  wrap.innerHTML = cid ? `<h3>Customer ${cid}</h3>` : '<h3>Select a customer</h3>';
  if (!cid) return;

  const year = state.filteredYear;
  const monthIndex = state.filteredMonthIndex;

  // Filter to requested year (all months)
  const txs = filterByYearMonth(state.allTxs, year, null).filter(t => t.customerId === cid);

  // Compute month totals for this year
  const perMonth = new Map(MONTHS.map((m, i) => [i, 0]));
  let grand = 0;
  for (const t of txs){
    const d = new Date(t.date);
    const pts = calcPoints(t.amount);
    perMonth.set(d.getMonth(), perMonth.get(d.getMonth()) + pts);
    grand += pts;
  }

  // Create month grid
  const grid = document.createElement('div');
  grid.className = 'month-grid';
  MONTHS.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.tabIndex = 0;
    card.innerHTML = `<div class="card-title">${m} ${year}</div>
                      <div class="card-points">${perMonth.get(i)} pts</div>`;
    card.addEventListener('click', () => {
      state.filteredMonthIndex = i;
      el('monthFilter').value = String(i);
      renderTransactionsForSelectedMonth();
      info('UI: Month selected', { monthIndex:i, month:m });
    });
    if (i === monthIndex) card.classList.add('active');
    grid.appendChild(card);
  });

  // Total
  const totalDiv = document.createElement('div');
  totalDiv.className = 'total';
  totalDiv.textContent = `Year ${year} Total: ${grand} pts`;

  wrap.appendChild(grid);
  wrap.appendChild(totalDiv);
}

/** Render transaction list for selected customer & month */
export function renderTransactionsForSelectedMonth(){
  const list = el('txList');
  list.innerHTML = '';
  const cid = state.selectedCustomerId;
  if (!cid){
    list.innerHTML = '<li class="muted">No customer selected</li>';
    return;
  }
  const year = state.filteredYear;
  const mIdx = state.filteredMonthIndex;
  const monthTxs = filterByYearMonth(state.allTxs, year, mIdx).filter(t => t.customerId === cid);

  if (monthTxs.length === 0){
    list.innerHTML = '<li class="muted">No transactions</li>';
    return;
  }

  for (const t of monthTxs.sort((a,b)=> new Date(a.date)-new Date(b.date))){
    const pts = calcPoints(t.amount);
    const li = document.createElement('li');
    const d = new Date(t.date);
    li.innerHTML = `<div><strong>${d.toLocaleDateString()}</strong> — ${money(t.amount)} — <span class="tag">${pts} pts</span></div>
                    <div class="small muted">Txn: ${t.transactionId}</div>`;
    list.appendChild(li);
  }
}

/** Wire events */
export function wireHandlers(){
  el('yearFilter').addEventListener('change', e => {
    state.filteredYear = Number(e.target.value);
    renderCustomerSummary();
    renderTransactionsForSelectedMonth();
  });
  el('monthFilter').addEventListener('change', e => {
    const v = e.target.value;
    state.filteredMonthIndex = v === '' ? null : Number(v);
    renderCustomerSummary();
    renderTransactionsForSelectedMonth();
  });
  el('prevPage').addEventListener('click', () => { state.page--; renderCustomerTable(); });
  el('nextPage').addEventListener('click', () => { state.page++; renderCustomerTable(); });
}

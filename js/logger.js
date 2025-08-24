// logger.js
/**
 * Simple logger with levels and safe guards for production.
 * Logs are also appended to an in-memory store for display if desired.
 * @module logger
 */

/** @typedef {'debug'|'info'|'error'|'silent'} Level */
const levels = ['debug','info','error','silent'];
let currentLevelIndex = 1; // info

const store = []; // in-memory ring buffer
const MAX_STORE = 200;

function pushStore(entry){
  store.push({ ts: new Date().toISOString(), ...entry });
  if (store.length > MAX_STORE) store.shift();
}

export function setLevel(level){
  const idx = levels.indexOf(level);
  if (idx >= 0) currentLevelIndex = idx;
}

export function getLevel(){
  return levels[currentLevelIndex];
}

export function getLogs(){
  return [...store];
}

export function debug(msg, meta){
  if (currentLevelIndex <= 0) {
    console.debug('[DEBUG]', msg, meta || '');
    pushStore({ level:'debug', msg, meta });
  }
}

export function info(msg, meta){
  if (currentLevelIndex <= 1) {
    console.info('[INFO]', msg, meta || '');
    pushStore({ level:'info', msg, meta });
  }
}

export function error(msg, meta){
  if (currentLevelIndex <= 2) {
    console.error('[ERROR]', msg, meta || '');
    pushStore({ level:'error', msg, meta });
  }
}

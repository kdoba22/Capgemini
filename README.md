# Rewards Dashboard (Vanilla JS)

A small web app that calculates and displays reward points per customer based on the rules:

- 2 points for every dollar spent over $100 in each transaction
- 1 point for every dollar spent between $50 and $100 in each transaction
- Example: $120 → 2 × 20 + 1 × 50 = **90 points**
- Rewards accrue **per whole dollar** (cents are ignored). This is codified in `constants.js` via `FLOOR_TO_WHOLE_DOLLARS = true`.

## Features

- Vanilla JavaScript, ES Modules, no frameworks.
- Local JSON mock API (`public/data/transactions.json`) with 15+ customers.
- Simulated async API with latency & error handling.
- Customer directory with pagination.
- Filters: Month & Year (defaults to the **current month** and "last 3 months" tiles for quick selection).
- For the selected customer:
  - Reward points per month (clickable tiles).
  - Total rewards for the year.
  - Transaction list for the selected month with reward **per transaction**.
- Logging utility with levels (`debug`, `info`, `error`, `silent`).
- JSDoc comments on modules and functions.
- Unit tests with Jest (positive & negative, whole & fractional amounts).

## Project Structure

```
rewards-app/
  index.html
  css/
    style.css
  js/
    api.js
    constants.js
    index.js
    logger.js
    rewards.js
    state.js
    ui.js
  public/
    data/transactions.json
  tests/
    rewards.test.js
  package.json
  README.md
```

## Run the app locally

1. Open this folder in a terminal.
2. Use any static server (pick one):
   - Python 3: `python -m http.server 8080`
   - Node: `npx http-server -p 8080`
   - VS Code Live Server extension. Install the extension "Live Server" by Ritwick Dey. Click on index.html -> Open wiht 'Live Server'
3. Visit `http://localhost:8080`

> The app uses `fetch('./public/data/transactions.json')`, so it must be served via a local server, not directly opened as a `file://` path.

## Run tests

```
npm i
npm test
```

- Tests cover whole-dollar and fractional amounts.
- Jest config is in `package.json`.

## Approach

- All static values live in `constants.js` (no hard-coded magic numbers).
- Calculation is isolated in `rewards.js` (`calcPoints`) for testability.
- UI is split into small render functions and a thin global `state` object.
- Guarded against null/undefined and invalid dates.
- Logging is centralized (`logger.js`). Set the level in `constants.js`.

## Screenshots

- See README in repository for pasted images, or run locally and explore.

# Copilot / AI Agent Instructions

Short, actionable notes to help an AI coding agent be productive in this repo.

## Purpose & Big Picture
- This is a small Express.js + EJS app that uses PostgreSQL for persistence.
- Entry point: `server.js` — sets middleware order, view engine, routes, and error handler.
- Routes live in `routes/` and map to controller functions in `controllers/` which call `models/` for DB access.
- Utilities that generate shared HTML and middleware live in `utilities/index.js` (e.g., `getNav`, `handleErrors`, `checkJWTToken`).

## Dev / Run Commands
- Install dependencies: `pnpm install` (project expects PNPM; README documents this).
- Start in dev (nodemon): `pnpm run dev` (runs `nodemon server.js`).
- Start production: `pnpm start` (runs `node server.js`).

Note: README mentions port 5500 but `server.js` defaults to port `10000`. Prefer the value in `server.js` (or override with `PORT` env var).

## Environment Variables (discoverable)
- `DATABASE_URL` — Postgres connection string (used by `database/index.js`).
- `NODE_ENV` — affects SSL behavior in `database/index.js` (uses SSL when `development`).
- `SESSION_SECRET` — session secret for `express-session` in `server.js`.
- `ACCESS_TOKEN_SECRET` — JWT secret used by `utilities/checkJWTToken`.
- `PORT`, `HOST` — server binding values (overrides defaults in `server.js`).

## Architecture & Patterns to Follow
- Route → Controller → Model pattern: controllers call model functions and then render EJS views. Example: `routes/inventoryRoute.js` → `controllers/invController.js` → `models/inventory-model.js`.
- Controllers prefer to assemble view-specific HTML via `utilities/*` (e.g., `buildClassificationGrid`, `buildInvDetail`) and then call `res.render` with `nav` and those fragments.
- Error handling: use `utilities.handleErrors(fn)` wrapper when using async controllers inside route definitions. The global error handler in `server.js` then renders `views/errors/error.ejs`.
- Authentication: JWT is stored in a cookie (`jwt`) and validated by `utilities.checkJWTToken`; many routes rely on `res.locals.loggedin` / `res.locals.account` being set by middleware in `server.js`.
- Session store: sessions are persisted to Postgres via `connect-pg-simple` (configured in `server.js` with the exported `pool`).

## Files & Locations worth referencing
- `server.js` — middleware order, session config, route mounting, error handler.
- `utilities/index.js` — shared helpers (`getNav`, `buildClassificationList`, `handleErrors`, `checkJWTToken`).
- `controllers/` — controller implementations (e.g., `invController.js`, `baseController.js`).
- `models/` — DB access functions (e.g., `inventory-model.js`, `account-model.js`).
- `database/index.js` — Postgres pool creation and export; note the `NODE_ENV` branching and SSL behavior.
- `views/` — EJS templates and partials; layout set in `server.js` via `express-ejs-layouts`.
- `database/*.sql` — schema and seed examples (`assignment2.sql`, `db-sql-code.sql`, `inventory-data.txt`).

## Conventions and gotchas (do not change unless asked)
- HTML for lists/grids is frequently generated inside utility functions (JS strings), not in the EJS templates. Follow existing string-building approach when adding similar features.
- Middleware ordering matters: parsers (body, cookie) → JWT check (`utilities.checkJWTToken`) → flash → global template variables. Insert middleware in the same relative position.
- `database/index.js` exports either a `Pool` or an object with a `query` method depending on `NODE_ENV`. When importing the pool elsewhere (e.g., `server.js` session store) the code expects `require('./database')` to work as a pool object.
- Many controllers expect `utilities.getNav()` to return a nav HTML string; preserve that API when refactoring.

## When modifying routes/controllers
- Prefer using `utilities.handleErrors(yourAsyncFn)` in route definitions, e.g., `app.get('/', utilities.handleErrors(baseController.buildHome));`.
- For DB work, follow the `models/*` pattern: keep SQL in the model and return rows/objects; controllers should not run raw SQL.

## Merging guidance
- If updating this file, preserve the **Environment Variables** list and **Dev Commands**. If you find new global behavior (new env vars, new startup scripts), add them to these sections.

## Quick examples (copyable)
- Start dev server:
```bash
pnpm install
pnpm run dev
```
- Wrap an async controller in a route:
```js
const utilities = require('./utilities');
app.get('/', utilities.handleErrors(baseController.buildHome));
```

If anything is unclear or you want this doc to call out additional files or rules, tell me which areas to expand and I'll update it.

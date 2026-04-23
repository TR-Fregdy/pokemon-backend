# CLAUDE.md – AI Agent Guidance for `pokemon-backend`

This document provides targeted guidance for AI agents (such as Claude) working
in the `pokemon-backend` repository. It describes the language, runtime,
frameworks, conventions, and constraints that must be respected when generating
or modifying code.

---

## 1. Language & Runtime

- **Language:** JavaScript (CommonJS module system, `require` / `module.exports`).
- **Runtime:** Node.js **v18+** (as declared in the README prerequisites).
- **Package Manager:** npm (a `package.json` is present; there is no lockfile
  committed).
- **Execution Entry:** `server.js` (declared as `"main"` in `package.json`).

> Do **not** introduce ES Modules (`import` / `export`) unless the project is
> explicitly migrated. Stay with CommonJS.

## 2. Frameworks & Libraries

| Dependency | Version | Role |
|------------|---------|------|
| `express`  | ^4.18.2 | HTTP server & routing |
| `cors`     | ^2.8.5  | Cross-origin resource sharing middleware |
| `nodemon`  | ^3.0.1 (dev) | Hot reload during development |

There is **no database**, **no ORM**, and **no authentication** layer – data is
held in-memory in `server.js` as a `mockPokemons` array.

## 3. Architecture Pattern

- **Single-file Express server** – all routes, middleware, and data live in
  `server.js`.
- Stateless REST API returning JSON.
- No separation between controllers, services, routers, or data sources; this
  is intentional for the project's demo scope.

## 4. API Surface (Do Not Break)

| Method | Path                 | Purpose                            |
|--------|----------------------|------------------------------------|
| GET    | `/health`            | Liveness probe                     |
| GET    | `/api/pokemons`      | List + filter (name, type, legendary) |
| GET    | `/api/pokemons/:id`  | Lookup by numeric id               |
| GET    | `/api/types`         | Distinct list of all types         |

Response envelope for collection / item endpoints:

```json
{ "success": true, "count": 0, "data": [] }
```

Error envelope:

```json
{ "success": false, "message": "..." }
```

Preserve this envelope shape – the companion `pokemon-frontend` relies on
`response.data` being the actual payload.

## 5. Conventions & Constraints

- **Port:** Read from `process.env.PORT`, default `3001`. Any change must keep
  the default in sync with `pokemon-frontend`'s `proxy` and
  `REACT_APP_API_URL`.
- **Filtering semantics:**
  - `name` → case-insensitive *substring* match.
  - `type` → case-insensitive *exact* match against any entry in the type array.
  - `legendary` → strict `true` / `false` string coerced to boolean.
- **CORS:** `cors()` is applied globally with default settings (all origins).
  Keep this permissive until explicit security work is requested.
- **No file I/O:** The mock data set is hard-coded; do not introduce a database
  or external fetch without an explicit request.
- **Logging:** Only `console.log` on server start. Do not add a logging library
  unless requested.

## 6. Testing

No test harness is configured. If tests are added, prefer Jest (already
available in the React ecosystem used by the companion frontend).

## 7. Docker

A Dockerfile is referenced in the README but not committed in this snapshot.
If regenerating Docker assets, ensure they:

- Expose `3001`.
- Define a `HEALTHCHECK` hitting `/health`.
- Run `node server.js` as the entrypoint.

## 8. Safe-Generation Checklist

When producing code for this repository:

1. Keep CommonJS (`require`) syntax.
2. Preserve the API response envelope (`success`, `count`, `data`).
3. Keep filter semantics identical between the backend and frontend `App.js`
   mirror implementation.
4. Do not introduce new runtime dependencies without updating `package.json`.
5. Do not rename or relocate `server.js` – it is the declared entry point.

## 9. Related Documents

- Human-facing overview → [`README.md`](./README.md)
- System design & data flow → [`ARCHITECTURE.md`](./ARCHITECTURE.md)

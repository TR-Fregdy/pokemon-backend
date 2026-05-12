# CLAUDE.md — Pokemon Backend AI Agent Guidance

This document gives AI agents the context required to reason about and safely modify the `pokemon-backend` repository.

## Language & Runtime

- **Language:** JavaScript (Node.js, CommonJS modules)
- **Runtime:** Node.js v18 or later
- **Package manager:** npm

## Frameworks & Major Libraries

| Dependency | Version | Purpose |
| ---------- | ------- | ------- |
| `express`  | ^4.18.2 | HTTP server framework that exposes the REST API |
| `cors`     | ^2.8.5  | Cross-Origin Resource Sharing middleware (enables the React frontend on a separate origin to call the API) |
| `nodemon`  | ^3.0.1 (dev) | Auto-restarts the server on file changes during development |

## Architecture Pattern

- **Single-file Express REST API** that serves Pokemon data from an in-memory array (`mockPokemons`).
- **Stateless:** no database, no session state, no authentication.
- **Layering:** the entire request lifecycle (route handler → filtering → JSON response) lives inline in `server.js`. There is no controller/service/repository separation.

## File Map

| Path | Role |
| ---- | ---- |
| `server.js`     | Application entry point. Defines Express middleware, the mock Pokemon dataset, and the four route handlers. |
| `package.json`  | Dependency manifest and npm scripts (`start`, `dev`, `docker:build`, `docker:run`). |
| `.gitignore`    | Excludes `node_modules`, environment files, and editor metadata. |
| `README.md`     | Human-facing project documentation. |
| `ARCHITECTURE.md` | High-level architectural overview. |

## API Surface

All routes return JSON.

| Method | Path                  | Description |
| ------ | --------------------- | ----------- |
| GET    | `/health`             | Liveness probe — `{ status: 'OK', message: '...' }` |
| GET    | `/api/pokemons`       | List with optional `name`, `type`, `legendary` query filters |
| GET    | `/api/pokemons/:id`   | Fetch a single Pokemon by numeric ID (404 if missing) |
| GET    | `/api/types`          | Distinct list of types, sorted alphabetically |

Response envelope for list/detail endpoints:

```json
{ "success": true, "count": <number>, "data": <array|object> }
```

Error envelope:

```json
{ "success": false, "message": "<reason>" }
```

## Conventions & Constraints

- **In-memory data only.** Do not introduce a database layer without an explicit request.
- **String matching:** `name` filter is a case-insensitive partial match; `type` filter is a case-insensitive exact match against any of the Pokemon's types.
- **Boolean filter:** `legendary` is parsed from the literal string `'true'` (anything else, including `'false'`, is interpreted as `false`).
- **CORS** is enabled globally with default permissive settings. Restrict origins only when explicitly requested.
- **Port:** defaults to `3001`, overridable via `process.env.PORT`.
- **No build step:** the server runs the source directly with `node server.js`.
- **No tests** are currently defined. If adding test coverage, prefer `jest` or `supertest` and keep the in-memory data fixture intact.

## Safe Code-Generation Notes

- New routes must follow the `{ success, data }` / `{ success, message }` envelope.
- Keep handlers synchronous and side-effect free — there is no async I/O today.
- Preserve filter semantics in `/api/pokemons` so the frontend (`pokemon-frontend`) continues to render correctly.
- The schema of each Pokemon object is: `{ id: number, name: string, type: string[], legendary: boolean, image: string }`. The frontend reads every field, so adding or renaming fields requires a coordinated change in `pokemon-frontend/src`.
- Stick to CommonJS (`require` / `module.exports`). Do not switch to ESM without updating `package.json` (`"type": "module"`).

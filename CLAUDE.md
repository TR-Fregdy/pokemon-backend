# CLAUDE.md — AI Agent Guidance (pokemon-backend)

This document provides guidance to AI coding agents reasoning about or generating
code for the `pokemon-backend` repository. Read this file before making any
automated modifications so that your output remains compatible with the
existing conventions, runtime assumptions, and architectural style.

---

## 1. Project Identity

- **Repository**: `TR-Fregdy/pokemon-backend`
- **Type**: HTTP REST API service (server-side)
- **Purpose**: Serve a small, in-memory catalog of Pokemon data with
  filtering endpoints consumed by the companion `pokemon-frontend` React
  single-page application.

## 2. Languages & Runtime

| Aspect            | Value                                  |
| ----------------- | -------------------------------------- |
| Language          | JavaScript (CommonJS)                  |
| Node.js Version   | **18.x** (aligned with `node:18-alpine` Docker base) |
| Package Manager   | npm                                    |
| Module System     | CommonJS (`require` / `module.exports`) |

Use CommonJS `require` statements — do NOT introduce ESM `import` syntax
unless the module system is migrated first (this would require
adding `"type": "module"` to `package.json`).

## 3. Frameworks & Major Libraries

| Package   | Version    | Purpose                          |
| --------- | ---------- | -------------------------------- |
| express   | ^4.18.2    | HTTP routing & middleware        |
| cors      | ^2.8.5     | Cross-origin resource sharing    |
| nodemon   | ^3.0.1 (dev) | Auto-reload during development |

No database driver, ORM, test framework, or linter is currently installed.
If adding one, update `package.json` and document it here.

## 4. Architecture Pattern

- **Single-file Express API** — all routes, middleware, and mock data live
  in `server.js`. No layered controllers/services/repositories split yet.
- **Stateless** — the process holds an immutable in-memory `mockPokemons`
  array; no persistence.
- **CORS-open** — `app.use(cors())` allows any origin. Do not restrict
  unless required by a task.

## 5. API Surface (stable contract)

| Method | Path                  | Notes                                         |
| ------ | --------------------- | --------------------------------------------- |
| GET    | `/health`             | Liveness probe. Returns `{status, message}`.  |
| GET    | `/api/pokemons`       | Supports `name`, `type`, `legendary` query params. |
| GET    | `/api/pokemons/:id`   | 404 on unknown id.                            |
| GET    | `/api/types`          | Distinct, alphabetically sorted type list.    |

Response envelope for successful `/api/*` responses:

```json
{ "success": true, "count": <n>, "data": <payload> }
```

Error envelope:

```json
{ "success": false, "message": "<reason>" }
```

**Do not break this envelope** — the frontend (`App.js`) reads
`response.data` and `response.data.data` directly.

## 6. Data Shape

Each Pokemon object is:

```js
{
  id: Number,          // unique
  name: String,
  type: String[],      // 1..n elemental types, PascalCase ("Fire", "Flying")
  legendary: Boolean,
  image: String        // absolute sprite URL
}
```

When adding new mock entries, preserve this schema exactly.

## 7. Conventions & Constraints

- **Port**: `process.env.PORT || 3001`. Keep `3001` as the default —
  the frontend assumes it.
- **No authentication** on any endpoint. Do not add auth unless the task
  explicitly requires it.
- **Case-insensitive string matching** is used for `name` and `type`
  filters. Keep this behavior when extending filter logic.
- **The `legendary` query parameter** is a string, compared via
  `legendary === 'true'`. Preserve this coercion when adding new boolean
  filters.
- **No automated tests** exist. If you add tests, prefer `node:test` or
  `jest` and wire them into `npm test`.

## 8. Deployment Notes

- Docker image: `node:18-alpine` base, exposes **3001**, has a
  `HEALTHCHECK` hitting `/health`.
- Compose file lives in `.tr-codegen/docker-compose.yml` (note: the
  `.tr-codegen/` folder is excluded from per-directory README generation
  because it is a hidden tooling folder).

## 9. Safe-Change Checklist for Agents

Before proposing changes, verify:

1. The JSON response envelope (`success`, `count`, `data`) is preserved.
2. The default port remains `3001`.
3. CommonJS syntax is used.
4. No secrets are committed — there are no credential files in this repo.
5. `package.json` is updated when dependencies change.
6. README.md is **not** modified automatically (policy: skip-existing).

## 10. Related Documents

- [README.md](./README.md) — human-facing usage & setup.
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system-level design overview.

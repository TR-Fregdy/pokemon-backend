# ARCHITECTURE.md — pokemon-backend

High-level architectural overview of the Pokemon Backend service.

---

## 1. Purpose

`pokemon-backend` is a lightweight Node.js HTTP API that serves and
filters a static Pokemon catalog. It is intentionally minimal — no
database, no authentication, no persistence — because its only
responsibility is to feed the companion `pokemon-frontend` React
application with JSON data during development and demos.

## 2. Technology Stack

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| Runtime    | Node.js 18 (alpine base in Docker) |
| Framework  | Express 4                          |
| Middleware | `cors`, `express.json()`           |
| Dev Tools  | nodemon                            |
| Packaging  | Docker (`.tr-codegen/Dockerfile`), Docker Compose (`.tr-codegen/docker-compose.yml`) |

## 3. High-Level System Diagram

```
 ┌──────────────────────┐      HTTP / JSON      ┌────────────────────────┐
 │   pokemon-frontend   │ ────────────────────▶ │   pokemon-backend      │
 │   (React SPA, :3000) │    CORS enabled       │   Express API (:3001)  │
 └──────────────────────┘ ◀──────────────────── └──────────┬─────────────┘
                                                           │
                                                           │ reads
                                                           ▼
                                                ┌──────────────────────┐
                                                │  In-memory dataset    │
                                                │  `mockPokemons[]`     │
                                                └──────────────────────┘
```

## 4. Major Components

### 4.1 Express Application (`server.js`)
- Single entry point and single module file.
- Wires middleware (`cors`, `express.json`) and registers four routes:
  `/health`, `/api/pokemons`, `/api/pokemons/:id`, `/api/types`.
- Boots on `process.env.PORT || 3001`.

### 4.2 Static Dataset
- Hard-coded `mockPokemons` array with 12 entries (7 regular + 5 legendary).
- Treated as read-only; never mutated by handlers (filter operations use
  spread copies).

### 4.3 Route Handlers
| Handler                 | Responsibility                                      |
| ----------------------- | --------------------------------------------------- |
| `GET /health`           | Liveness probe (used by Docker HEALTHCHECK).        |
| `GET /api/pokemons`     | Filter dataset by `name`, `type`, `legendary`.      |
| `GET /api/pokemons/:id` | Single-resource lookup; 404 on miss.                |
| `GET /api/types`        | Derives the sorted list of distinct types.          |

## 5. Request Lifecycle

```
Client (frontend/curl)
   │
   │  GET /api/pokemons?type=Fire&legendary=false
   ▼
cors middleware  ──▶  express.json middleware
   │
   ▼
Route matcher: app.get('/api/pokemons', handler)
   │
   ▼
Handler
   ├─ copies mockPokemons  (defensive spread)
   ├─ applies name  filter (case-insensitive substring)
   ├─ applies type  filter (case-insensitive any-of)
   ├─ applies legendary filter (string → boolean coercion)
   └─ res.json({ success: true, count, data })
   │
   ▼
Client receives JSON envelope
```

## 6. Data Flow

1. **Startup**: `mockPokemons` loaded into memory at module import.
2. **Per-request**: handler copies, filters, returns — no shared mutable
   state, so concurrent requests are safe.
3. **Shutdown**: no cleanup required (pure in-memory).

## 7. Key Design Decisions

- **Stateless + in-memory** — keeps the demo trivial to deploy and
  reason about. Cost: the dataset is fixed and bounded.
- **Uniform JSON envelope** — every successful `/api/*` response is
  `{success, count?, data}`. Callers write a single unwrap path.
- **Permissive CORS** — `cors()` with defaults; acceptable because the
  service exposes no mutating endpoints and no authenticated data.
- **Case-insensitive filtering** — improves UX for the simple search
  box in the frontend without requiring a full-text index.
- **Separation of presentation and data** — the API never returns HTML;
  it is strictly a data provider. The React frontend owns all rendering.

## 8. Module / Dependency Graph

```
server.js
  ├── express   (routing, middleware)
  └── cors      (CORS headers)
```

There are no internal modules other than `server.js`; all logic fits in
a single file.

## 9. Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Docker container (node:18-alpine)                            │
│                                                              │
│   WORKDIR /app                                               │
│   ├── package.json                                           │
│   └── server.js                                              │
│                                                              │
│   EXPOSE 3001                                                │
│   HEALTHCHECK → curl http://localhost:3001/health            │
└──────────────────────────────────────────────────────────────┘
```

Compose (`.tr-codegen/docker-compose.yml`) wires the service on
`localhost:3001` for local full-stack development alongside the
frontend.

## 10. External Integrations

- **Pokemon sprites** — each `image` field is a remote URL on
  `raw.githubusercontent.com/PokeAPI/sprites`. The backend itself never
  fetches these; the browser does.

## 11. Future Extensions (non-binding notes)

Potential directions if the project grows:
- Replace `mockPokemons` with a database (Postgres / SQLite) behind a
  repository module.
- Split `server.js` into `routes/`, `controllers/`, `services/`.
- Add request validation (e.g. `zod`, `joi`) on query params.
- Introduce tests (`jest` or `node:test`) and CI.

## 12. Related Docs

- [README.md](./README.md) — user-facing setup & usage.
- [CLAUDE.md](./CLAUDE.md) — AI-agent constraints & conventions.

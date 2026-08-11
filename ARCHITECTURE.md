# Architecture – `pokemon-backend`

High-level, conceptual view of the Pokemon backend service. Pair this with
[`README.md`](./README.md) (operator focus) and [`CLAUDE.md`](./CLAUDE.md)
(AI-agent focus).

---

## 1. Overview

The backend is a minimal **Node.js / Express REST API** that serves static
(in-memory) Pokemon data to the `pokemon-frontend` React client. It follows a
**single-tier, stateless** pattern – no database, no persistence, no auth.

The service is designed as a reference / demo API; every request is resolved
by filtering an in-process JavaScript array.

## 2. Major Components

| Component         | Location     | Responsibility                                   |
|-------------------|--------------|--------------------------------------------------|
| HTTP Server       | `server.js`  | Bootstraps Express, binds to `PORT`, logs start  |
| Middleware Stack  | `server.js`  | `cors()` and `express.json()` body parsing       |
| Route Handlers    | `server.js`  | `/health`, `/api/pokemons`, `/api/pokemons/:id`, `/api/types` |
| Mock Data Store   | `server.js`  | `mockPokemons` array of 12 Pokemon records       |

Everything lives in `server.js`; there is intentionally no MVC split.

## 3. Data Model

```text
Pokemon {
  id:        number        // unique
  name:      string
  type:      string[]      // 1..2 elemental types
  legendary: boolean
  image:     string (URL)  // sprite hosted on PokeAPI CDN
}
```

The dataset is a constant array of 12 entries covering Gen-1 favourites
(Pikachu, Charizard, Blastoise, Venusaur, Mewtwo, Mew, Articuno, Zapdos,
Moltres, Gyarados, Dragonite, Alakazam).

## 4. Request Lifecycle

```text
Client (browser / curl)
      │
      ▼
 Express app
      │  1. cors() adds permissive CORS headers
      │  2. express.json() parses JSON body (if any)
      │
      ▼
 Route matcher
      │   /health               → respond { status: "OK" }
      │   /api/pokemons         → filter mockPokemons by query string
      │   /api/pokemons/:id     → find by numeric id; 404 if missing
      │   /api/types            → derive distinct types from dataset
      │
      ▼
 JSON response { success, count?, data?, message? }
```

### Query semantics on `/api/pokemons`

| Param        | Matching rule                                  |
|--------------|------------------------------------------------|
| `name`       | Case-insensitive `String.includes`             |
| `type`       | Case-insensitive exact match against any type  |
| `legendary`  | `"true"` / `"false"` coerced to boolean        |

Filters are composable; all three can be combined.

## 5. Key Architectural Decisions

1. **In-memory data** – removes database complexity; suitable for demos.
2. **Single-file server** – maximises readability for small scope.
3. **Envelope response** – `{ success, count, data }` gives the client a
   uniform shape and leaves room to grow (pagination, messages).
4. **Permissive CORS** – simplifies local development against the React
   frontend at `http://localhost:3000`.
5. **No auth** – intentional for the demo; add JWT / session middleware only
   when explicitly requested.

## 6. Inter-Module Dependencies

```text
 pokemon-frontend (React)           pokemon-backend (this repo)
 ─────────────────────────           ───────────────────────────
   src/App.js ─ fetch ──▶  HTTP  ─▶  GET /api/pokemons
                                  ─▶  GET /api/types
                                  ─▶  GET /api/pokemons/:id
```

The two repositories form a loosely coupled client/server pair connected by
HTTP on `localhost:3001` (or whatever `REACT_APP_API_URL` points to).

## 7. Deployment Topology

```text
┌──────────────────┐    HTTP (3000)   ┌──────────────────┐   HTTP (3001)
│  Browser client  │ ───────────────▶ │ pokemon-frontend │ ──────────────┐
└──────────────────┘                  │   (Nginx/CRA)    │               │
                                      └──────────────────┘               ▼
                                                              ┌──────────────────┐
                                                              │ pokemon-backend  │
                                                              │ (Node/Express)   │
                                                              └──────────────────┘
                                                                       │
                                                                       ▼
                                                              In-memory mock data
```

In development, Create React App's `proxy` field forwards `/api/*` requests
from `:3000` to `:3001` so the same-origin browser can call the API.

## 8. Environment Variables

| Variable   | Default | Purpose                    |
|------------|---------|----------------------------|
| `PORT`     | `3001`  | HTTP listen port           |
| `NODE_ENV` | —       | Node convention; unused in code today |

## 9. Future Evolution (Non-Binding)

- Swap `mockPokemons` for a real database or the public PokeAPI.
- Split `server.js` into `routes/`, `controllers/`, `services/` once it
  crosses ~300 lines.
- Add Jest tests for the filter logic.
- Harden CORS with an allow-list when deployed to production.

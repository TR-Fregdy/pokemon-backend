# Architecture — Pokemon Backend

## Overview

`pokemon-backend` is a minimal stateless REST API built with Node.js and Express. It serves a fixed in-memory collection of twelve Pokemon and supports server-side filtering by name, type, and legendary status. The service is consumed by the `pokemon-frontend` React application.

## Design Goals

- **Simplicity:** a single file (`server.js`) holds every concern (data, routes, filtering, bootstrap).
- **Statelessness:** the API can be horizontally scaled or restarted without coordination.
- **Frontend-friendly:** CORS is permissive and responses are wrapped in a predictable envelope so the React client can branch on `success`.

## Major Components

```
┌────────────────────────────────────────────────────────────┐
│                        server.js                           │
│                                                            │
│  ┌──────────────────┐   ┌─────────────────────────────┐   │
│  │  Express App     │   │  Mock Data (mockPokemons)   │   │
│  │  + cors()        │   │  12 immutable Pokemon objs  │   │
│  │  + express.json()│   └────────────┬────────────────┘   │
│  └────────┬─────────┘                │                    │
│           │                          │                    │
│           ▼                          │                    │
│  ┌───────────────────────────────────▼──────────────┐    │
│  │  Route Handlers                                   │    │
│  │   • GET /health                                   │    │
│  │   • GET /api/pokemons      (filter pipeline)      │    │
│  │   • GET /api/pokemons/:id  (lookup by id)         │    │
│  │   • GET /api/types         (distinct types)       │    │
│  └───────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼ JSON
                ┌──────────────────────────┐
                │   pokemon-frontend       │
                │   (React, port 3000)     │
                └──────────────────────────┘
```

## Request Lifecycle

1. The HTTP request arrives at the Express server listening on `PORT` (default `3001`).
2. `cors()` adds permissive `Access-Control-Allow-*` headers.
3. `express.json()` parses any JSON body (unused by current GET endpoints, but kept for future POST routes).
4. The matching route handler runs synchronously:
   - For `/api/pokemons`, the handler clones `mockPokemons` and applies up to three filters in sequence:
     1. `name` — `String.prototype.includes` on lower-cased values
     2. `type` — exact match (case-insensitive) against any element of the Pokemon's `type` array
     3. `legendary` — boolean compare after parsing `'true'`/`'false'`
   - For `/api/pokemons/:id`, the handler parses the path parameter to an integer and uses `Array.prototype.find`. Missing IDs respond with HTTP 404.
   - For `/api/types`, the handler flattens every Pokemon's `type` array, de-duplicates with a `Set`, and sorts alphabetically.
5. The response is wrapped in `{ success, count?, data }` (or `{ success: false, message }` on failure) and returned with `res.json`.

## Data Model

```ts
type Pokemon = {
  id: number;        // unique
  name: string;
  type: string[];    // 1..2 elemental types
  legendary: boolean;
  image: string;     // remote sprite URL
};
```

The dataset is hard-coded with twelve entries and never mutated.

## Key Decisions

- **In-memory data instead of a database.** Keeps the project self-contained and fast to spin up; trades durability and write support that the use case does not need.
- **Server-side and client-side filtering both supported.** The frontend already replays the same filter logic locally (`pokemon-frontend/src/App.js`). Either the backend filter (query params) or the frontend filter can drive the UI.
- **Permissive CORS.** Simplifies local development across ports `3000` and `3001`.
- **No authentication.** This service is intentionally public read-only mock data.

## External Dependencies

- `express` — HTTP routing and middleware
- `cors` — CORS headers
- `nodemon` (dev only) — file-watching auto-restart

## Cross-Repository Coupling

| Producer (this repo)            | Consumer (`pokemon-frontend`)                              |
| ------------------------------- | ---------------------------------------------------------- |
| `/api/pokemons` response shape  | `App.js` reads `data` and feeds `PokemonCard`              |
| `/api/types` response shape     | `App.js` populates the `<select>` in `FilterBar`           |
| Pokemon object schema           | `PokemonCard.js` consumes every field directly             |
| Query-param contract            | `App.js` filters locally with the same semantics           |

Any schema or response-envelope change must be coordinated with `pokemon-frontend/src/App.js` and `pokemon-frontend/src/components/PokemonCard.js`.

## Deployment

- **Local dev:** `npm run dev` (nodemon-watched).
- **Production-style:** `npm start`.
- **Container:** A `Dockerfile` and `docker-compose.yml` are staged under `.tr-codegen/` for the build pipeline; the README documents `docker:build` / `docker:run` scripts.
- **Environment variables:** `PORT` (port to bind), `NODE_ENV` (informational only — no code branches on it).

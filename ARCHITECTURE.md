# Architecture - Pokemon Backend API

## Overall Architecture

The Pokemon Backend is a **monolithic Node.js/Express REST API** that serves Pokemon data from an in-memory mock data store. It follows a simple, single-file architecture where all application logic resides in `server.js`.

```
┌──────────────────────────────────────────────────────────┐
│                     server.js                            │
│                                                          │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │   Middleware    │  │  Route       │  │  Mock Data  │  │
│  │  - CORS        │──│  Handlers    │──│  Store      │  │
│  │  - JSON Parser │  │  - /health   │  │  (12 items) │  │
│  └────────────────┘  │  - /api/*    │  └─────────────┘  │
│                      └──────────────┘                    │
└──────────────────────────────────────────────────────────┘
```

## Major Components

### 1. Express Application (`server.js`)

The single source file contains all application logic:

| Component | Lines | Responsibility |
|-----------|-------|---------------|
| App Setup | 1-9 | Express initialization, middleware registration |
| Mock Data | 12-97 | Hardcoded array of 12 Pokemon objects |
| Route Handlers | 99-162 | Four GET endpoint handlers |
| Server Startup | 164-166 | Listen on configured port |

### 2. Middleware Stack

Middleware is applied globally in this order:

```
Request → CORS → JSON Parser → Route Handler → Response
```

- **CORS**: Enables cross-origin requests from the frontend (any origin)
- **JSON Parser**: Parses incoming JSON request bodies via `express.json()`

### 3. Mock Data Store

An in-memory JavaScript array (`mockPokemons`) containing 12 Pokemon entries. Data is:
- **Immutable** at runtime (no write operations)
- **Copied** per request via spread operator (`[...mockPokemons]`) before filtering
- **Stateless** - no side effects between requests

### 4. Docker Configuration (`.tr-codegen/`)

Deployment files for containerized execution:
- `Dockerfile` - Node 18 Alpine image with health checks
- `docker-compose.yml` - Service orchestration with networking

## Data Flow & Request Lifecycle

### Typical Request: `GET /api/pokemons?type=fire&legendary=false`

```
Client Request
     │
     ▼
┌─────────────┐
│ CORS Check   │ ← Allows all origins
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ JSON Parser  │ ← Parse body (if any)
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ Route: /api/pokemons    │
│                         │
│ 1. Copy mock data array │
│ 2. Apply name filter    │ ← if ?name= present
│ 3. Apply type filter    │ ← if ?type= present (case-insensitive)
│ 4. Apply legendary      │ ← if ?legendary= present
│    filter               │
│ 5. Return JSON response │
└─────────────┬───────────┘
              │
              ▼
         JSON Response
  { success, count, data }
```

### Filter Pipeline Detail

```
mockPokemons (all 12)
     │
     ▼  name filter (String.includes, case-insensitive)
  filtered set
     │
     ▼  type filter (Array.some, exact match, case-insensitive)
  filtered set
     │
     ▼  legendary filter (boolean comparison)
  final result → response
```

## Key Architectural Decisions

### 1. Single-File Architecture
**Decision:** All code in one file (`server.js`)
**Rationale:** The application scope is small (4 endpoints, 12 data entries). A single file reduces complexity for a demo/prototype application.
**Trade-off:** Not suitable for scaling to many endpoints or complex business logic.

### 2. In-Memory Mock Data
**Decision:** No database; data hardcoded in source
**Rationale:** Eliminates external dependencies, simplifies setup, ensures deterministic behavior for testing and demos.
**Trade-off:** No persistence, no concurrent writes, data changes require code changes.

### 3. Client-Side Filtering Duplication
**Decision:** Backend provides server-side filtering, but the frontend also implements client-side filtering
**Rationale:** Both layers can filter independently. The frontend fetches all data once and filters locally for responsiveness.
**Trade-off:** Redundant logic, but enables offline-like filtering UX.

### 4. Stateless Request Handling
**Decision:** Each request gets a fresh copy of the data array
**Rationale:** No side effects between requests; safe for concurrent access.

### 5. Permissive CORS
**Decision:** CORS enabled for all origins
**Rationale:** Frontend may run on a different port/host during development. Simplifies cross-origin setup.
**Trade-off:** Should be restricted in production environments.

## Dependencies Between Modules

Since this is a single-file application, there are no internal module dependencies. External dependencies:

```
server.js
   ├── express (web framework)
   └── cors (CORS middleware)
```

## Integration Points

### Frontend Communication
- The frontend (`pokemon-frontend`) consumes the `/api/pokemons` and `/api/types` endpoints
- Communication is via standard HTTP GET requests with JSON responses
- Frontend expects `{ data: [...] }` response structure

### Docker Networking
- Backend runs on `pokemon-network` Docker bridge network
- Frontend's `docker-compose.yml` references this backend as a dependency
- Health check at `/health` is used for container readiness probes

```
┌──────────────────┐     HTTP (port 3001)     ┌──────────────────┐
│ Pokemon Frontend │ ──────────────────────── │ Pokemon Backend  │
│  (React SPA)     │     GET /api/pokemons    │  (Express API)   │
│  Port 3002/80    │     GET /api/types       │  Port 3001       │
└──────────────────┘                          └──────────────────┘
         │                                             │
         └──────── pokemon-network (Docker bridge) ────┘
```

## Areas for Improvement

### Architecture & Code Organization

- **Split single-file architecture**: Extract `server.js` into separate modules — routes, controllers, middleware, and data layers — to improve maintainability and testability as the application grows.
- **Add a service layer**: Introduce a service layer between route handlers and data access to separate business logic from HTTP concerns.

### Data & Persistence

- **Replace in-memory mock data with a database**: The hardcoded `mockPokemons` array does not support persistence, concurrent writes, or dynamic updates. Migrating to a database (e.g., PostgreSQL or MongoDB) would enable real CRUD operations.
- **Add pagination**: The `/api/pokemons` endpoint returns all matching records at once. Adding `limit` and `offset` query parameters would improve scalability when the dataset grows.

### Security

- **Restrict CORS origins**: `app.use(cors())` allows requests from any origin. In production, CORS should be configured to allow only trusted frontend origins.
- **Add authentication and authorization**: The API is completely open with no auth layer. Adding JWT-based authentication or API key validation would protect endpoints from unauthorized access.
- **Add rate limiting**: There is no rate limiting in place, leaving the API vulnerable to abuse or denial-of-service attacks. A middleware like `express-rate-limit` would mitigate this.

### Input Validation & Error Handling

- **Add request validation**: Query parameters and route parameters (e.g., `:id`) are used with minimal validation. A library like `express-validator` or `joi` could enforce expected types and formats.
- **Add centralized error handling middleware**: Currently, error responses are handled inline in each route. A global Express error-handling middleware would provide consistent error formatting and reduce code duplication.
- **Handle invalid `:id` parameter gracefully**: `parseInt(req.params.id)` silently returns `NaN` for non-numeric inputs, leading to a 404 rather than a 400 Bad Request.

### Testing

- **Add a test suite**: No tests exist. Unit tests for filter logic and integration tests for API endpoints (e.g., using Jest and Supertest) would catch regressions and increase confidence in changes.

### Observability

- **Add structured logging**: The only log output is the startup message via `console.log`. A structured logging library (e.g., `winston` or `pino`) would provide request logging, error tracking, and log levels for production debugging.
- **Add request logging middleware**: Logging each incoming request (method, path, status code, response time) would aid in monitoring and debugging.

### Documentation

- **Add OpenAPI/Swagger documentation**: Generating API documentation from an OpenAPI spec would make the API easier to discover and consume by frontend developers and third-party integrators.

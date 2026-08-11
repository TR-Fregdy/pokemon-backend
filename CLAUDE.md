# CLAUDE.md - AI Agent Guidance for Pokemon Backend

## Project Identity

- **Name:** pokemon-backend
- **Type:** REST API server
- **Version:** 1.0.0
- **License:** ISC

## Programming Languages & Versions

- **JavaScript (ES6+)** - Primary language
- **Node.js v18+** - Runtime environment
- CommonJS module system (`require`/`module.exports`)

## Frameworks & Major Libraries

| Library | Version | Role |
|---------|---------|------|
| Express.js | ^4.18.2 | HTTP server and routing framework |
| CORS | ^2.8.5 | Cross-Origin Resource Sharing middleware |
| Nodemon | ^3.0.1 | Development auto-restart (devDependency) |

## Architecture Pattern

- **Monolithic single-file architecture** - All code lives in `server.js`
- **RESTful API design** - Standard HTTP methods and status codes
- **In-memory data store** - No database; mock data array
- **Middleware pipeline** - Express middleware chain (CORS -> JSON parser -> routes)

## File Structure

```
server.js          # ONLY source file - contains everything:
                   #   - Express app initialization
                   #   - Middleware configuration
                   #   - Mock Pokemon data (12 entries)
                   #   - All route handlers (4 endpoints)
                   #   - Server startup
```

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check for container orchestration |
| GET | `/api/pokemons` | List/filter Pokemon (query params: name, type, legendary) |
| GET | `/api/pokemons/:id` | Get single Pokemon by numeric ID |
| GET | `/api/types` | Get sorted unique list of Pokemon types |

## Data Model

```javascript
// Pokemon object shape
{
  id: Number,           // Unique identifier (1-12)
  name: String,         // Pokemon name (e.g., "Pikachu")
  type: String[],       // Array of type names (e.g., ["Fire", "Flying"])
  legendary: Boolean,   // Whether the Pokemon is legendary
  image: String         // URL to PokeAPI sprite image
}
```

## Constraints & Conventions

1. **Read-only API** - No POST/PUT/DELETE endpoints; data is immutable mock data
2. **No database** - All data is hardcoded in `mockPokemons` array in server.js
3. **No authentication** - API is fully public with no auth layer
4. **CORS wide open** - `app.use(cors())` allows all origins
5. **Standard JSON responses** - All endpoints return `{ success: boolean, data/message, [count] }`
6. **Port 3001** - Default port; configurable via `PORT` env var
7. **No input validation** - Query params and route params used with minimal validation
8. **No test files** - No test suite exists

## Response Format Convention

```javascript
// Success response
{ success: true, data: <result>, count: <number> }

// Error response (404)
{ success: false, message: "Pokemon not found" }
```

## Filtering Logic

The `/api/pokemons` endpoint applies filters sequentially:
1. **Name filter** - `String.includes()` with `toLowerCase()` (partial, case-insensitive)
2. **Type filter** - `Array.some()` with `toLowerCase()` comparison (exact match, case-insensitive)
3. **Legendary filter** - String `"true"`/`"false"` converted to boolean comparison

## Deployment

- **Docker**: Node 18 Alpine base image, port 3001
- **Health check**: `GET /health` used by Docker for liveness probes
- **Docker Compose**: Service `main_app_pokemon-backend` on `pokemon-network`

## Code Generation Notes

- When adding new endpoints, follow the existing pattern in `server.js`
- All responses must include `success: boolean` field
- New data fields added to Pokemon objects must also be reflected in the mock data array
- The `mockPokemons` array is the single source of truth for all data
- If adding a database, the mock data array should be replaced with DB queries
- Express route handlers use `(req, res)` signature with `res.json()` for responses
- Error responses should use appropriate HTTP status codes (currently only 200 and 404 are used)

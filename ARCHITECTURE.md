# Pokemon Backend - Architecture Overview

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Pokemon Backend (Node.js)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Express Application Server                │   │
│  │  Port: 3001 (configurable via PORT env var)         │   │
│  └──────────────────────────────────────────────────────┘   │
│            ↓                                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │       Middleware Stack (CORS → JSON Parser)          │   │
│  │  ┌ CORS Middleware (allow all origins)            ┐  │   │
│  │  ├ express.json() (parse incoming requests)      ┤  │   │
│  │  └ Route Handlers (process HTTP requests)        ┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│            ↓                                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          API Route Handlers                           │   │
│  │  ┌ GET /health              (health check)       ┐  │   │
│  │  ├ GET /api/pokemons        (list with filters)  ┤  │   │
│  │  ├ GET /api/pokemons/:id    (get by ID)          ┤  │   │
│  │  └ GET /api/types           (unique types list)  ┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│            ↓                                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        In-Memory Data Processing                      │   │
│  │  ┌ Filter by Name (case-insensitive partial)     ┐  │   │
│  │  ├ Filter by Type (case-insensitive exact)       ┤  │   │
│  │  ├ Filter by Legendary (boolean)                 ┤  │   │
│  │  └ Extract unique types and sort                 ┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│            ↓                                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Mock Pokemon Data (12 Pokemon)                 │   │
│  │  ┌ 7 Regular Pokemon (Pikachu, Charizard, ...)   ┐  │   │
│  │  ├ 5 Legendary Pokemon (Mewtwo, Mew, Birds)      ┤  │   │
│  │  ├ Each with: id, name, type[], legendary, image ┤  │   │
│  │  └ Data hardcoded in server.js (lines 12-97)     ┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
           ↑                              ↑
           │ HTTP Requests               │ JSON Responses
           │                              │
  ┌────────┴──────────────┐   ┌──────────┴───────────────┐
  │  Pokemon Frontend      │   │   Client Applications    │
  │  (React, Port 3000)    │   │   (Test Tools, etc.)     │
  └───────────────────────┘   └──────────────────────────┘
```

## Request-Response Lifecycle

### 1. Client Request
A client (Frontend, API tester, etc.) makes an HTTP request to one of the four endpoints:
```
GET /health
GET /api/pokemons?name=pika&type=electric&legendary=false
GET /api/pokemons/25
GET /api/types
```

### 2. Server Reception & Middleware Processing
```
1. Express receives request
2. CORS middleware checks origin (allows all)
3. JSON middleware parses request body if needed
4. Route handler matches and executes
```

### 3. Data Processing for Filtering (Pokémons Endpoint)
```
1. Extract query parameters (name, type, legendary)
2. Create copy of mock data array
3. Apply filters sequentially:
   a. name filter: pokemon.name.toLowerCase().includes(name.toLowerCase())
   b. type filter: pokemon.type.some(t => t.toLowerCase() === type.toLowerCase())
   c. legendary filter: pokemon.legendary === (legendary === 'true')
4. Return filtered array with metadata
```

### 4. Response Generation
All successful responses follow consistent format:
```json
{
  "success": true,
  "count": <number>,        // For list endpoints
  "data": <data>           // Array or object depending on endpoint
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Component Breakdown

### Express Application (app)
- **Purpose**: HTTP server that listens for incoming requests
- **Configuration**: CORS and JSON middleware attached
- **Ports**: Configurable via `PORT` env var (default 3001)
- **Lifecycle**: Created at startup, listens continuously

### Mock Data Array
- **Structure**: Array of 12 Pokemon objects
- **Storage**: In-memory (RAM)
- **Persistence**: None - resets on server restart
- **Access Pattern**: Read-only for API consumers
- **Mutation**: Never modified after initialization

### Filtering Logic
- **Pattern**: Declarative query parameters → imperative in-memory filter → response
- **Efficiency**: O(n) for each filter (n = 12 Pokemon, negligible)
- **Composition**: Filters can be combined (AND logic between filters)
- **Edge Cases**: Handles empty results, case insensitivity, partial matching

### Response Handler
- **Responsibility**: Format filtered data and HTTP metadata
- **Consistency**: All endpoints follow same response structure
- **Error Handling**: Minimal - only 404 for missing Pokemon by ID

## Key Design Decisions

### 1. Single-File Architecture
- **Rationale**: Small, focused API doesn't need modularization
- **Trade-off**: Easy to understand but could become unmaintainable if scaled
- **Implication**: All developers working on same file

### 2. In-Memory Data Only
- **Rationale**: Simplicity, no database dependency, fast responses
- **Trade-off**: No persistence, doesn't scale to large datasets
- **Implication**: Perfect for demo/prototype, unsuitable for production with real data

### 3. CORS Open to All Origins
- **Rationale**: Simplifies development and testing
- **Trade-off**: Security risk in production
- **Implication**: Should be restricted in real deployment (whitelist frontend origin)

### 4. Case-Insensitive Filtering
- **Rationale**: Better UX - user doesn't need exact case
- **Trade-off**: Minimal performance impact (negligible for 12 Pokemon)
- **Implication**: Consistent, predictable filtering behavior

### 5. Query Parameter Validation Absent
- **Rationale**: Small dataset, simple filters
- **Trade-off**: Could accept invalid input without error
- **Implication**: Consider adding validation if extended with user input

## Data Flow Diagram

```
┌─────────────────┐
│  HTTP Request   │
│  (Query Params) │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Parse Query Parameters           │
│ - name                           │
│ - type                           │
│ - legendary                      │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Retrieve Mock Data Array         │
│ (12 Pokemon objects)             │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Apply Name Filter                │
│ (case-insensitive partial match) │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Apply Type Filter                │
│ (case-insensitive exact match)   │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Apply Legendary Filter           │
│ (boolean comparison)             │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Build Response Object            │
│ {success, count, data}           │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Send JSON Response (HTTP 200)    │
└─────────────────────────────────┘
```

## Dependencies Between Modules

**Single Module**:
- No internal module-to-module dependencies
- External dependencies:
  - `express`: Required for HTTP server
  - `cors`: Required for cross-origin requests
  - `nodemon` (dev-only): For development convenience

## Scalability Considerations

### Current Limitations
1. **Data Scale**: Fixed 12 Pokemon - cannot handle real Pokemon dataset
2. **Persistence**: In-memory only - no data survives restart
3. **Concurrency**: Single-threaded Node.js - fine for small load
4. **Geographic**: Single server instance - no distribution

### Path to Production
1. Replace mock data with database (MongoDB, PostgreSQL)
2. Add proper input validation and error handling
3. Implement authentication if needed
4. Restrict CORS to specific origins
5. Add logging and monitoring
6. Use clustering or load balancing for horizontal scaling

## Environment Configuration

| Variable | Purpose | Default | Example |
|----------|---------|---------|---------|
| `PORT` | Server listening port | 3001 | 8080 |
| `NODE_ENV` | Environment mode | development | production |

## Docker Integration

**Multi-Stage Not Used**: Dockerfile is simple single-stage for Node.js app

**Container Design**:
- Base: Node.js official image
- Runs: `npm start` (executes `node server.js`)
- Port: 3001 (exposed)
- Health Check: `/health` endpoint

**Deployment**:
```bash
docker build -t pokemon-backend .
docker run -p 3001:3001 -e PORT=3001 pokemon-backend
```

## Related Systems

### Pokemon Frontend (React)
- **Connection**: HTTP requests to this API
- **Endpoint**: `REACT_APP_API_URL` env var (default: http://localhost:3001)
- **Data Contract**: Expects JSON responses in documented format
- **CORS Dependency**: Requires CORS middleware (currently enabled)

## Security Posture

**Current Issues**:
- CORS open to all origins ⚠️
- No input validation ⚠️
- No rate limiting ⚠️
- No authentication ⚠️

**Mitigations for Production**:
1. Restrict CORS to frontend origin only
2. Add input validation for query parameters
3. Implement rate limiting
4. Add request logging
5. Use HTTPS in production

## Testing Strategy

**Endpoints to Test**:
1. `/health` - Always returns 200 OK
2. `/api/pokemons` - All combinations of filters
3. `/api/pokemons/:id` - Valid ID (1-12) and invalid IDs
4. `/api/types` - Returns sorted unique types

**Edge Cases**:
- No parameters (return all)
- Non-existent Pokemon ID
- Empty filter results
- Case variations in filters
- Combined filters (multiple parameters)

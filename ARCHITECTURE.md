# Pokemon Backend - Architecture Overview

## System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Frontend (React)                       │
│              Running on http://localhost:3000             │
└────────────────────────┬─────────────────────────────────┘
                         │
                    HTTP Requests
                  (CORS-enabled)
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                  Express.js Server                        │
│              Running on http://localhost:3001             │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐ │
│  │            Request Processing Pipeline              │ │
│  │                                                     │ │
│  │  1. CORS Middleware                               │ │
│  │     - Allows cross-origin requests                │ │
│  │     - No origin restrictions                      │ │
│  │                                                     │ │
│  │  2. JSON Body Parser Middleware                   │ │
│  │     - Parses application/json                     │ │
│  │     - Prepares request context                    │ │
│  │                                                     │ │
│  │  3. Route Handler Matching                        │ │
│  │     ├─ GET /health         → Health Check        │ │
│  │     ├─ GET /api/pokemons   → List & Filter       │ │
│  │     ├─ GET /api/pokemons/:id → Detail            │ │
│  │     └─ GET /api/types      → Type List           │ │
│  │                                                     │ │
│  │  4. Response Generation                           │ │
│  │     - JSON response with appropriate status code  │ │
│  │     - Standard response format (success + data)   │ │
│  └─────────────────────────────────────────────────────┘ │
│                         │                                  │
│  ┌─────────────────────▼──────────────────────────────┐ │
│  │         In-Memory Data Layer                       │ │
│  │                                                     │ │
│  │  mockPokemons = [                                 │ │
│  │    { id, name, type[], legendary, image },        │ │
│  │    ... (12 Pokemon total)                         │ │
│  │  ]                                                 │ │
│  │                                                     │ │
│  │  Filtering Operations (O(n) linear):             │ │
│  │  ├─ name filter (substring match)                │ │
│  │  ├─ type filter (exact match)                    │ │
│  │  └─ legendary filter (boolean)                   │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
                         │
                    JSON Responses
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                    Frontend (React)                       │
│           Displays Pokemon in Grid/Cards                  │
└──────────────────────────────────────────────────────────┘
```

## Request Lifecycle

### 1. Client Initiates Request
```
Frontend → GET /api/pokemons?name=pika&type=electric
```

### 2. Server Receives & Processes
```
Express.js
├─ CORS Middleware (Allow)
├─ JSON Parser (N/A for GET)
├─ Route Handler Identified (/api/pokemons)
├─ Query Parameters Extracted: {name: 'pika', type: 'electric'}
```

### 3. Filtering Applied
```
Step 1: Load all Pokemon from mockPokemons
        [Pikachu, Charizard, Blastoise, ..., Alakazam] (12 total)

Step 2: Filter by name (case-insensitive substring)
        Condition: pokemon.name.toLowerCase().includes('pika'.toLowerCase())
        Result: [Pikachu] (1 Pokemon)

Step 3: Filter by type (case-insensitive exact match on any type)
        Condition: pokemon.type.some(t => t.toLowerCase() === 'electric'.toLowerCase())
        Result: [Pikachu] (1 Pokemon matches both filters)

Step 4: Filter by legendary (if provided)
        Not provided in this example, so skip
```

### 4. Response Generated
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "name": "Pikachu",
      "type": ["Electric"],
      "legendary": false,
      "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
    }
  ]
}
```

### 5. Response Sent to Client
```
200 OK + JSON Response Body
```

## Data Flow

### Initial Load Flow
```
Frontend (App.js)
  └─ useEffect (on mount)
      ├─ Fetch /api/pokemons (GET all)
      ├─ Fetch /api/types (GET types)
      └─ Update state: pokemons[], types[], loading state
```

### Filtering Flow
```
Frontend (App.js)
  └─ User changes filter input
      ├─ FilterBar component updates state
      ├─ App receives new filters via handleFilterChange()
      ├─ React re-renders filtered list (client-side filtering)
      └─ PokemonCard components re-render with filtered data
```

## Component Responsibilities

### Express Server (server.js)
- **Role**: HTTP interface and data service
- **Responsibilities**:
  - Accept HTTP requests
  - Parse and validate query parameters
  - Apply filtering logic
  - Return JSON responses
  - Manage server lifecycle

### Middleware Stack
- **CORS**: Enable cross-origin requests from React frontend
- **JSON Parser**: Handle JSON request bodies (unused in current implementation)

### Route Handlers
1. **GET /health** - System health check
2. **GET /api/pokemons** - Pokemon listing with optional filtering
3. **GET /api/pokemons/:id** - Single Pokemon detail
4. **GET /api/types** - Available types list

### Data Store (mockPokemons)
- Stateless, in-memory array of Pokemon objects
- Sourced from PokeAPI sprite URLs
- 12 Pokemon (5 legendary, 7 regular)

## Key Architectural Decisions

### 1. Stateless Single-File Design
- **Decision**: All code in server.js
- **Rationale**: 
  - Simple, monolithic structure for lightweight API
  - No need for modularity at current scale
  - Easy to understand and maintain
  - Suitable for containerized deployment

### 2. In-Memory Mock Data
- **Decision**: No database, hardcoded mock data
- **Rationale**:
  - Eliminates database dependency
  - Faster development and testing
  - Sufficient for demo/prototype purposes
  - Data persistence not required

### 3. Client-Side Filtering (Hybrid)
- **Decision**: Server handles query filtering, frontend also applies filters
- **Rationale**:
  - Server supports filtering for API contract
  - Frontend refilters on client for real-time UX
  - Redundant filtering safe with small dataset
  - Allows independent evolution of components

### 4. No Request Validation
- **Decision**: Query parameters accepted as-is
- **Rationale**:
  - Small dataset (12 Pokemon)
  - No security risk from malformed queries
  - Filters simply return empty results if no match
  - Keeps API lightweight

### 5. Case-Insensitive Filtering
- **Decision**: All text searches are case-insensitive
- **Rationale**:
  - Better user experience (typing variations)
  - Type array has mixed-case values
  - Consistent with frontend behavior

## Scaling Considerations

### Current Limitations
- **Memory**: 12 Pokemon in-memory (trivial memory footprint)
- **CPU**: O(n) filtering per request (fine for 12 items)
- **Concurrency**: No built-in session management
- **Persistence**: Data lost on server restart
- **CORS**: Open to all origins (security concern)

### Scaling Path
If expanded beyond mock data:
1. **Add Database**: Replace mockPokemons with database query
2. **Add Caching**: Redis for type list, frequently filtered results
3. **Add Validation**: Input validation for security
4. **Add Pagination**: Limit result set size
5. **Add Authentication**: Protect sensitive endpoints
6. **Add Logging**: Structured logging for debugging
7. **Add Rate Limiting**: Prevent abuse

## Error Handling

### Current Approach
- **Health Endpoint**: Always returns 200 OK
- **Pokemon Listing**: Returns empty array if no matches
- **Pokemon Detail**: Returns 404 if ID not found
- **Invalid Routes**: Express default 404 handler

### Response Format
All successful responses:
```json
{ "success": true, "data": ..., "count": ... }
```

Error responses:
```json
{ "success": false, "message": "...", ... }
```

## External Dependencies

### Runtime Dependencies
- **express**: HTTP framework
- **cors**: CORS middleware

### Dev Dependencies
- **nodemon**: Development hot-reload

### External Data
- **PokeAPI**: Sprite images via raw.githubusercontent.com

## Deployment Model

### Docker Container
- **Base Image**: Node.js (from Dockerfile)
- **Port**: 3001 (exposed)
- **Health Check**: GET /health endpoint
- **Entry Point**: `node server.js`

### Environment
- **PORT**: Configurable via environment variable
- **NODE_ENV**: development/production mode

## Integration Points

### With Frontend
- **Protocol**: HTTP/REST
- **Format**: JSON
- **CORS**: Required (currently unrestricted)
- **Contract**: 
  - Endpoint paths: `/api/pokemons`, `/api/types`
  - Response structure: `{ success, data, count }`
  - Data structure: Pokemon objects with id, name, type[], legendary, image

### With Docker/Orchestration
- **Health Check**: GET /health
- **Port Binding**: 3001
- **Startup**: Logs message to stdout
- **Graceful Shutdown**: Express.js default handling

## Related Documentation
- See `README.md` for user-facing setup and API documentation
- See `CLAUDE.md` for AI-agent coding guidance

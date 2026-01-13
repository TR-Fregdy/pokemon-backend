# Architecture Overview - Pokemon Backend

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Pokemon Backend                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐     ┌──────────────┐     ┌──────────────┐   │
│   │   Client    │────>│   Express    │────>│  In-Memory   │   │
│   │  (Frontend) │     │   Server     │     │    Data      │   │
│   └─────────────┘     └──────────────┘     └──────────────┘   │
│                              │                                  │
│                              │                                  │
│                       ┌──────┴──────┐                          │
│                       │ Middleware  │                          │
│                       │  - CORS     │                          │
│                       │  - JSON     │                          │
│                       └─────────────┘                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Overview

### 1. Express Server (`server.js`)

The single entry point handling all application logic:

- **Server Initialization**: Creates Express app, configures port
- **Middleware Setup**: CORS for cross-origin requests, JSON body parser
- **Route Handlers**: RESTful endpoints for Pokemon data
- **Data Store**: In-memory mock Pokemon array

### 2. Mock Data Layer

Pokemon data is stored as a JavaScript array with the following schema:

```javascript
{
  id: number,           // Unique Pokemon identifier
  name: string,         // Pokemon name
  type: string[],       // Array of type names (e.g., ["Fire", "Flying"])
  legendary: boolean,   // Legendary status
  image: string         // URL to Pokemon sprite from PokeAPI
}
```

## Request Lifecycle

```
HTTP Request
     │
     ▼
┌─────────────────┐
│  CORS Middleware│ ── Adds CORS headers
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JSON Parser    │ ── Parses request body
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Route Handler  │ ── Matches URL pattern
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Filter Logic   │ ── Applies query filters
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JSON Response  │ ── Sends formatted response
└─────────────────┘
```

## API Design

### Response Format

All API responses follow a consistent structure:

**Success Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 12
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Pokemon not found"
}
```

### Filtering Strategy

The `/api/pokemons` endpoint supports client-side filtering via query parameters:

1. **Name Filter**: Case-insensitive substring match using `String.includes()`
2. **Type Filter**: Case-insensitive exact match against type array
3. **Legendary Filter**: Boolean comparison after string-to-boolean conversion

Filters are applied sequentially, reducing the result set with each filter.

## Deployment Architecture

### Docker Container

```
┌────────────────────────────────────────┐
│          Docker Container              │
│  ┌──────────────────────────────────┐  │
│  │     Node.js 18 Alpine            │  │
│  │  ┌────────────────────────────┐  │  │
│  │  │      Express Server        │  │  │
│  │  │      Port: 3001            │  │  │
│  │  └────────────────────────────┘  │  │
│  └──────────────────────────────────┘  │
│                                        │
│  Health Check: GET /health             │
└────────────────────────────────────────┘
```

### Health Monitoring

Docker health checks poll `/health` endpoint every 30 seconds to ensure container availability.

## Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| Single-file architecture | Simplicity for a small API with limited endpoints |
| In-memory data store | No database setup required; suitable for demo/prototype |
| CORS enabled globally | Allows any frontend to consume the API |
| No authentication | Public API for demo purposes |
| Alpine Docker image | Minimal container size for faster deployments |

## Dependencies Between Modules

Since this is a single-file application, there are no internal module dependencies. External dependencies:

- `express`: HTTP server and routing framework
- `cors`: Cross-Origin Resource Sharing middleware

## Scalability Considerations

Current architecture limitations:
- In-memory data is lost on restart
- Single-threaded Node.js process
- No caching layer
- No rate limiting

For production scaling, consider:
- Adding a persistent database (PostgreSQL, MongoDB)
- Implementing Redis for caching
- Adding load balancing with multiple instances
- Implementing rate limiting middleware

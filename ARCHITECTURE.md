# Architecture Documentation - Pokemon Backend API

## Overview

The Pokemon Backend is a lightweight RESTful API built with Node.js and Express.js, designed to provide Pokemon data with filtering capabilities. It serves as the backend for the Pokemon Explorer frontend application.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         POKEMON BACKEND                              │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                        server.js                              │   │
│  │                                                               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │   Express    │  │    CORS      │  │   JSON Parser    │   │   │
│  │  │  Framework   │  │  Middleware  │  │   Middleware     │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │   │
│  │                                                               │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │                    ROUTES                                │ │   │
│  │  │                                                          │ │   │
│  │  │  GET /health ─────────────► Health Check Response        │ │   │
│  │  │  GET /api/pokemons ───────► Filtered Pokemon List        │ │   │
│  │  │  GET /api/pokemons/:id ───► Single Pokemon Response      │ │   │
│  │  │  GET /api/types ──────────► Unique Types List            │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  │                                                               │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │                  IN-MEMORY DATA                          │ │   │
│  │  │                                                          │ │   │
│  │  │  mockPokemons[] - Array of 12 Pokemon objects            │ │   │
│  │  │  • 7 Regular Pokemon                                     │ │   │
│  │  │  • 5 Legendary Pokemon                                   │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP (Port 3001)
                                    ▼
                    ┌──────────────────────────────┐
                    │      Frontend Client         │
                    │   (pokemon-frontend)         │
                    └──────────────────────────────┘
```

## Request/Response Flow

```
┌──────────┐       ┌──────────────┐       ┌──────────────┐       ┌────────────┐
│  Client  │──────►│    CORS      │──────►│    Route     │──────►│   Data     │
│          │       │  Middleware  │       │   Handler    │       │  Layer     │
└──────────┘       └──────────────┘       └──────────────┘       └────────────┘
     ▲                                           │                      │
     │                                           │                      │
     └───────────────────────────────────────────┴──────────────────────┘
                              JSON Response
```

## Component Details

### 1. Middleware Layer

| Middleware | Purpose |
|------------|---------|
| `cors()` | Enables Cross-Origin Resource Sharing for frontend integration |
| `express.json()` | Parses incoming JSON request bodies |

### 2. Route Handlers

#### `/health` - Health Check
- **Purpose**: Kubernetes/Docker health monitoring
- **Response**: `{ status: 'OK', message: 'Pokemon API is running!' }`

#### `/api/pokemons` - Pokemon List
- **Purpose**: Retrieve filtered list of Pokemon
- **Filters**: name (partial), type (exact), legendary (boolean)
- **Logic Flow**:
  ```
  1. Copy full dataset
  2. Apply name filter (if present)
  3. Apply type filter (if present)
  4. Apply legendary filter (if present)
  5. Return filtered results
  ```

#### `/api/pokemons/:id` - Single Pokemon
- **Purpose**: Retrieve specific Pokemon by ID
- **Error Handling**: Returns 404 if Pokemon not found

#### `/api/types` - Type List
- **Purpose**: Get all unique Pokemon types
- **Logic**: Flattens type arrays, extracts unique values, sorts alphabetically

### 3. Data Layer

In-memory array of Pokemon objects with the following structure:

```javascript
{
  id: Number,        // Unique identifier
  name: String,      // Pokemon name
  type: String[],    // Array of types (1-2 elements)
  legendary: Boolean,// Legendary status
  image: String      // URL to PokeAPI sprite
}
```

## Design Patterns

### 1. Functional Filtering Chain
```javascript
// Sequential filter application
let filtered = [...source];
if (filter1) filtered = filtered.filter(predicate1);
if (filter2) filtered = filtered.filter(predicate2);
```

### 2. Consistent Response Format
```javascript
// All responses follow this structure
{
  success: boolean,
  count?: number,    // For list endpoints
  data: any,         // Payload
  message?: string   // For errors
}
```

### 3. Case-Insensitive Matching
```javascript
// Name: partial match
name.toLowerCase().includes(query.toLowerCase())

// Type: exact match
type.toLowerCase() === query.toLowerCase()
```

## Deployment Architecture

### Docker Configuration

```
┌─────────────────────────────────────────────────┐
│              Docker Container                    │
│                                                  │
│  ┌────────────────────────────────────────┐    │
│  │         node:18-alpine                  │    │
│  │                                         │    │
│  │  ┌─────────────────────────────────┐   │    │
│  │  │      /app (WORKDIR)             │   │    │
│  │  │                                  │   │    │
│  │  │  • package.json                  │   │    │
│  │  │  • server.js                     │   │    │
│  │  │  • node_modules/                 │   │    │
│  │  └─────────────────────────────────┘   │    │
│  │                                         │    │
│  │  EXPOSE 3001                            │    │
│  │  CMD ["npm", "start"]                   │    │
│  └────────────────────────────────────────┘    │
│                                                  │
│  HEALTHCHECK: curl http://localhost:3001/health │
└─────────────────────────────────────────────────┘
```

### Network Topology

```
┌─────────────────────────────────────────────────────────────┐
│                    pokemon-network (bridge)                  │
│                                                              │
│  ┌─────────────────────┐      ┌─────────────────────┐      │
│  │   pokemon-backend   │      │   pokemon-frontend  │      │
│  │   (port 3001)       │◄─────│   (port 3002)       │      │
│  └─────────────────────┘      └─────────────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
              │                            │
              ▼                            ▼
         localhost:3001              localhost:3002
```

## Security Considerations

### Current Implementation
- **CORS**: Enabled globally (permissive)
- **Input Validation**: Basic query parameter handling
- **No Authentication**: Open API

### Recommended Enhancements
1. Rate limiting (express-rate-limit)
2. Input sanitization
3. API key authentication for production
4. CORS whitelist configuration

## Scalability Considerations

### Current Limitations
- In-memory data (lost on restart)
- Single-threaded Node.js process
- No caching layer

### Scaling Path
1. **Database Integration**: Replace mockPokemons with MongoDB/PostgreSQL
2. **Caching**: Add Redis for frequent queries
3. **Clustering**: Use PM2 or Node.js cluster module
4. **Load Balancing**: Nginx or cloud load balancer

## Error Handling

| Scenario | HTTP Status | Response |
|----------|-------------|----------|
| Pokemon not found | 404 | `{ success: false, message: 'Pokemon not found' }` |
| Invalid route | 404 | Express default |
| Server error | 500 | Express default |

## Performance Characteristics

| Metric | Value |
|--------|-------|
| Startup time | ~500ms |
| Response time | <10ms (in-memory) |
| Memory footprint | ~50MB |
| Concurrent connections | Node.js default (~1000) |

## Integration Points

### Frontend Integration
- **Protocol**: HTTP/REST
- **Format**: JSON
- **Endpoints**: `/api/pokemons`, `/api/types`
- **CORS**: Enabled

### External Dependencies
- **PokeAPI Sprites**: Pokemon images hosted externally
- **No other external services**

## Future Architecture Considerations

### Database Integration
```
┌──────────┐     ┌───────────┐     ┌──────────────┐
│  Client  │────►│  Express  │────►│  PostgreSQL  │
│          │     │    API    │     │   MongoDB    │
└──────────┘     └───────────┘     └──────────────┘
```

### Microservices Evolution
```
┌──────────┐     ┌───────────────┐     ┌─────────────────┐
│  Client  │────►│  API Gateway  │────►│ Pokemon Service │
│          │     │               │────►│  Type Service   │
└──────────┘     └───────────────┘     │  Auth Service   │
                                        └─────────────────┘
```

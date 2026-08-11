# Architecture Overview - Pokemon Backend

This document provides a high-level architectural view of the Pokemon Backend API.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Pokemon Backend                          │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │   Express   │───>│  Middleware │───>│      Routes         │ │
│  │   Server    │    │  (CORS,JSON)│    │                     │ │
│  └─────────────┘    └─────────────┘    │  GET /health        │ │
│        │                               │  GET /api/pokemons  │ │
│        │                               │  GET /api/pokemons/:id│ │
│        │                               │  GET /api/types     │ │
│        ▼                               └──────────┬──────────┘ │
│  ┌─────────────┐                                  │            │
│  │    Port     │                                  ▼            │
│  │    3001     │                       ┌─────────────────────┐ │
│  └─────────────┘                       │   Mock Data Store   │ │
│                                        │   (In-Memory Array) │ │
│                                        └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/JSON
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Pokemon Frontend                           │
│                      (React Application)                        │
└─────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### 1. Express Server
- **Purpose**: HTTP server initialization and configuration
- **Port**: 3001 (configurable via `PORT` environment variable)
- **Responsibility**: Listen for incoming HTTP requests

### 2. Middleware Layer
| Middleware | Purpose |
|------------|---------|
| `cors()` | Enable Cross-Origin Resource Sharing for frontend integration |
| `express.json()` | Parse incoming JSON request bodies |

### 3. Routes Layer

#### Health Check (`/health`)
- Returns server status for monitoring and container health checks
- Response: `{ status: 'OK', message: 'Pokemon API is running!' }`

#### Pokemon List (`/api/pokemons`)
- Returns all Pokemon with optional filtering
- Supports query parameters: `name`, `type`, `legendary`
- Implements case-insensitive filtering logic

#### Single Pokemon (`/api/pokemons/:id`)
- Returns a single Pokemon by numeric ID
- Returns 404 if Pokemon not found

#### Types List (`/api/types`)
- Extracts and returns unique Pokemon types
- Dynamically computed from mock data

### 4. Data Store
- **Type**: In-memory JavaScript array
- **Contents**: 12 pre-defined Pokemon objects
- **Persistence**: None (data resets on server restart)

## Data Flow

### Request Lifecycle

```
Client Request
      │
      ▼
┌─────────────┐
│   Express   │
│   Router    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Middleware  │
│ (CORS, JSON)│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Route     │
│  Handler    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Filter/    │
│  Process    │
│  Mock Data  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   JSON      │
│  Response   │
└─────────────┘
```

### Filtering Logic Flow

```
Query Parameters → Parse → Apply Filters → Return Results
      │               │          │              │
      │               │          │              │
      ▼               ▼          ▼              ▼
{name, type,    Extract      Chain filter   {success,
 legendary}     values       operations     count, data}
```

## Key Architectural Decisions

### 1. Single-File Architecture
- **Decision**: All code in `server.js`
- **Rationale**: Simple application with limited scope; easy to understand and deploy
- **Trade-off**: Less modular, but appropriate for current size

### 2. In-Memory Data Store
- **Decision**: No database; use JavaScript array
- **Rationale**: Mock data for development/demo purposes
- **Trade-off**: No persistence; limited scalability

### 3. RESTful API Design
- **Decision**: Follow REST conventions for endpoints
- **Rationale**: Industry standard; easy for frontend integration
- **Patterns**: Resource-based URLs, HTTP verbs for operations

### 4. CORS Enabled Globally
- **Decision**: Allow all origins
- **Rationale**: Development convenience; frontend on different port
- **Trade-off**: Security consideration for production

## Dependencies Between Modules

Since this is a single-file application, dependencies are minimal:

```
server.js
    │
    ├── express (framework)
    │
    └── cors (middleware)
```

## Scalability Considerations

### Current Limitations
1. In-memory data (no persistence)
2. Single-file structure (no separation of concerns)
3. No database connection
4. No authentication/authorization

### Future Enhancement Paths
1. Add database layer (MongoDB/PostgreSQL)
2. Split into routes, controllers, models
3. Add authentication middleware
4. Implement caching layer
5. Add input validation (express-validator)

## Security Considerations

| Aspect | Current State | Recommendation |
|--------|--------------|----------------|
| CORS | Allow all origins | Restrict to known frontends |
| Auth | None | Add JWT/session authentication |
| Input Validation | Basic | Add express-validator |
| Rate Limiting | None | Add express-rate-limit |

## Environment Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | 3001 | Server listening port |
| `NODE_ENV` | - | Environment mode |

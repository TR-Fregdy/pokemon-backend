# Architecture Documentation - Pokemon Backend

This document provides a comprehensive overview of the Pokemon Backend API architecture, designed to help developers understand the system design and make informed decisions.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Project Structure](#project-structure)
4. [Data Flow](#data-flow)
5. [API Design](#api-design)
6. [Deployment Architecture](#deployment-architecture)
7. [Technology Decisions](#technology-decisions)

---

## System Overview

The Pokemon Backend is a lightweight RESTful API server that provides Pokemon data with filtering capabilities. It's designed to serve as the data layer for the [Pokemon Frontend](../pokemon-frontend) application.

### Key Characteristics

- **Stateless**: No session management; each request is independent
- **In-Memory Data**: Uses embedded mock data (no external database)
- **RESTful**: Follows REST conventions for resource endpoints
- **CORS-Enabled**: Configured for cross-origin requests from frontend

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT APPLICATIONS                            │
│                    (Pokemon Frontend, Mobile Apps, etc.)                 │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ HTTP/HTTPS
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         EXPRESS.JS SERVER                                │
│                           (server.js)                                    │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      MIDDLEWARE STACK                            │    │
│  │  ┌─────────────┐   ┌─────────────────┐   ┌──────────────────┐   │    │
│  │  │    CORS     │ → │  JSON Parser    │ → │     Routes       │   │    │
│  │  │ (cors())    │   │ (express.json())│   │  (GET handlers)  │   │    │
│  │  └─────────────┘   └─────────────────┘   └──────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                         ROUTES                                   │    │
│  │  ┌───────────────┐  ┌────────────────────┐  ┌────────────────┐  │    │
│  │  │  /health      │  │  /api/pokemons     │  │  /api/types    │  │    │
│  │  │  (health chk) │  │  (list + filter)   │  │  (unique types)│  │    │
│  │  └───────────────┘  └────────────────────┘  └────────────────┘  │    │
│  │                            │                                     │    │
│  │                      ┌─────┴─────┐                               │    │
│  │                      │ /:id      │                               │    │
│  │                      │ (single)  │                               │    │
│  │                      └───────────┘                               │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                 │                                        │
│                                 ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     IN-MEMORY DATA STORE                         │    │
│  │                      (mockPokemons[])                            │    │
│  │                                                                  │    │
│  │  ┌──────────────────────────────────────────────────────────┐   │    │
│  │  │  { id, name, type[], legendary, image }  × 12 Pokemon    │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌───────────────────────┐
                    │   External Resource   │
                    │   (PokeAPI Sprites)   │
                    │  githubusercontent.com │
                    └───────────────────────┘
```

---

## Project Structure

```
pokemon-backend/
│
├── server.js                    # Main application file
│   ├── Express app initialization
│   ├── Middleware configuration
│   ├── Mock Pokemon data (12 entries)
│   ├── Route handlers
│   └── Server startup
│
├── package.json                 # Dependencies & scripts
│   ├── express (^4.18.2)
│   ├── cors (^2.8.5)
│   └── nodemon (^3.0.1) [dev]
│
├── .gitignore                   # Git exclusions
├── README.md                    # User documentation
├── CLAUDE.md                    # AI agent guidance
├── ARCHITECTURE.md              # This file
│
└── .tr-codegen/                 # Deployment configuration
    ├── Dockerfile               # Container image definition
    └── docker-compose.yml       # Container orchestration
```

### File Responsibilities

| File | Purpose | Lines of Code |
|------|---------|---------------|
| `server.js` | All application logic | ~165 |
| `package.json` | Project configuration | ~27 |
| `Dockerfile` | Container build | ~23 |
| `docker-compose.yml` | Service orchestration | ~24 |

---

## Data Flow

### Request Lifecycle

```
1. Client Request
       │
       ▼
2. Express receives request
       │
       ▼
3. CORS middleware (allows cross-origin)
       │
       ▼
4. JSON body parser (for POST/PUT requests)
       │
       ▼
5. Route matching
       │
       ├─── /health ──────────────────────► Return status JSON
       │
       ├─── /api/pokemons ─────────────────► Filter mockPokemons[]
       │         │                                    │
       │         ├── ?name=xxx ─────────► filter by name
       │         ├── ?type=xxx ─────────► filter by type
       │         └── ?legendary=xxx ────► filter by legendary
       │                                              │
       │                                              ▼
       │                                    Return filtered array
       │
       ├─── /api/pokemons/:id ─────────────► Find by ID
       │                                              │
       │                                    ┌─────────┴─────────┐
       │                                    ▼                   ▼
       │                              Found: 200          Not Found: 404
       │
       └─── /api/types ────────────────────► Extract unique types
                                                      │
                                                      ▼
                                            Return sorted array
```

### Filter Logic Flow

```javascript
// Starting point: all Pokemon
let filtered = [...mockPokemons]  // 12 Pokemon

// Stage 1: Name filter (partial, case-insensitive)
if (name) {
    filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(name.toLowerCase())
    )
}

// Stage 2: Type filter (exact match, case-insensitive)
if (type) {
    filtered = filtered.filter(p =>
        p.type.some(t => t.toLowerCase() === type.toLowerCase())
    )
}

// Stage 3: Legendary filter (boolean match)
if (legendary !== undefined) {
    filtered = filtered.filter(p => p.legendary === (legendary === 'true'))
}

// Result: filtered subset
return { success: true, count: filtered.length, data: filtered }
```

---

## API Design

### Resource Model

```
/api
 └── /pokemons           # Pokemon collection resource
      ├── GET            # List all (with query filters)
      └── /:id           # Individual Pokemon
           └── GET       # Retrieve single Pokemon
 └── /types              # Types collection resource
      └── GET            # List all unique types
```

### Response Formats

**Success Response (List)**
```json
{
    "success": true,
    "count": 5,
    "data": [
        { "id": 1, "name": "Pikachu", "type": ["Electric"], "legendary": false, "image": "..." }
    ]
}
```

**Success Response (Single)**
```json
{
    "success": true,
    "data": { "id": 1, "name": "Pikachu", "type": ["Electric"], "legendary": false, "image": "..." }
}
```

**Error Response (404)**
```json
{
    "success": false,
    "message": "Pokemon not found"
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET requests |
| 404 | Not Found | Pokemon ID doesn't exist |

---

## Deployment Architecture

### Docker Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                     DOCKER HOST                              │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              pokemon-network (bridge)                   │ │
│  │                                                         │ │
│  │  ┌─────────────────────────────────────────────────┐   │ │
│  │  │     pokemon-backend container                    │   │ │
│  │  │     (node:18-alpine)                            │   │ │
│  │  │                                                  │   │ │
│  │  │     ┌──────────────────────────┐                │   │ │
│  │  │     │    Node.js Process       │                │   │ │
│  │  │     │    (server.js)           │                │   │ │
│  │  │     │    PORT: 3001            │                │   │ │
│  │  │     └──────────────────────────┘                │   │ │
│  │  │              │                                   │   │ │
│  │  │              │ EXPOSE 3001                       │   │ │
│  │  └──────────────┼───────────────────────────────────┘   │ │
│  │                 │                                        │ │
│  └─────────────────┼────────────────────────────────────────┘ │
│                    │                                          │
│                    │ -p 3001:3001                              │
│                    ▼                                          │
│         ┌──────────────────┐                                  │
│         │   Host Port 3001 │                                  │
└─────────┴──────────────────┴──────────────────────────────────┘
                    │
                    ▼
              External Access
           http://localhost:3001
```

### Health Checks

The container includes built-in health monitoring:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

---

## Technology Decisions

### Why Express.js?

| Consideration | Decision |
|--------------|----------|
| Simplicity | Minimal boilerplate for REST APIs |
| Ecosystem | Largest Node.js middleware ecosystem |
| Performance | Lightweight with low overhead |
| Learning curve | Widely known, easy to maintain |

### Why In-Memory Data?

| Consideration | Decision |
|--------------|----------|
| Demo purpose | Quick setup, no database required |
| Portability | Runs anywhere Node.js is available |
| Simplicity | No connection management needed |

### Trade-offs

| Current State | Trade-off |
|--------------|-----------|
| Single file | Simple but doesn't scale well |
| Mock data | Fast but not persistent |
| No auth | Easy access but no security |
| No tests | Quick development but risky changes |

### Future Considerations

1. **Database Integration**: MongoDB or PostgreSQL for persistent data
2. **Route Separation**: Split routes into separate files
3. **Validation**: Add input validation with Joi or express-validator
4. **Authentication**: JWT-based auth for protected endpoints
5. **Testing**: Jest + Supertest for API testing
6. **Logging**: Winston or Pino for structured logging
7. **Rate Limiting**: express-rate-limit for API protection

---

## Related Documentation

- [README.md](./README.md) - Quick start guide
- [CLAUDE.md](./CLAUDE.md) - AI agent guidance
- [Pokemon Frontend](../pokemon-frontend/ARCHITECTURE.md) - Frontend architecture

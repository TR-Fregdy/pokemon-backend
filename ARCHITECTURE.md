# Architecture Overview - Pokemon Backend API

This document provides a comprehensive overview of the Pokemon Backend API architecture for developers and decision-makers.

## System Context

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Pokemon System                              │
│  ┌──────────────────┐         ┌──────────────────┐                  │
│  │  Pokemon         │  HTTP   │  Pokemon         │                  │
│  │  Frontend        │────────>│  Backend API     │                  │
│  │  (React App)     │  JSON   │  (This Repo)     │                  │
│  │  Port: 3000      │         │  Port: 3001      │                  │
│  └──────────────────┘         └──────────────────┘                  │
│                                       │                              │
│                                       v                              │
│                               ┌──────────────────┐                  │
│                               │  In-Memory       │                  │
│                               │  Mock Data       │                  │
│                               │  (12 Pokemon)    │                  │
│                               └──────────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
```

## Application Architecture

### Single-File Monolithic Design

The entire backend is contained in a single `server.js` file:

```
server.js
├── Dependencies (express, cors)
├── App Configuration
├── Middleware Setup
│   ├── CORS
│   └── JSON Parser
├── Mock Data Definition
├── Route Handlers
│   ├── GET /health
│   ├── GET /api/pokemons
│   ├── GET /api/pokemons/:id
│   └── GET /api/types
└── Server Startup
```

### Request Flow

```
┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌──────────┐
│ Client  │───>│ CORS        │───>│ JSON Parser │───>│ Route    │
│ Request │    │ Middleware  │    │ Middleware  │    │ Handler  │
└─────────┘    └─────────────┘    └─────────────┘    └──────────┘
                                                           │
┌─────────┐                                                │
│ JSON    │<───────────────────────────────────────────────┘
│ Response│
└─────────┘
```

## Directory Structure

```
pokemon-backend/
├── server.js              # Main application (entry point + all logic)
├── package.json           # Dependencies and scripts
├── .gitignore             # Git ignore rules
├── README.md              # Project documentation
└── .tr-codegen/           # Deployment configuration
    ├── Dockerfile         # Docker build instructions
    └── docker-compose.yml # Container orchestration
```

### Directory Purposes

| Directory | Purpose |
|-----------|---------|
| Root (`/`) | Application code and configuration |
| `.tr-codegen/` | Docker and deployment files |

## Data Architecture

### In-Memory Data Store

```javascript
const mockPokemons = [
  {
    id: 1,
    name: 'Pikachu',
    type: ['Electric'],
    legendary: false,
    image: 'https://...'
  },
  // ... 11 more Pokemon
];
```

### Data Relationships

```
┌─────────────────────────────────────┐
│           Pokemon Entity            │
├─────────────────────────────────────┤
│ id: number (Primary Key)            │
│ name: string                        │
│ type: string[] (Multi-valued)       │
│ legendary: boolean                  │
│ image: string (URL)                 │
└─────────────────────────────────────┘
```

### Available Pokemon Types

- Electric, Fire, Flying, Water, Grass, Poison
- Psychic, Ice, Dragon

## API Design

### RESTful Endpoints

| Endpoint | Method | Purpose | Query Params |
|----------|--------|---------|--------------|
| `/health` | GET | Health check | None |
| `/api/pokemons` | GET | List Pokemon | name, type, legendary |
| `/api/pokemons/:id` | GET | Get single Pokemon | None |
| `/api/types` | GET | List unique types | None |

### Response Structure

**Success Response:**
```json
{
  "success": true,
  "count": 12,
  "data": [...]
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Pokemon not found"
}
```

## Filtering Logic

```
┌──────────────────────────────────────────────────────────────┐
│                     Filter Pipeline                           │
│                                                               │
│  Raw Data ──> Name Filter ──> Type Filter ──> Legendary ──>  │
│              (partial,       (exact,          Filter          │
│               case-          case-            (boolean)       │
│               insensitive)   insensitive)                     │
│                                                               │
│                                        Filtered Results       │
└──────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

### Docker Configuration

```
┌─────────────────────────────────────────────┐
│              Docker Container               │
│  ┌───────────────────────────────────────┐  │
│  │       node:18-alpine                  │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │    Express Application          │  │  │
│  │  │    Port: 3001                   │  │  │
│  │  │    Health: /health              │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Exposed: 3001:3001                         │
│  Restart: unless-stopped                    │
│  Network: pokemon-network                   │
└─────────────────────────────────────────────┘
```

### Health Check Configuration

- Interval: 30 seconds
- Timeout: 10 seconds
- Retries: 3
- Start Period: 40 seconds

## Security Considerations

### Current Implementation

| Aspect | Status | Notes |
|--------|--------|-------|
| CORS | Open | All origins allowed |
| Authentication | None | Public API |
| Rate Limiting | None | No protection |
| Input Validation | Basic | Query params only |
| HTTPS | None | HTTP only |

### Recommendations for Production

1. Implement CORS origin whitelist
2. Add API key authentication
3. Implement rate limiting
4. Add input sanitization
5. Enable HTTPS via reverse proxy

## Performance Characteristics

### Current Design

- **Data Size**: 12 Pokemon (constant)
- **Filtering**: O(n) linear scan
- **Memory**: Minimal (in-memory array)
- **Concurrency**: Node.js event loop

### Scalability Considerations

| Scenario | Current Capability |
|----------|-------------------|
| Many concurrent users | Good (Node.js async) |
| Large dataset | Poor (in-memory, linear scan) |
| High availability | Requires multiple instances |

## Integration Points

### Frontend Integration

```javascript
// Frontend fetches from:
const API_BASE_URL = 'http://localhost:3001';

// Endpoints used:
fetch(`${API_BASE_URL}/api/pokemons`)
fetch(`${API_BASE_URL}/api/types`)
```

### External Dependencies

- **PokeAPI Sprites**: Pokemon images hosted externally
  - URL Pattern: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png`

## Error Handling Strategy

```
┌─────────────────────────────────────────┐
│           Error Handling                │
├─────────────────────────────────────────┤
│ 404: Pokemon not found                  │
│      → Returns { success: false, msg }  │
│                                         │
│ No global error handler                 │
│ Express default error handling used     │
└─────────────────────────────────────────┘
```

## Future Architecture Considerations

### Potential Improvements

1. **Database Integration**: Replace in-memory data with MongoDB/PostgreSQL
2. **Caching Layer**: Add Redis for API response caching
3. **API Versioning**: Implement `/api/v1/` prefix
4. **Logging**: Add structured logging (Winston/Pino)
5. **Testing**: Add Jest unit and integration tests
6. **Documentation**: Add OpenAPI/Swagger specification

### Microservices Evolution Path

```
Current:                    Future Potential:
┌──────────────┐            ┌──────────────┐
│   Monolith   │            │  API Gateway │
│  (server.js) │    ──>     └──────┬───────┘
└──────────────┘                   │
                          ┌────────┴────────┐
                          │                 │
                    ┌─────▼─────┐     ┌─────▼─────┐
                    │  Pokemon  │     │   Types   │
                    │  Service  │     │  Service  │
                    └───────────┘     └───────────┘
```

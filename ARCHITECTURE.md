# Architecture Overview - Pokemon Backend

This document provides a comprehensive overview of the Pokemon Backend API architecture.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Pokemon Backend API                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      server.js                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │
│  │  │ Middleware  │  │   Routes    │  │   Mock Data     │  │  │
│  │  │ - CORS      │  │ /health     │  │ 12 Pokemon      │  │  │
│  │  │ - JSON      │  │ /api/pokemons│ │ objects         │  │  │
│  │  │             │  │ /api/types  │  │                 │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP (Port 3001)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend Client                              │
│                   (pokemon-frontend)                             │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
pokemon-backend/
├── server.js              # Main application entry point
├── package.json           # Dependencies and scripts
├── README.md              # Project documentation
├── .gitignore             # Git ignore rules
└── .tr-codegen/           # Docker configuration
    ├── Dockerfile         # Container build
    └── docker-compose.yml # Orchestration
```

## Application Flow

### Request Lifecycle

```
Client Request
      │
      ▼
┌─────────────┐
│   Express   │
│   Server    │
└─────────────┘
      │
      ▼
┌─────────────┐
│ Middleware  │
│ (CORS,JSON) │
└─────────────┘
      │
      ▼
┌─────────────┐
│   Router    │
│  Matching   │
└─────────────┘
      │
      ▼
┌─────────────┐
│   Route     │
│  Handler    │
└─────────────┘
      │
      ▼
┌─────────────┐
│   Filter    │
│   Logic     │
└─────────────┘
      │
      ▼
┌─────────────┐
│    JSON     │
│  Response   │
└─────────────┘
```

## Design Decisions

### 1. Single-File Architecture

**Decision**: All application logic in one file (`server.js`)

**Rationale**:
- Simple API with limited scope
- Easy to understand and maintain
- No complex business logic requiring separation
- Quick prototyping and development

### 2. In-Memory Mock Data

**Decision**: Store Pokemon data as a JavaScript array

**Rationale**:
- No database setup required
- Instant development startup
- Sufficient for demo/prototype purposes
- Easy to modify and extend

### 3. Client-Side Filtering Mirrored on Server

**Decision**: Support filtering on both client and server

**Rationale**:
- Reduces network calls for small datasets
- Enables offline filtering on frontend
- Server filtering available for future scaling

## API Design

### RESTful Conventions

| Pattern | Example | Description |
|---------|---------|-------------|
| Collection | `GET /api/pokemons` | Get all resources |
| Instance | `GET /api/pokemons/:id` | Get single resource |
| Related | `GET /api/types` | Get related data |

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

## Scalability Considerations

### Current Limitations
- In-memory data (not persistent)
- Single server instance
- No caching layer
- No rate limiting

### Future Improvements
- Add database (PostgreSQL/MongoDB)
- Implement pagination
- Add request caching
- Add rate limiting
- Split routes into separate files
- Add input validation middleware
- Add authentication/authorization

## Deployment Architecture

### Docker Setup

```
┌───────────────────────────────────────────┐
│           Docker Container                 │
│  ┌─────────────────────────────────────┐  │
│  │         node:18-alpine              │  │
│  │  ┌───────────────────────────────┐  │  │
│  │  │        npm start              │  │  │
│  │  │     (server.js:3001)          │  │  │
│  │  └───────────────────────────────┘  │  │
│  └─────────────────────────────────────┘  │
│                    │                       │
│            Port 3001 exposed              │
└───────────────────────────────────────────┘
```

### Health Monitoring

- Endpoint: `GET /health`
- Docker health check: Every 30s
- Timeout: 3s
- Retries: 3

## Integration Points

### Frontend Integration

The API is designed to work with `pokemon-frontend`:

- CORS enabled for cross-origin requests
- Proxy configuration supported (`http://localhost:3001`)
- Environment variable: `REACT_APP_API_URL`

### Network Configuration

| Service | Port | Protocol |
|---------|------|----------|
| API Server | 3001 | HTTP |
| Docker Network | pokemon-network | Bridge |

## Security Considerations

### Current Implementation
- CORS middleware enabled
- No authentication required
- No input sanitization

### Recommendations for Production
- Add HTTPS/TLS
- Implement API key authentication
- Add request validation
- Implement rate limiting
- Add security headers (Helmet.js)

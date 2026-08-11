# Pokemon Backend Architecture

## System Overview

The Pokemon Backend is a lightweight REST API built with Node.js and Express.js. It provides Pokemon data with filtering capabilities to the frontend application.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Pokemon Backend                              │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      server.js                                │   │
│  │                                                               │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │   │
│  │  │ Middleware  │───▶│   Routes    │───▶│   Mock Data     │  │   │
│  │  │ (CORS,JSON) │    │ (REST API)  │    │ (In-Memory)     │  │   │
│  │  └─────────────┘    └─────────────┘    └─────────────────┘  │   │
│  │                                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Major Components

### 1. Express Application

The core Express.js application handles HTTP requests and routing.

**Responsibilities:**
- HTTP server initialization
- Middleware configuration
- Route registration
- Error handling

### 2. Middleware Stack

```
Request → CORS → JSON Parser → Route Handler → Response
```

| Middleware | Purpose |
|------------|---------|
| `cors()` | Enable Cross-Origin Resource Sharing |
| `express.json()` | Parse JSON request bodies |

### 3. Route Handlers

| Route | Handler | Description |
|-------|---------|-------------|
| `/health` | Health check | Returns server status |
| `/api/pokemons` | List Pokemon | Supports filtering by name, type, legendary |
| `/api/pokemons/:id` | Get Pokemon | Returns single Pokemon by ID |
| `/api/types` | List types | Returns unique Pokemon types |

### 4. Data Layer

In-memory JavaScript array containing mock Pokemon data.

```javascript
mockPokemons = [
  { id, name, type[], legendary, image }
]
```

## Data Flow

### Request Lifecycle

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│   CORS   │────▶│  Router  │────▶│  Handler │
│ Request  │     │Middleware│     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                         │
                                                         ▼
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │◀────│   JSON   │◀────│  Filter  │◀────│   Data   │
│ Response │     │ Response │     │  Logic   │     │  Array   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

### Filtering Pipeline

```
All Pokemon → Name Filter → Type Filter → Legendary Filter → Response
```

Each filter is applied sequentially using array methods:
1. **Name Filter**: `Array.filter()` with `String.includes()`
2. **Type Filter**: `Array.filter()` with `Array.some()`
3. **Legendary Filter**: `Array.filter()` with boolean comparison

## API Design

### RESTful Conventions

- `GET` requests for all operations (read-only API)
- Resource-based URL structure (`/api/pokemons`)
- Query parameters for filtering
- JSON response format

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

## Key Architectural Decisions

### 1. Single-File Architecture

**Decision:** All code in one file (`server.js`)

**Rationale:**
- Simple application with limited functionality
- Easy to understand and deploy
- No complex routing or business logic

**Trade-offs:**
- Not scalable for larger applications
- Limited code organization

### 2. In-Memory Data Store

**Decision:** Mock data stored in JavaScript array

**Rationale:**
- No database setup required
- Fast read operations
- Simple development and testing

**Trade-offs:**
- Data lost on server restart
- Not suitable for production persistence

### 3. Client-Side Filtering Support

**Decision:** Support filtering via query parameters

**Rationale:**
- Reduces client-side processing
- Standard REST API pattern
- Flexible filtering combinations

## Dependencies

```
┌─────────────────────────────────────────────────┐
│                 pokemon-backend                  │
├─────────────────────────────────────────────────┤
│  Dependencies:                                   │
│  ├── express@4.18.2   (Web framework)           │
│  └── cors@2.8.5       (CORS middleware)         │
│                                                  │
│  DevDependencies:                                │
│  └── nodemon@3.0.1    (Development server)      │
└─────────────────────────────────────────────────┘
```

## External Integrations

### Pokemon Sprites

Images are sourced from PokeAPI GitHub repository:
```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png
```

### Frontend Integration

```
┌─────────────────┐         ┌─────────────────┐
│     Frontend    │  HTTP   │     Backend     │
│   (React App)   │────────▶│   (Express)     │
│   Port: 3000    │  :3001  │   Port: 3001    │
└─────────────────┘         └─────────────────┘
```

The frontend uses a proxy configuration to route API requests to the backend.

## Scalability Considerations

### Current Limitations

- Single-threaded Node.js process
- In-memory data (no persistence)
- No caching layer
- No rate limiting

### Future Enhancements

To scale this application, consider:
1. Add database (PostgreSQL, MongoDB)
2. Implement Redis caching
3. Add request rate limiting
4. Use PM2 or clustering for multiple processes
5. Add API versioning

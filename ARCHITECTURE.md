# Architecture Overview - Pokemon Backend

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Pokemon Backend API                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │   Express   │───>│   Routes    │───>│   Mock Data     │ │
│  │   Server    │    │  Handlers   │    │   (In-Memory)   │ │
│  └─────────────┘    └─────────────┘    └─────────────────┘ │
│         │                                                   │
│         v                                                   │
│  ┌─────────────┐                                           │
│  │ Middleware  │                                           │
│  │ (CORS,JSON) │                                           │
│  └─────────────┘                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              v
┌─────────────────────────────────────────────────────────────┐
│                    External Clients                         │
│                                                             │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │ Pokemon Frontend │    │   Other Clients  │              │
│  │   (React App)    │    │   (curl, etc.)   │              │
│  └──────────────────┘    └──────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

## Component Overview

### Express Server (`server.js`)

The main application entry point that:
- Initializes Express application
- Configures middleware (CORS, JSON parsing)
- Defines route handlers
- Starts HTTP server on configured port

### Middleware Layer

| Middleware | Purpose |
|------------|---------|
| `cors()` | Enables Cross-Origin Resource Sharing |
| `express.json()` | Parses JSON request bodies |

### Route Handlers

| Route | Handler Logic |
|-------|---------------|
| `/health` | Returns server status |
| `/api/pokemons` | Filters and returns Pokemon array |
| `/api/pokemons/:id` | Finds and returns single Pokemon |
| `/api/types` | Extracts and returns unique types |

### Data Layer

In-memory array of Pokemon objects with structure:
```javascript
{
  id: number,        // Unique identifier
  name: string,      // Pokemon name
  type: string[],    // Array of type strings
  legendary: boolean,// Legendary status
  image: string      // Sprite URL
}
```

## Request Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Client  │───>│   CORS   │───>│   JSON   │───>│  Route   │
│ Request  │    │ Middleware│    │ Parser   │    │ Handler  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                      │
                                                      v
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Client  │<───│   JSON   │<───│  Filter  │<───│  Mock    │
│ Response │    │ Response │    │  Logic   │    │  Data    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

## Key Design Decisions

### 1. Single-File Architecture
All application logic resides in `server.js` for simplicity. Suitable for small APIs but should be refactored for larger projects.

### 2. In-Memory Data Storage
Mock data eliminates database dependencies. For production, this should be replaced with a proper database.

### 3. RESTful Design
Standard REST conventions with:
- Resource-based URLs (`/api/pokemons`, `/api/types`)
- HTTP methods (GET only currently)
- JSON responses

### 4. Stateless Filtering
All filtering happens on each request with no caching. Simple but not optimized for large datasets.

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│              Docker Container                    │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │           Node.js (Alpine)              │   │
│  │                                         │   │
│  │  ┌─────────────────────────────────┐   │   │
│  │  │       Express Application       │   │   │
│  │  │         (Port 3001)            │   │   │
│  │  └─────────────────────────────────┘   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Health Check: curl http://localhost:3001/health│
└─────────────────────────────────────────────────┘
```

## Module Dependencies

```
pokemon-backend
    │
    ├── express (4.18.2)
    │   └── HTTP server framework
    │
    ├── cors (2.8.5)
    │   └── Cross-origin support
    │
    └── nodemon (3.0.1) [dev]
        └── Development auto-reload
```

## Scalability Considerations

| Current State | Production Recommendation |
|---------------|---------------------------|
| In-memory data | PostgreSQL/MongoDB |
| Single process | PM2 cluster mode |
| No caching | Redis caching layer |
| No auth | JWT authentication |
| No validation | Joi/Yup validation |

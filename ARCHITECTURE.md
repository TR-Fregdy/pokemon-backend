# Architecture Document - Pokemon Backend

## System Overview

The Pokemon Backend is a lightweight REST API service providing Pokemon data with filtering capabilities. It follows a monolithic single-file architecture pattern optimized for simplicity.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                    (Pokemon Frontend / Curl)                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP (Port 3001)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       EXPRESS SERVER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │    CORS     │  │    JSON     │  │      ROUTE HANDLERS     │ │
│  │ Middleware  │──│  Middleware │──│  /health                │ │
│  └─────────────┘  └─────────────┘  │  /api/pokemons          │ │
│                                     │  /api/pokemons/:id      │ │
│                                     │  /api/types             │ │
│                                     └─────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│              In-Memory Mock Pokemon Array                        │
│                    (12 Pokemon Records)                          │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Entry Point (`server.js`)

The entire application is contained in a single file with the following logical sections:

```
server.js (167 lines)
├── Lines 1-9: Imports and Express initialization
├── Lines 12-97: Mock data definition
├── Lines 99-162: Route handlers
└── Lines 164-166: Server startup
```

### 2. Middleware Pipeline

```
Request → CORS → JSON Parser → Route Handler → Response
```

| Middleware | Purpose |
|------------|---------|
| `cors()` | Enables cross-origin requests from any domain |
| `express.json()` | Parses JSON request bodies |

### 3. Route Architecture

```
/health                    → Health check (GET)
/api/pokemons             → List with filtering (GET)
/api/pokemons/:id         → Single Pokemon (GET)
/api/types                → Unique types list (GET)
```

## Data Flow

### Request Lifecycle

```
1. HTTP Request arrives at port 3001
         │
         ▼
2. CORS middleware validates origin
         │
         ▼
3. JSON middleware parses body (if any)
         │
         ▼
4. Route handler matches URL pattern
         │
         ▼
5. Filter logic applied (for /api/pokemons)
   ├── name: case-insensitive includes()
   ├── type: case-insensitive exact match
   └── legendary: boolean comparison
         │
         ▼
6. JSON response returned with success wrapper
```

### Filtering Algorithm

```javascript
Input: mockPokemons array + query params
                │
                ▼
┌───────────────────────────────┐
│   Clone array                 │
│   let filtered = [...mock]    │
└───────────────┬───────────────┘
                │
    ┌───────────▼───────────┐
    │  name param exists?   │
    └───────────┬───────────┘
                │ yes
                ▼
┌───────────────────────────────┐
│ Filter: name.toLowerCase()   │
│         .includes(query)     │
└───────────────┬───────────────┘
                │
    ┌───────────▼───────────┐
    │  type param exists?   │
    └───────────┬───────────┘
                │ yes
                ▼
┌───────────────────────────────┐
│ Filter: types array contains │
│         exact match          │
└───────────────┬───────────────┘
                │
    ┌───────────▼───────────┐
    │legendary param exists?│
    └───────────┬───────────┘
                │ yes
                ▼
┌───────────────────────────────┐
│ Filter: legendary === bool   │
└───────────────┬───────────────┘
                │
                ▼
         Return filtered
```

## Deployment Architecture

### Docker Container

```
┌─────────────────────────────────────┐
│         Docker Container            │
│  ┌─────────────────────────────┐   │
│  │     node:18-alpine          │   │
│  │  ┌───────────────────────┐  │   │
│  │  │      npm install      │  │   │
│  │  │      npm start        │  │   │
│  │  │    (node server.js)   │  │   │
│  │  └───────────────────────┘  │   │
│  │           Port 3001         │   │
│  └─────────────────────────────┘   │
│  Health Check: /health @ 30s       │
└─────────────────────────────────────┘
```

### Docker Compose Network

```
┌─────────────────────────────────────────────────┐
│              pokemon-network                     │
│                                                  │
│  ┌──────────────────┐    ┌──────────────────┐  │
│  │ pokemon-frontend │    │ pokemon-backend  │  │
│  │   (nginx:80)     │───▶│   (node:3001)    │  │
│  │   Port: 3002     │    │   Port: 3001     │  │
│  └──────────────────┘    └──────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

## File Structure Analysis

```
pokemon-backend/
│
├── server.js                 # APPLICATION CORE
│   ├── Express app setup     # Framework initialization
│   ├── Middleware config     # CORS + JSON parsing
│   ├── Mock data store       # In-memory Pokemon array
│   └── Route handlers        # API endpoint logic
│
├── package.json              # DEPENDENCY MANIFEST
│   ├── express ^4.18.2       # Web framework
│   ├── cors ^2.8.5           # CORS middleware
│   └── nodemon ^3.0.1 (dev)  # Hot-reload for development
│
├── .tr-codegen/              # DEPLOYMENT CONFIG
│   ├── Dockerfile            # Container definition
│   └── docker-compose.yml    # Service orchestration
│
├── .gitignore                # SOURCE CONTROL
│   └── node_modules, logs, env files excluded
│
└── README.md                 # DOCUMENTATION
    └── Setup, usage, API reference
```

## Design Decisions

### 1. Single-File Architecture

**Decision**: All code in `server.js`
**Rationale**:
- Simple application with 4 endpoints
- No complex business logic
- Fast to understand and modify
- Suitable for small-scale APIs

### 2. Mock Data vs Database

**Decision**: In-memory array
**Rationale**:
- Demo/prototype application
- No persistence requirements
- Zero configuration needed
- Easy to extend with real database later

### 3. Response Wrapper Pattern

**Decision**: All responses wrapped with `{success, data/message}`
**Rationale**:
- Consistent API contract
- Easy error handling on frontend
- Clear success/failure indication

## Extension Points

### Adding a Database

Replace mock array with:
```javascript
// Example with MongoDB
const mongoose = require('mongoose');
const Pokemon = require('./models/Pokemon');

app.get('/api/pokemons', async (req, res) => {
  const pokemons = await Pokemon.find(filters);
  res.json({ success: true, data: pokemons });
});
```

### Adding Authentication

Insert middleware before routes:
```javascript
const authMiddleware = (req, res, next) => {
  // Validate token
  next();
};
app.use('/api', authMiddleware);
```

### Scaling Considerations

For production scale:
1. Move to controller/service pattern
2. Add database with connection pooling
3. Implement caching layer (Redis)
4. Add rate limiting
5. Enable clustering or container orchestration

## Security Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| CORS | Allow all origins | Restrict to known domains |
| Input Validation | Basic | Add input sanitization |
| Rate Limiting | None | Add express-rate-limit |
| HTTPS | Not configured | Use reverse proxy with SSL |
| Authentication | None | Add JWT or API keys if needed |

## Performance Characteristics

- **Startup Time**: ~100ms (minimal dependencies)
- **Memory Footprint**: ~50MB (Node.js baseline)
- **Response Time**: <10ms (in-memory data)
- **Concurrent Connections**: Limited by Node.js event loop

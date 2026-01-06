# Architecture Overview - Pokemon Backend

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           POKEMON BACKEND SERVICE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Express.js Server                            │   │
│  │                         (server.js)                                  │   │
│  │                                                                      │   │
│  │   ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │   │
│  │   │  Middleware  │    │    Routes    │    │    Data Layer        │  │   │
│  │   │              │    │              │    │                      │  │   │
│  │   │  - CORS      │───▶│  /health     │───▶│  mockPokemons[]     │  │   │
│  │   │  - JSON      │    │  /api/pokemons│   │  (In-Memory Array)  │  │   │
│  │   │              │    │  /api/types  │    │                      │  │   │
│  │   └──────────────┘    └──────────────┘    └──────────────────────┘  │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Port: 3001 (configurable via PORT env)                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP/REST
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐    ┌─────────────────────┐                        │
│  │  Pokemon Frontend   │    │   Other API Clients │                        │
│  │  (React App)        │    │   (curl, Postman)   │                        │
│  │  Port: 3000         │    │                     │                        │
│  └─────────────────────┘    └─────────────────────┘                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Request/Response Flow

```
┌──────────┐     ┌───────────────┐     ┌──────────────┐     ┌────────────────┐
│  Client  │────▶│   Middleware  │────▶│    Router    │────▶│  Route Handler │
│          │     │  (CORS, JSON) │     │              │     │                │
└──────────┘     └───────────────┘     └──────────────┘     └────────────────┘
                                                                     │
                                                                     │
     ┌───────────────────────────────────────────────────────────────┘
     │
     ▼
┌────────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│ Query Parsing  │────▶│   Filtering  │────▶│   Response   │────▶│  Client  │
│                │     │   Logic      │     │   Formation  │     │          │
└────────────────┘     └──────────────┘     └──────────────┘     └──────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GET /api/pokemons?type=fire                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. Parse Query Parameters                                                  │
│     • Extract: name, type, legendary                                        │
│     • req.query = { type: 'fire' }                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  2. Clone Source Data                                                       │
│     • filteredPokemons = [...mockPokemons]                                 │
│     • Preserves original data integrity                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  3. Apply Sequential Filters                                                │
│                                                                             │
│     ┌─────────────┐    ┌─────────────┐    ┌──────────────────┐            │
│     │ Name Filter │───▶│ Type Filter │───▶│ Legendary Filter │            │
│     │ (if name)   │    │ (if type)   │    │ (if legendary)   │            │
│     └─────────────┘    └─────────────┘    └──────────────────┘            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  4. Form Response                                                           │
│     {                                                                       │
│       success: true,                                                        │
│       count: 2,                                                             │
│       data: [{ id: 2, name: 'Charizard', ... }, { id: 9, name: 'Moltres' }]│
│     }                                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Single-File Monolithic Structure

```
server.js
├── Dependencies Import
│   ├── express
│   └── cors
│
├── Application Setup
│   ├── app = express()
│   ├── PORT configuration
│   └── Middleware registration
│
├── Data Layer
│   └── mockPokemons[] (in-memory array)
│
├── Route Handlers
│   ├── GET /health
│   ├── GET /api/pokemons
│   ├── GET /api/pokemons/:id
│   └── GET /api/types
│
└── Server Initialization
    └── app.listen()
```

## API Design

### RESTful Endpoint Structure

```
/
├── /health                    # Health monitoring
│
└── /api
    ├── /pokemons              # Pokemon collection
    │   ├── GET                # List with filters
    │   └── /:id
    │       └── GET            # Single resource
    │
    └── /types                 # Type enumeration
        └── GET                # List all types
```

### Response Schema

```
┌──────────────────────────────────────────────────────────────┐
│                    Standard Response                         │
├──────────────────────────────────────────────────────────────┤
│  Success Response:                                           │
│  {                                                           │
│    "success": true,                                          │
│    "count": number,        // Optional: for collections      │
│    "data": object | array  // Resource data                  │
│  }                                                           │
├──────────────────────────────────────────────────────────────┤
│  Error Response:                                             │
│  {                                                           │
│    "success": false,                                         │
│    "message": string       // Human-readable error           │
│  }                                                           │
└──────────────────────────────────────────────────────────────┘
```

## Docker Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Docker Container                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Base Image: node:18-alpine                                               │
│                                                                             │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │  /app                                                              │    │
│   │   ├── node_modules/                                               │    │
│   │   ├── server.js                                                   │    │
│   │   ├── package.json                                                │    │
│   │   └── package-lock.json                                           │    │
│   └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│   Exposed Port: 3001                                                       │
│   Health Check: curl http://localhost:3001/health                          │
│   Command: npm start                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ Port mapping (-p 3001:3001)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Host Machine                                   │
│                           localhost:3001                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Network Architecture (Docker Compose)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          pokemon-network (bridge)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────┐                                      │
│   │    main_app_pokemon-backend     │                                      │
│   │    (pokemon-backend container)  │                                      │
│   │                                 │                                      │
│   │    Internal: 3001               │                                      │
│   │    External: localhost:3001     │                                      │
│   └─────────────────────────────────┘                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Model

### Pokemon Entity

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              Pokemon                                        │
├────────────────────────────────────────────────────────────────────────────┤
│  id: number          │  Unique identifier (1-12)                           │
│  name: string        │  Pokemon name (e.g., "Pikachu")                     │
│  type: string[]      │  Array of types (e.g., ["Electric"])                │
│  legendary: boolean  │  Legendary status flag                              │
│  image: string       │  URL to PokeAPI sprite                              │
└────────────────────────────────────────────────────────────────────────────┘
```

### Type Values

```
┌──────────────────────────────────────────────────────────────┐
│  Available Types (derived from Pokemon data)                 │
├──────────────────────────────────────────────────────────────┤
│  Dragon, Electric, Fire, Flying, Grass, Ice,                │
│  Poison, Psychic, Water                                      │
└──────────────────────────────────────────────────────────────┘
```

## Security Considerations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Security Architecture                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Current Implementation:                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • CORS: Enabled for all origins (permissive)                       │   │
│  │  • Authentication: None                                              │   │
│  │  • Input Validation: Basic (query params only)                      │   │
│  │  • Rate Limiting: None                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Production Recommendations:                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Implement CORS whitelist for specific origins                    │   │
│  │  • Add helmet.js for security headers                               │   │
│  │  • Implement rate limiting (express-rate-limit)                     │   │
│  │  • Add request validation middleware (Joi/express-validator)        │   │
│  │  • Enable HTTPS/TLS                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Scalability Path

```
Current State                    Future State
─────────────────────────────────────────────────────────────────────────────

┌───────────────┐               ┌────────────────────────────────────────┐
│  Single       │               │  Scalable Architecture                 │
│  server.js    │     ───▶      │                                        │
│               │               │  ┌──────────┐  ┌──────────────────┐   │
│  In-Memory    │               │  │  Routes  │  │  Controllers     │   │
│  Data         │               │  └──────────┘  └──────────────────┘   │
│               │               │        │              │               │
│               │               │        ▼              ▼               │
│               │               │  ┌──────────────────────────────┐    │
│               │               │  │       Service Layer           │    │
│               │               │  └──────────────────────────────┘    │
│               │               │               │                       │
│               │               │               ▼                       │
│               │               │  ┌──────────────────────────────┐    │
│               │               │  │       Data Layer              │    │
│               │               │  │  (MongoDB/PostgreSQL)         │    │
│               │               │  └──────────────────────────────┘    │
└───────────────┘               └────────────────────────────────────────┘
```

## Directory Structure Analysis

```
pokemon-backend/
│
├── server.js                 # CORE: Main application entry point
│                             # Contains all routes, middleware, and data
│                             # Lines: ~167, Single responsibility violation
│                             # Recommendation: Split into modules
│
├── package.json              # CONFIG: NPM package definition
│                             # Dependencies: express, cors
│                             # Dev dependencies: nodemon
│                             # Scripts: start, dev, docker:build, docker:run
│
├── .gitignore                # CONFIG: Git exclusion rules
│                             # Excludes: node_modules, .env files, IDE files
│
├── README.md                 # DOC: Project documentation
│                             # Contains: Setup, API docs, examples
│
└── .tr-codegen/              # INFRA: Container configuration
    │
    ├── Dockerfile            # Docker image definition
    │                         # Base: node:18-alpine
    │                         # Includes health check
    │
    └── docker-compose.yml    # Multi-container orchestration
                              # Service: main_app_pokemon-backend
                              # Network: pokemon-network
```

## Integration Points

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Integration Architecture                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   External Services:                                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  PokeAPI Sprites CDN                                                 │  │
│   │  https://raw.githubusercontent.com/PokeAPI/sprites/...              │  │
│   │                                                                      │  │
│   │  Purpose: Pokemon sprite images                                      │  │
│   │  Usage: Stored as URLs in mockPokemons array                        │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   Internal Services:                                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  Pokemon Frontend (React)                                            │  │
│   │  http://localhost:3000                                               │  │
│   │                                                                      │  │
│   │  Endpoints consumed:                                                 │  │
│   │  - GET /api/pokemons (list and filter)                              │  │
│   │  - GET /api/types (populate filter dropdown)                        │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Error Handling Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Error Handling                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Current Implementation:                                                    │
│                                                                             │
│  ┌──────────────────┐     ┌────────────────────────────────────────────┐  │
│  │  404 Not Found   │────▶│  { success: false, message: "..." }        │  │
│  │  (Pokemon by ID) │     │  HTTP Status: 404                          │  │
│  └──────────────────┘     └────────────────────────────────────────────┘  │
│                                                                             │
│  Missing Error Handlers (TODO):                                             │
│  • Global error middleware                                                  │
│  • Async error wrapper                                                      │
│  • Validation error handling                                                │
│  • 500 Internal Server Error handler                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Performance Characteristics

| Aspect | Current State | Notes |
|--------|---------------|-------|
| Data Storage | In-memory array | O(1) access, O(n) filter |
| Filtering | Sequential | Each filter is O(n) |
| Concurrency | Single-threaded | Node.js event loop |
| Caching | None | All data in memory anyway |
| Response Time | <10ms | Minimal processing |

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Deployment Options                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Option 1: Local Development                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  npm run dev  ──▶  nodemon server.js  ──▶  http://localhost:3001   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Option 2: Docker Standalone                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  docker build  ──▶  docker run  ──▶  http://localhost:3001         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Option 3: Docker Compose (Full Stack)                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  docker-compose up  ──▶  Backend + Frontend  ──▶  Network linked   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

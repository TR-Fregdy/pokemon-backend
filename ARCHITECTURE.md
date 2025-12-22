# Architecture Overview - Pokemon Backend API

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Pokemon Backend API                          │
│                        (Node.js/Express)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     server.js                             │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │              Middleware Layer                        │ │   │
│  │  │  ┌──────────────┐  ┌──────────────────────────┐    │ │   │
│  │  │  │    CORS      │  │    JSON Body Parser      │    │ │   │
│  │  │  └──────────────┘  └──────────────────────────┘    │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                            │                              │   │
│  │                            ▼                              │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │                  Route Handlers                      │ │   │
│  │  │  ┌────────────┐ ┌─────────────────┐ ┌────────────┐ │ │   │
│  │  │  │  /health   │ │  /api/pokemons  │ │ /api/types │ │ │   │
│  │  │  └────────────┘ └─────────────────┘ └────────────┘ │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                            │                              │   │
│  │                            ▼                              │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │               In-Memory Data Store                   │ │   │
│  │  │                  mockPokemons[]                      │ │   │
│  │  │  (12 Pokemon with id, name, type, legendary, image)  │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/JSON
                              ▼
                    ┌─────────────────┐
                    │  Frontend App   │
                    │  (React Client) │
                    └─────────────────┘
```

## Directory Structure

```
pokemon-backend/
├── server.js              # Main application (all code here)
├── package.json           # Dependencies and scripts
├── .gitignore             # Git ignore rules
├── README.md              # Project documentation
└── .tr-codegen/           # Docker deployment configs
    ├── Dockerfile         # Container build instructions
    └── docker-compose.yml # Container orchestration
```

## Request Flow

```
┌──────────┐    HTTP Request    ┌─────────────┐    ┌──────────────┐
│  Client  │ ─────────────────► │   Express   │───►│   Middleware │
│          │                    │   Server    │    │  (CORS/JSON) │
└──────────┘                    └─────────────┘    └──────────────┘
                                                          │
                                                          ▼
┌──────────┐    JSON Response   ┌─────────────┐    ┌──────────────┐
│  Client  │ ◄───────────────── │   Route     │◄───│  Data Filter │
│          │                    │   Handler   │    │   Logic      │
└──────────┘                    └─────────────┘    └──────────────┘
```

## API Endpoint Architecture

### GET /health
```
Request  ──► Health Check Handler ──► { status: 'OK' }
```

### GET /api/pokemons
```
Request with Query Params
        │
        ▼
┌───────────────────┐
│  Parse Filters    │
│  (name, type,     │
│   legendary)      │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Apply Filters    │
│  to mockPokemons  │
│  Array            │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Return Filtered  │
│  Results + Count  │
└───────────────────┘
```

### GET /api/pokemons/:id
```
Request with ID Param
        │
        ▼
┌───────────────────┐
│  Find Pokemon by  │
│  ID in Array      │
└───────────────────┘
        │
        ├──► Found: Return Pokemon
        │
        └──► Not Found: 404 Error
```

### GET /api/types
```
Request ──► Extract Unique Types from Data ──► Return Sorted Types
```

## Data Model

```
Pokemon Object
┌─────────────────────────────────────┐
│ id: number                          │
│ name: string                        │
│ type: string[]                      │
│ legendary: boolean                  │
│ image: string (URL)                 │
└─────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────┐
│              Application Layer               │
│  ┌───────────────────────────────────────┐  │
│  │           Express.js ^4.18.2          │  │
│  │      (HTTP Server & Routing)          │  │
│  └───────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│              Middleware Layer                │
│  ┌─────────────┐    ┌─────────────────────┐ │
│  │ cors ^2.8.5 │    │ express.json()      │ │
│  │ (CORS)      │    │ (Body Parsing)      │ │
│  └─────────────┘    └─────────────────────┘ │
├─────────────────────────────────────────────┤
│              Runtime Layer                   │
│  ┌───────────────────────────────────────┐  │
│  │           Node.js 18+                 │  │
│  └───────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│              Container Layer                 │
│  ┌───────────────────────────────────────┐  │
│  │         Docker (node:18-alpine)       │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│              Docker Container                │
│  ┌───────────────────────────────────────┐  │
│  │         node:18-alpine                │  │
│  │                                        │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │        Pokemon Backend          │  │  │
│  │  │       (Express Server)          │  │  │
│  │  │                                  │  │  │
│  │  │   Port: 3001 (internal)         │  │  │
│  │  └─────────────────────────────────┘  │  │
│  │                                        │  │
│  │  Health Check: GET /health            │  │
│  │  Interval: 30s, Timeout: 3s           │  │
│  └───────────────────────────────────────┘  │
│                    │                         │
│                    │ :3001                   │
└────────────────────┼─────────────────────────┘
                     │
                     ▼ :3001
              ┌──────────────┐
              │    Host      │
              └──────────────┘
```

## Key Design Decisions

1. **Single-File Architecture**: All logic in `server.js` for simplicity
2. **In-Memory Data**: No database for easy setup and demonstration
3. **RESTful API**: Standard HTTP methods and JSON responses
4. **Stateless**: No sessions, each request is independent
5. **CORS Enabled**: Allows cross-origin requests from any domain
6. **Health Endpoint**: Supports container orchestration health checks

## Integration Points

| Component | Integration | Protocol |
|-----------|-------------|----------|
| Frontend | React app consumes API | HTTP/JSON |
| Docker | Container health checks | HTTP GET /health |
| External | PokeAPI sprite images | HTTPS (image URLs) |

## Scalability Considerations

- **Current**: Single instance, in-memory data
- **Future Database**: Would need to add database driver and connection pool
- **Future Scaling**: Would need external data store for horizontal scaling
- **Caching**: Could add Redis for response caching

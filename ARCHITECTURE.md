# Architecture Overview - Pokemon Backend API

## System Overview

The Pokemon Backend is a lightweight RESTful API service built with Node.js and Express.js. It provides Pokemon data with filtering capabilities for the companion frontend application.

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUESTS                              │
│                    (Frontend / cURL / Postman)                       │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         EXPRESS SERVER                               │
│                        (Port 3001)                                   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐                                   │
│  │    CORS     │  │    JSON     │         MIDDLEWARE LAYER          │
│  │  Middleware │  │   Parser    │                                   │
│  └─────────────┘  └─────────────┘                                   │
├─────────────────────────────────────────────────────────────────────┤
│                          ROUTING LAYER                               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  GET /health           → Health Check Handler                 │   │
│  │  GET /api/pokemons     → List Pokemon Handler (with filters)  │   │
│  │  GET /api/pokemons/:id → Get Pokemon by ID Handler            │   │
│  │  GET /api/types        → List Types Handler                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│                          DATA LAYER                                  │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    In-Memory Mock Data                        │   │
│  │                   (mockPokemons Array)                        │   │
│  │                      12 Pokemon                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Entry Point (`server.js`)

The entire application is contained in a single file with the following sections:

```
server.js
├── Dependencies Import
├── Express App Initialization
├── Middleware Configuration
│   ├── CORS (cross-origin requests)
│   └── JSON Parser (request body)
├── Mock Data Definition
│   └── mockPokemons array (12 Pokemon)
├── Route Handlers
│   ├── /health - Health check
│   ├── /api/pokemons - List with filtering
│   ├── /api/pokemons/:id - Single Pokemon
│   └── /api/types - Unique types list
└── Server Startup
```

### 2. Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Request   │────▶│ Middleware  │────▶│   Router    │────▶│   Handler   │
│   (HTTP)    │     │ (CORS/JSON) │     │  (Express)  │     │  (Logic)    │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                   │
                                                                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────────────────────────┐
│  Response   │◀────│   Format    │◀────│      Query Mock Data Array      │
│   (JSON)    │     │  (JSON)     │     │   (Filter by name/type/legend)  │
└─────────────┘     └─────────────┘     └─────────────────────────────────┘
```

## Request/Response Lifecycle

### GET /api/pokemons (with filters)

```
1. HTTP Request arrives with query params
   └─▶ ?name=pika&type=electric&legendary=false

2. Express parses query parameters
   └─▶ req.query = { name: 'pika', type: 'electric', legendary: 'false' }

3. Handler clones mock data array
   └─▶ filteredPokemons = [...mockPokemons]

4. Apply filters sequentially:
   a. Name filter (case-insensitive includes)
   b. Type filter (case-insensitive exact match)
   c. Legendary filter (boolean comparison)

5. Build response object:
   └─▶ { success: true, count: N, data: [...] }

6. Send JSON response
```

## API Design

### RESTful Principles

- **Resource-based URLs**: `/api/pokemons`, `/api/types`
- **HTTP Methods**: GET only (read-only API)
- **Stateless**: No session management
- **Consistent Response Format**: All responses follow the same structure

### Response Structure

```javascript
// Success Response
{
  "success": true,
  "count": 12,        // List endpoints only
  "data": [...]       // Array or Object
}

// Error Response
{
  "success": false,
  "message": "Pokemon not found"
}
```

## Deployment Architecture

### Docker Configuration

```
┌─────────────────────────────────────────────────────────────────┐
│                    Docker Container                              │
│                   (node:18-alpine)                               │
├─────────────────────────────────────────────────────────────────┤
│  Working Directory: /app                                         │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Node.js Process                               │  │
│  │                                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │           Express Server (Port 3001)                 │  │  │
│  │  │                                                      │  │  │
│  │  │  • CORS enabled                                      │  │  │
│  │  │  • JSON parsing                                      │  │  │
│  │  │  • 4 API endpoints                                   │  │  │
│  │  │  • In-memory data                                    │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Health Check: curl http://localhost:3001/health                 │
│  Interval: 30s | Timeout: 3s | Retries: 3                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    Host Port: 3001
```

### Docker Compose Network

```
┌─────────────────────────────────────────────────────────────────┐
│                    pokemon-network (bridge)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────┐                                    │
│  │   pokemon-backend       │                                    │
│  │   (main_app_pokemon)    │                                    │
│  │   Port: 3001            │                                    │
│  │   Health: /health       │                                    │
│  └─────────────────────────┘                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Integration with Frontend

```
┌─────────────────────┐         HTTP         ┌─────────────────────┐
│                     │                       │                     │
│   Pokemon Frontend  │◀─────────────────────▶│   Pokemon Backend   │
│   (React App)       │                       │   (Express API)     │
│   Port: 3000        │                       │   Port: 3001        │
│                     │                       │                     │
│   • Fetch Pokemon   │  GET /api/pokemons   │   • Return Pokemon  │
│   • Fetch Types     │  GET /api/types      │   • Return Types    │
│   • Apply Filters   │  ?name=&type=&legend │   • Filter Data     │
│                     │                       │                     │
└─────────────────────┘                       └─────────────────────┘
```

## Scalability Considerations

### Current Limitations

1. **In-memory data**: Data resets on server restart
2. **Single-file architecture**: All logic in one file
3. **No caching**: Every request queries the full dataset
4. **No authentication**: Open API access

### Future Architecture (if scaling needed)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Potential Future Architecture                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Routes/    │───▶│  Controllers │───▶│   Services   │       │
│  │   Router     │    │              │    │              │       │
│  └──────────────┘    └──────────────┘    └──────┬───────┘       │
│                                                  │               │
│                                                  ▼               │
│                                          ┌──────────────┐       │
│                                          │   Models/    │       │
│                                          │  Repository  │       │
│                                          └──────┬───────┘       │
│                                                  │               │
│                                                  ▼               │
│                                          ┌──────────────┐       │
│                                          │   Database   │       │
│                                          │ (PostgreSQL/ │       │
│                                          │   MongoDB)   │       │
│                                          └──────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

## Security Notes

- CORS is configured to accept all origins (development mode)
- No input sanitization beyond basic query parsing
- No rate limiting implemented
- No authentication/authorization layer

## Performance Characteristics

- **Cold start**: Fast (~500ms due to minimal dependencies)
- **Response time**: <10ms (in-memory data)
- **Memory footprint**: Low (~50MB)
- **Concurrent connections**: Limited by Node.js default (varies by system)

## Testing Strategy

Currently no automated tests are implemented. Recommended testing approach:

1. **Unit tests**: Test filtering logic in isolation
2. **Integration tests**: Test API endpoints with supertest
3. **Load tests**: Test concurrent connections with artillery/k6

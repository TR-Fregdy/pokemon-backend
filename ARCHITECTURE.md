# Architecture Overview - Pokemon Backend

This document provides a comprehensive architectural overview of the Pokemon Backend API.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Directory Structure](#directory-structure)
- [Request Lifecycle](#request-lifecycle)
- [Data Architecture](#data-architecture)
- [API Design](#api-design)
- [Deployment Architecture](#deployment-architecture)

## System Overview

The Pokemon Backend is a lightweight REST API server that provides Pokemon data filtering capabilities. It follows a monolithic architecture pattern optimized for simplicity and rapid development.

### Key Characteristics

| Aspect | Implementation |
|--------|----------------|
| Architecture Style | Monolithic REST API |
| Data Storage | In-Memory (Mock Data) |
| Authentication | None (Public API) |
| Protocol | HTTP/JSON |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       Pokemon Backend                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     server.js                               │ │
│  │                                                             │ │
│  │  ┌─────────────┐   ┌─────────────┐   ┌─────────────────┐   │ │
│  │  │   Express   │──▶│  Middleware │──▶│     Routes      │   │ │
│  │  │    App      │   │  - CORS     │   │  - /health      │   │ │
│  │  │             │   │  - JSON     │   │  - /api/pokemons│   │ │
│  │  └─────────────┘   └─────────────┘   │  - /api/types   │   │ │
│  │                                       └────────┬────────┘   │ │
│  │                                                │             │ │
│  │                                       ┌────────▼────────┐   │ │
│  │                                       │   Mock Data     │   │ │
│  │                                       │  (In-Memory)    │   │ │
│  │                                       │  mockPokemons[] │   │ │
│  │                                       └─────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Port: 3001                                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
pokemon-backend/
├── server.js              # [CORE] Main application entry point
├── package.json           # [CONFIG] Dependencies and scripts
├── .gitignore             # [CONFIG] Git exclusion rules
├── README.md              # [DOCS] Project documentation
└── .tr-codegen/           # [DEPLOY] Docker deployment configs
    ├── Dockerfile         # Container build instructions
    └── docker-compose.yml # Service orchestration
```

### File Responsibilities

| File | Layer | Responsibility |
|------|-------|----------------|
| `server.js` | Application | Express app, routes, middleware, data |
| `package.json` | Configuration | Dependencies, npm scripts |
| `.tr-codegen/Dockerfile` | Infrastructure | Container definition |
| `.tr-codegen/docker-compose.yml` | Infrastructure | Service orchestration |

## Request Lifecycle

```
Client Request
      │
      ▼
┌─────────────────┐
│  Express App    │
│  (server.js)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CORS Middleware│──▶ Adds CORS headers
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JSON Parser    │──▶ Parses request body
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Route Handler  │──▶ /health, /api/pokemons, /api/types
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Data Filtering │──▶ Filter mockPokemons array
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JSON Response  │──▶ { success, count, data }
└─────────────────┘
```

## Data Architecture

### Pokemon Data Model

```javascript
Pokemon {
  id: number,           // Primary identifier
  name: string,         // Display name
  type: string[],       // Type array (1-2 types)
  legendary: boolean,   // Legendary flag
  image: string         // Sprite URL (PokeAPI)
}
```

### Data Store

- **Type**: In-memory JavaScript array
- **Size**: 12 Pokemon records
- **Persistence**: None (resets on restart)
- **Access**: Read-only (no mutations)

### Available Pokemon Types

| Regular | Legendary |
|---------|-----------|
| Pikachu | Mewtwo |
| Charizard | Mew |
| Blastoise | Articuno |
| Venusaur | Zapdos |
| Gyarados | Moltres |
| Dragonite | |
| Alakazam | |

## API Design

### REST Endpoints

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| GET | `/health` | Health check | `{ status, message }` |
| GET | `/api/pokemons` | List with filters | `{ success, count, data }` |
| GET | `/api/pokemons/:id` | Single Pokemon | `{ success, data }` |
| GET | `/api/types` | Unique types | `{ success, data }` |

### Filtering Logic

```
/api/pokemons?name=pika&type=electric&legendary=false

1. Start with full mockPokemons array
2. If name param → filter by name.includes(param)
3. If type param → filter by type.includes(param)
4. If legendary param → filter by legendary === param
5. Return filtered results
```

### Error Handling

| Status | Condition | Response |
|--------|-----------|----------|
| 200 | Success | `{ success: true, data: [...] }` |
| 404 | Pokemon not found | `{ success: false, message: '...' }` |

## Deployment Architecture

### Docker Container

```
┌─────────────────────────────────────┐
│       Docker Container              │
│       (node:18-alpine)              │
│                                     │
│  ┌───────────────────────────────┐  │
│  │        /app                   │  │
│  │  ├── server.js                │  │
│  │  ├── package.json             │  │
│  │  └── node_modules/            │  │
│  └───────────────────────────────┘  │
│                                     │
│  EXPOSE: 3001                       │
│  HEALTHCHECK: /health               │
│  CMD: npm start                     │
└─────────────────────────────────────┘
```

### Docker Compose Network

```
┌─────────────────────────────────────────────┐
│          pokemon-network (bridge)           │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │     main_app_pokemon-backend          │  │
│  │     Port: 3001:3001                   │  │
│  │     Health: /health                   │  │
│  │     Restart: unless-stopped           │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Design Decisions

### Why Monolithic Single-File?

- **Simplicity**: Small API surface, no complex routing needs
- **Rapid Development**: Easy to understand and modify
- **Demo Purpose**: Appropriate for mock data application

### Why In-Memory Data?

- **No Database Overhead**: Faster response times
- **Simplicity**: No connection pooling or ORM
- **Demo Data**: Static dataset doesn't require persistence

### Why Express.js?

- **Industry Standard**: Well-documented and stable
- **Minimal**: Lightweight for simple API needs
- **Middleware Pattern**: Easy to extend with CORS, auth, etc.

## Future Considerations

When scaling this application, consider:

1. **Database Integration**: Replace mock data with MongoDB/PostgreSQL
2. **Route Separation**: Split routes into separate files
3. **Model Layer**: Add Mongoose schemas or Sequelize models
4. **Validation**: Add request validation middleware (Joi/Yup)
5. **Authentication**: Add JWT or OAuth2 middleware
6. **Testing**: Add Jest with Supertest for integration tests
7. **Logging**: Add Winston or Pino for structured logging
8. **Caching**: Add Redis for response caching

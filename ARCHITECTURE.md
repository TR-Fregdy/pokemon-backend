# Architecture Overview - Pokemon Backend

This document provides a comprehensive overview of the Pokemon Backend API architecture.

## System Overview

The Pokemon Backend is a lightweight RESTful API built with Node.js and Express.js. It serves as the data layer for the Pokemon Explorer application, providing endpoints for querying and filtering Pokemon data.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Pokemon Backend API                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐   │
│  │   Express   │───>│  Middleware  │───>│  Route Handlers │   │
│  │   Server    │    │  (CORS,JSON) │    │                 │   │
│  └─────────────┘    └──────────────┘    └─────────────────┘   │
│                                                   │             │
│                                                   v             │
│                                          ┌─────────────────┐   │
│                                          │   In-Memory     │   │
│                                          │   Mock Data     │   │
│                                          └─────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Architecture Pattern

### Monolithic Single-File Design

This project follows a **monolithic single-file architecture** where all application code resides in `server.js`. This pattern is appropriate for:

- Small APIs with limited endpoints
- Prototype/MVP applications
- Educational or demonstration projects
- Microservices with focused responsibility

### Request Flow

```
Client Request
      │
      v
┌─────────────────┐
│  Express App    │
│  (port 3001)    │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  CORS Middleware│──> Enables cross-origin requests
└────────┬────────┘
         │
         v
┌─────────────────┐
│ JSON Middleware │──> Parses JSON request bodies
└────────┬────────┘
         │
         v
┌─────────────────┐
│ Route Handler   │──> Processes request, applies filters
└────────┬────────┘
         │
         v
┌─────────────────┐
│ JSON Response   │──> Returns structured response
└─────────────────┘
```

## Component Breakdown

### Entry Point: server.js

The single source file contains:

| Section | Lines | Description |
|---------|-------|-------------|
| Dependencies | 1-3 | Import express and cors |
| Configuration | 4-8 | App initialization and middleware |
| Mock Data | 12-97 | In-memory Pokemon dataset |
| Routes | 99-162 | API endpoint handlers |
| Server Start | 164-166 | Listen on configured port |

### Data Layer

Data is stored as an in-memory JavaScript array (`mockPokemons`). This approach:

- Requires no database setup
- Resets on server restart
- Suitable for read-only demo applications

```javascript
// Data structure
const mockPokemons = [
  {
    id: number,
    name: string,
    type: string[],
    legendary: boolean,
    image: string
  },
  // ... more Pokemon
];
```

### API Design

The API follows REST conventions:

| Endpoint | Method | Resource | Action |
|----------|--------|----------|--------|
| `/health` | GET | System | Health check |
| `/api/pokemons` | GET | Pokemon | List/filter |
| `/api/pokemons/:id` | GET | Pokemon | Get by ID |
| `/api/types` | GET | Types | List unique |

## Integration Points

### Frontend Integration

The backend is designed to work with the Pokemon Frontend:

```
┌─────────────────┐     HTTP/REST      ┌─────────────────┐
│   React App     │◄──────────────────►│  Express API    │
│  (port 3000)    │                    │  (port 3001)    │
└─────────────────┘                    └─────────────────┘
```

CORS is enabled to allow cross-origin requests from the frontend development server.

### Docker Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Network                          │
│                                                             │
│  ┌─────────────────┐           ┌─────────────────────────┐ │
│  │  pokemon-backend│           │ Health Check            │ │
│  │  (node:18-alpine)│◄─────────│ curl /health every 30s  │ │
│  │  Port: 3001     │           │                         │ │
│  └─────────────────┘           └─────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Security Considerations

### Current Implementation

- CORS enabled (open policy)
- No authentication/authorization
- No rate limiting
- No input validation beyond basic type checking

### Production Recommendations

- Implement rate limiting
- Add input validation/sanitization
- Configure CORS for specific origins
- Add authentication if needed
- Use HTTPS in production

## Scalability

### Current Limitations

- Single process (no clustering)
- In-memory data (no persistence)
- No caching layer

### Scaling Path

For production scaling:

1. Add database (PostgreSQL, MongoDB)
2. Implement caching (Redis)
3. Use PM2 or cluster module
4. Add load balancer

## File Reference

| File | Purpose | Link |
|------|---------|------|
| `server.js` | Main application | Core API logic |
| `package.json` | Dependencies | NPM configuration |
| `.tr-codegen/Dockerfile` | Container | Docker image definition |
| `.tr-codegen/docker-compose.yml` | Orchestration | Container deployment |

## Development Guidelines

### Adding Features

1. Add new routes after existing ones in `server.js`
2. Follow existing response format patterns
3. Keep filtering logic in route handlers
4. Update API documentation in README

### Code Style

- Use `const` for constants, `let` for variables
- Arrow functions for callbacks
- Destructuring for query parameters
- Template literals for string interpolation

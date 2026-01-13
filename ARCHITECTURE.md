# Architecture Overview

This document provides a high-level architectural view of the Pokemon Backend API.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Pokemon Backend API                       │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │   Express    │───>│   Routes     │───>│   In-Memory      │   │
│  │   Server     │    │   Handler    │    │   Mock Data      │   │
│  └──────────────┘    └──────────────┘    └──────────────────┘   │
│         │                   │                                    │
│         v                   v                                    │
│  ┌──────────────┐    ┌──────────────┐                           │
│  │   CORS       │    │   JSON       │                           │
│  │   Middleware │    │   Response   │                           │
│  └──────────────┘    └──────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
         │
         │ HTTP/JSON
         v
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend Application                         │
│                    (Pokemon Frontend)                            │
└─────────────────────────────────────────────────────────────────┘
```

## Major Components

### 1. Express Server (`server.js`)

The main application entry point that:
- Initializes the Express application
- Configures middleware (CORS, JSON parsing)
- Defines all API routes
- Starts the HTTP server

### 2. Middleware Layer

- **CORS**: Enables cross-origin requests from the frontend
- **express.json()**: Parses incoming JSON request bodies

### 3. Routes

| Route | Purpose |
|-------|---------|
| `/health` | Container health check endpoint |
| `/api/pokemons` | Pokemon listing with filtering |
| `/api/pokemons/:id` | Single Pokemon retrieval |
| `/api/types` | Available Pokemon types |

### 4. Data Layer

- Mock data stored as an in-memory JavaScript array
- Contains 12 Pokemon entries with: id, name, type[], legendary, image
- No persistence - data resets on server restart

## Data Flow

```
┌────────────┐     ┌─────────────┐     ┌────────────┐     ┌────────────┐
│   Client   │────>│   Express   │────>│   Route    │────>│   Filter   │
│   Request  │     │   Server    │     │   Handler  │     │   Logic    │
└────────────┘     └─────────────┘     └────────────┘     └────────────┘
                                                                │
                                                                v
┌────────────┐     ┌─────────────┐                       ┌────────────┐
│   JSON     │<────│   Response  │<──────────────────────│   Mock     │
│   Response │     │   Builder   │                       │   Data     │
└────────────┘     └─────────────┘                       └────────────┘
```

### Request Lifecycle

1. **Request Received**: Express receives HTTP request
2. **Middleware Processing**: CORS headers applied, JSON body parsed
3. **Route Matching**: Request matched to appropriate handler
4. **Filter Application**: Query parameters applied to mock data
5. **Response Formation**: JSON response with success flag and data
6. **Response Sent**: HTTP response returned to client

## Key Architectural Decisions

### 1. Single-File Architecture

All application logic resides in `server.js` for simplicity. This is appropriate for a small API with limited functionality.

**Trade-offs**:
- (+) Easy to understand and maintain
- (+) No complex module dependencies
- (-) Not scalable for larger applications
- (-) Testing individual components is harder

### 2. In-Memory Data Storage

Mock data is stored in a JavaScript array rather than a database.

**Trade-offs**:
- (+) No database setup required
- (+) Fast read operations
- (+) Simple deployment
- (-) No data persistence
- (-) No concurrent write safety
- (-) Data loss on restart

### 3. Stateless Design

No session management or authentication.

**Trade-offs**:
- (+) Simple horizontal scaling
- (+) Easy to containerize
- (-) No user-specific features
- (-) No rate limiting

### 4. CORS Permissive Configuration

All origins are allowed by default.

**Trade-offs**:
- (+) Easy frontend integration
- (-) Less secure in production

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Docker Container                       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │               Node.js 18 Alpine                    │ │
│  │                                                    │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │            Express Application               │ │ │
│  │  │                 (Port 3001)                  │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Health Check: GET /health every 30s                    │
└─────────────────────────────────────────────────────────┘
```

## Dependencies Between Modules

This is a single-module application. The only external dependencies are:

- **express**: Web framework
- **cors**: CORS middleware

## Future Scalability Considerations

If the application needs to scale:

1. **Database Integration**: Replace mock data with MongoDB or PostgreSQL
2. **Route Modularization**: Split routes into separate files
3. **Controller Pattern**: Separate business logic from route handlers
4. **Caching Layer**: Add Redis for caching frequent queries
5. **Authentication**: Add JWT or session-based auth
6. **Rate Limiting**: Add express-rate-limit middleware

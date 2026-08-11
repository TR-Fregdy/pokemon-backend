# Architecture - Pokemon Backend

## High-Level Overview

The Pokemon Backend is a lightweight REST API built with Node.js and Express. It serves as the data provider for the Pokemon Explorer frontend application.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Pokemon Backend                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐  │
│  │   Express   │────>│  Middleware │────>│   Route         │  │
│  │   Server    │     │  (CORS,JSON)│     │   Handlers      │  │
│  └─────────────┘     └─────────────┘     └────────┬────────┘  │
│                                                    │            │
│                                          ┌────────▼────────┐   │
│                                          │   Mock Data     │   │
│                                          │   (In-Memory)   │   │
│                                          └─────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## System Architecture

### Request Flow

```
Client Request
      │
      ▼
┌──────────────┐
│ Express App  │
│  (port 3001) │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ CORS         │ ← Enables cross-origin requests from frontend
│ Middleware   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ JSON Parser  │ ← Parses incoming JSON payloads
│ Middleware   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Route        │ ← Matches URL to handler
│ Handler      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Data         │ ← Filters mock data based on query params
│ Processing   │
└──────┬───────┘
       │
       ▼
   JSON Response
```

## Major Components

### 1. Express Server (`server.js`)

The single entry point containing all application logic:

- **Server Configuration**: Port binding, middleware setup
- **Mock Data Store**: In-memory array of Pokemon objects
- **Route Handlers**: API endpoint implementations
- **Filtering Logic**: Query parameter processing

### 2. Middleware Stack

| Middleware | Purpose |
|------------|---------|
| `cors()` | Allows requests from different origins (frontend) |
| `express.json()` | Parses JSON request bodies |

### 3. Data Model

Pokemon objects follow this structure:

```javascript
{
  id: number,        // Unique identifier
  name: string,      // Pokemon name
  type: string[],    // Array of type names
  legendary: boolean,// Legendary status
  image: string      // URL to sprite image
}
```

## Data Flow

### GET /api/pokemons (with filters)

```
1. Request arrives with query params (?name=X&type=Y&legendary=Z)
           │
           ▼
2. Clone mock data array
           │
           ▼
3. Apply name filter (case-insensitive partial match)
           │
           ▼
4. Apply type filter (case-insensitive exact match)
           │
           ▼
5. Apply legendary filter (boolean comparison)
           │
           ▼
6. Return filtered array with count
```

### GET /api/pokemons/:id

```
1. Parse ID from URL parameter
           │
           ▼
2. Find Pokemon in mock array by ID
           │
           ├── Found: Return Pokemon object
           │
           └── Not Found: Return 404 error
```

## Key Architectural Decisions

### 1. Single-File Architecture

**Decision**: All code in `server.js`

**Rationale**:
- Simple application with limited scope
- Easy to understand and maintain
- No need for complex project structure

### 2. In-Memory Mock Data

**Decision**: No database, data stored in JavaScript array

**Rationale**:
- Demonstration/prototype application
- No persistence requirements
- Zero database setup/configuration

### 3. Client-Side Filtering Duplication

**Decision**: Frontend can filter locally; backend provides filtering too

**Rationale**:
- Supports both server-side and client-side filtering approaches
- Reduces network requests when data set is small
- Provides API flexibility for future growth

## Dependencies Between Modules

Since this is a single-file application, there are no module dependencies. All logic is contained within `server.js`.

## External Integrations

### PokeAPI (Indirect)

The mock data references Pokemon sprite images from the PokeAPI GitHub repository:
- Base URL: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/`
- Used for Pokemon image URLs only

### Frontend Integration

- **Expected Consumer**: Pokemon Frontend (React application)
- **Communication**: HTTP REST API over port 3001
- **CORS Policy**: Allows all origins

## Deployment Architecture

### Docker Deployment

```
┌────────────────────────────────────────┐
│           Docker Container             │
│                                        │
│  ┌─────────────────────────────────┐  │
│  │     Node.js 18 Alpine           │  │
│  │                                  │  │
│  │  ┌─────────────────────────┐    │  │
│  │  │     server.js           │    │  │
│  │  │    (Express App)        │    │  │
│  │  │                         │    │  │
│  │  │    Port 3001 ───────────┼────┼──┼──> External
│  │  └─────────────────────────┘    │  │
│  └─────────────────────────────────┘  │
│                                        │
│  Health Check: GET /health             │
│  Interval: 30s                         │
└────────────────────────────────────────┘
```

## Scaling Considerations

Current architecture supports:
- **Horizontal Scaling**: Multiple container instances (stateless)
- **Load Balancing**: No sticky sessions required

Limitations:
- **No Shared State**: Each instance has its own mock data
- **No Database**: Cannot persist changes across instances

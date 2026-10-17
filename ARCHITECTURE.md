# Pokemon Backend - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Pokemon Backend API                   │
│                   (Node.js + Express)                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         Express Application Server             │    │
│  │                                                 │    │
│  │  ┌──────────────────────────────────────────┐ │    │
│  │  │     Middleware Layer                     │ │    │
│  │  │  • CORS Handler                          │ │    │
│  │  │  • JSON Parser                           │ │    │
│  │  └──────────────────────────────────────────┘ │    │
│  │                    │                            │    │
│  │                    ▼                            │    │
│  │  ┌──────────────────────────────────────────┐ │    │
│  │  │     Route Handlers                       │ │    │
│  │  │  • GET /health                           │ │    │
│  │  │  • GET /api/pokemons                    │ │    │
│  │  │  • GET /api/pokemons/:id                │ │    │
│  │  │  • GET /api/types                       │ │    │
│  │  └──────────────────────────────────────────┘ │    │
│  │                    │                            │    │
│  │                    ▼                            │    │
│  │  ┌──────────────────────────────────────────┐ │    │
│  │  │     Data Layer                           │ │    │
│  │  │  • Mock Pokemon Array (12 objects)       │ │    │
│  │  │  • In-Memory Storage                     │ │    │
│  │  └──────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
         │                              │
         │ HTTP Requests               │ HTTP Responses
         │ (JSON)                      │ (JSON)
         │                             │
         ▼                             ▼
┌──────────────────────────────────────────────────────────┐
│         Frontend Application (React)                     │
│         Running on port 3000                             │
└──────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### 1. Express Application Server
- Initializes Express app and middleware
- Manages HTTP request/response cycle
- Handles routing and request dispatching

### 2. Middleware Layer
- **CORS**: Allows cross-origin requests from the frontend
- **JSON Parser**: Parses incoming JSON request bodies

### 3. Route Handlers
Each route implements specific business logic:

#### Health Check Handler
- **Endpoint**: `GET /health`
- **Purpose**: Monitoring and Docker health checks
- **Response**: `{status: 'OK', message: '...'}`

#### Pokemon List Handler
- **Endpoint**: `GET /api/pokemons`
- **Logic**:
  1. Start with copy of all Pokemon data
  2. Apply name filter (if provided)
  3. Apply type filter (if provided)
  4. Apply legendary status filter (if provided)
  5. Return filtered results with count
- **Query Parameters**: name, type, legendary

#### Pokemon Detail Handler
- **Endpoint**: `GET /api/pokemons/:id`
- **Logic**:
  1. Parse ID from URL parameter
  2. Find matching Pokemon by ID
  3. Return Pokemon or 404 error

#### Types Handler
- **Endpoint**: `GET /api/types`
- **Logic**:
  1. Flatten all type arrays from all Pokemon
  2. Remove duplicates using Set
  3. Return sorted array of unique types

### 4. Data Layer
- In-memory array containing 12 Pokemon objects
- Each Pokemon has id, name, type array, legendary flag, and image URL
- Data is read-only during server runtime

## Request Flow

```
Frontend HTTP Request
         │
         ▼
┌─────────────────────┐
│ CORS Middleware     │ ─── Validates origin, adds CORS headers
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ JSON Middleware     │ ─── Parses request body (if needed)
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Route Handler       │ ─── Matches URL pattern and method
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Business Logic      │ ─── Filters data, processes request
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Response Handler    │ ─── Formats response, sends JSON
└─────────────────────┘
         │
         ▼
Frontend receives JSON response
```

## Data Flow

### Initial Load Flow
```
Frontend
   │
   ├─ fetch /api/pokemons ──────────────┐
   │                                     │
   └─ fetch /api/types ───────────────┐ │
                                      │ │
Backend                               │ │
   │◄──────────────────────────────────┤ │
   │ Get all Pokemon from mockPokemons │ │
   │ Construct response with data[]    │ │
   │─────────────────────────────────────►
   │
   │◄─────────────────────────────────────┐
   │ Get unique types from mockPokemons   │
   │ Sort and return                      │
   │──────────────────────────────────────►
   │
Frontend
   ├─ Display 12 Pokemon cards
   └─ Populate type dropdown
```

### Filtering Flow
```
Frontend (User sets filter)
   │
   └─ fetch /api/pokemons?name=pika&type=electric
                         │
Backend                  │
   ├─ Receive query params
   ├─ Filter mockPokemons by name (partial match)
   ├─ Filter by type (exists in type array)
   ├─ Filter by legendary status
   ├─ Construct response {success, count, data}
   └─ Send JSON response
                         │
                         ▼
Frontend
   ├─ Receive filtered results
   ├─ Update displayed Pokemon grid
   └─ Show count
```

## File Structure

```
pokemon-backend/
├── server.js              # Main application file (single entry point)
│   ├── Express setup
│   ├── Middleware
│   ├── Mock data
│   ├── Route handlers
│   └── Server startup
│
├── package.json           # Dependencies and scripts
├── Dockerfile             # Docker container definition
├── docker-compose.yml     # Docker Compose configuration
├── .gitignore             # Git ignore rules
├── README.md              # User-facing documentation
└── ARCHITECTURE.md        # This file
```

## Key Design Decisions

### 1. Single File Structure
- **Why**: Simplicity for a small API
- **Trade-off**: Not scalable for large applications
- **Future**: Could be refactored into modules as complexity grows

### 2. In-Memory Mock Data
- **Why**: No external dependencies, simple deployment
- **Trade-off**: Data loss on restart, no persistence
- **Future**: Could be replaced with a database (MongoDB, PostgreSQL)

### 3. Client-Side AND Server-Side Filtering
- **Why**: Server applies filters for API correctness; frontend applies them for better UX
- **Trade-off**: Duplicate filter logic
- **Benefit**: Works well even if frontend filtering is removed

### 4. No Pagination
- **Why**: Small dataset (12 Pokemon)
- **Limitation**: Not suitable for large datasets
- **Future**: Could add limit/offset pagination if needed

### 5. Permissive CORS
- **Why**: Development convenience
- **Security Note**: Should be restricted in production to specific domains

## Dependencies

### Production Dependencies
- **express@^4.18.2**: Web framework for routing and middleware
- **cors@^2.8.5**: Enables Cross-Origin Resource Sharing

### Development Dependencies
- **nodemon@^3.0.1**: Auto-restarts server on file changes

## Environment Configuration

- **PORT**: Server port (default: 3001)
- **NODE_ENV**: Deployment environment (optional)

## Deployment Architecture

### Docker Deployment
```
├── Base Image: Node.js Official Image
├── Copy source code
├── Install dependencies
├── Expose port 3001
├── Health check: GET /health
└── Start server: node server.js
```

### Communication
- Listens on `0.0.0.0:3001` (all interfaces)
- Responds with JSON (Content-Type: application/json)
- Accepts CORS requests from any origin

## Error Handling

The API uses HTTP status codes for error handling:
- **200 OK**: Successful request
- **404 Not Found**: Pokemon ID doesn't exist
- **CORS errors**: Handled by CORS middleware

Response format for errors:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Scalability Considerations

### Current Limitations
- Single process, no clustering
- In-memory data, no horizontal scaling
- No caching mechanism
- No database indexing

### Future Improvements
- Add database (MongoDB/PostgreSQL) for persistence
- Implement caching (Redis)
- Add pagination for large datasets
- Add filtering on backend for complex queries
- Implement rate limiting and authentication
- Separate into modular files as complexity grows

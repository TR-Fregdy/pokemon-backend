# Pokemon Backend - AI Agent Guidance

## Project Overview

This is a lightweight Node.js/Express REST API for serving Pokemon data with filtering capabilities. The backend is designed to be simple, stateless, and easily scalable.

## Technology Stack

### Runtime & Framework
- **Node.js**: v18+ required
- **Express.js**: ^4.18.2 - Lightweight web framework for HTTP routing and middleware
- **CORS**: ^2.8.5 - Cross-Origin Resource Sharing middleware for frontend integration

### Development
- **nodemon**: ^3.0.1 - Hot-reload utility for development server

## Architecture Pattern

The project follows a **simple REST API pattern** with:
- **Single-file structure**: All routes, logic, and mock data are in `server.js`
- **Stateless design**: No database, session management, or external state
- **Mock data layer**: In-memory Pokemon data structure

## Code Structure

```
pokemon-backend/
├── server.js           # All API logic, routes, middleware, and mock data
├── package.json        # Dependencies and scripts
├── Dockerfile          # Container configuration
├── docker-compose.yml  # Multi-container orchestration
├── .gitignore          # Git exclusions
└── README.md           # User documentation
```

## Key Files & Responsibilities

### server.js
- **Purpose**: Single entry point containing entire application
- **Responsibilities**:
  - Express app initialization
  - CORS and JSON middleware setup
  - Mock Pokemon data definition (12 Pokemon)
  - Route handlers for all endpoints
  - Server startup on PORT 3001

### Mock Data Structure

Each Pokemon object has:
```javascript
{
  id: number,           // Unique identifier (1-12)
  name: string,         // Pokemon name
  type: string[],       // Array of types (e.g., ['Fire', 'Flying'])
  legendary: boolean,   // Legendary status
  image: string         // URL to sprite from PokeAPI
}
```

## API Endpoints

### Health Check
- **GET `/health`** - Server health check for Docker/orchestration
  - Response: `{ status: 'OK', message: '...' }`

### Pokemon Listing & Filtering
- **GET `/api/pokemons`** - Get all Pokemon or filtered results
  - Query Parameters:
    - `name` (string) - Partial match, case-insensitive
    - `type` (string) - Exact match on any type, case-insensitive
    - `legendary` (boolean) - Filter by legendary status ('true'/'false')
  - Response: `{ success: true, count: number, data: Pokemon[] }`
  - Multiple filters work together (AND logic)

### Pokemon Detail
- **GET `/api/pokemons/:id`** - Get single Pokemon by ID
  - Response: `{ success: true, data: Pokemon }`
  - Response on not found: `{ success: false, message: '...' }` (404)

### Types Listing
- **GET `/api/types`** - Get all unique Pokemon types
  - Response: `{ success: true, data: string[] }`
  - Types are sorted alphabetically

## Filtering Logic

All filtering is done in-memory on the `GET /api/pokemons` endpoint:

1. **Name filtering**: Case-insensitive substring match on Pokemon name
2. **Type filtering**: Case-insensitive exact match on any type in Pokemon's type array
3. **Legendary filtering**: Boolean conversion from query string ('true'/'false')
4. **Combined filtering**: All active filters are applied (AND logic)

## Development Workflow

### Local Development
```bash
npm install              # Install dependencies
npm run dev              # Start with hot-reload (nodemon)
```

### Building
```bash
npm start                # Start production server
npm run docker:build     # Build Docker image
npm run docker:run       # Run Docker container locally
```

## Environment Variables

- `PORT` (optional, default: 3001) - Server port
- `NODE_ENV` (optional, development/production) - Environment mode

## Important Constraints & Conventions

### Data Constraints
- Mock data is hardcoded in memory (no persistence)
- 12 Pokemon total (5 legendary, 7 regular)
- Types are immutable string arrays per Pokemon

### API Conventions
- All responses follow success/data pattern
- Case-insensitive filtering for user-friendly matching
- Query parameters are processed but not validated
- No request body validation or error codes for filtering

### Performance Considerations
- All filtering is O(n) linear search through mock data
- No caching or query optimization needed (small dataset)
- CORS enabled for all origins (no restriction)

## Deployment

### Docker
Multi-stage builds not required (simple single-stage Dockerfile).

### Health Check
The `/health` endpoint is used by Docker for health monitoring:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
  interval: 10s
```

## Safe Code Generation Guidelines

### When Adding Features:
1. **New endpoints**: Add routes to `server.js` following existing pattern
2. **New filtering**: Add filter logic to `/api/pokemons` handler
3. **Data changes**: Modify `mockPokemons` array directly
4. **Middleware**: Use `app.use()` before route definitions
5. **Error handling**: Return JSON with `success` flag and appropriate status codes

### Avoid:
- Adding external databases without updating environment setup
- Changing response JSON structure (breaks frontend contract)
- Modifying filtering logic without understanding AND-logic combination
- Adding dependencies without updating docker/package.json

## Frontend Contract

The frontend expects:
- `/api/pokemons` returns array of Pokemon objects with `id`, `name`, `type`, `legendary`, `image`
- `/api/types` returns sorted array of type strings
- CORS enabled (currently unrestricted)
- Filtering via query parameters (not body)

## Related Documentation
- See `README.md` for user-facing documentation
- See `ARCHITECTURE.md` for system-level design overview

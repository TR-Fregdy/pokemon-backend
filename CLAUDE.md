# CLAUDE.md - AI Agent Guidance for Pokemon Backend

## Project Overview

This is a Node.js/Express REST API backend that provides Pokemon data with filtering capabilities. It serves as the backend for the Pokemon Explorer frontend application.

## Technology Stack

- **Language**: JavaScript (ES6+)
- **Runtime**: Node.js v18+
- **Framework**: Express.js 4.18.2
- **Additional Libraries**:
  - `cors` (2.8.5) - Cross-Origin Resource Sharing middleware
  - `nodemon` (3.0.1) - Development server with hot reload

## Architecture Pattern

- **Monolithic Single-File Architecture**: All code resides in `server.js`
- **REST API Design**: Standard HTTP methods with JSON responses
- **In-Memory Data Store**: Mock data stored as JavaScript array

## Key Files

| File | Purpose |
|------|---------|
| `server.js` | Main application entry point containing routes, middleware, and mock data |
| `package.json` | Project configuration, dependencies, and npm scripts |

## API Structure

### Endpoints

1. **GET /health** - Health check returning `{ status: 'OK' }`
2. **GET /api/pokemons** - List all Pokemon with optional query filters
3. **GET /api/pokemons/:id** - Get single Pokemon by numeric ID
4. **GET /api/types** - Get unique Pokemon types array

### Query Parameters (for /api/pokemons)

- `name` - Partial, case-insensitive name filter
- `type` - Exact, case-insensitive type filter
- `legendary` - Boolean string ('true'/'false') filter

### Response Format

All endpoints return JSON with structure:
```javascript
{
  success: boolean,
  data: array | object,
  count?: number,      // Only for list endpoints
  message?: string     // Only for errors
}
```

## Data Model

### Pokemon Object

```javascript
{
  id: number,           // Unique identifier
  name: string,         // Pokemon name
  type: string[],       // Array of type strings
  legendary: boolean,   // Legendary status
  image: string         // URL to PokeAPI sprite
}
```

## Code Conventions

1. **Middleware Order**: CORS → JSON parser → Routes
2. **Error Handling**: 404 responses for missing resources with `success: false`
3. **Filtering Logic**: Sequential array filtering with spread operator for immutability
4. **Port Configuration**: Uses `process.env.PORT` with fallback to 3001

## Constraints & Assumptions

- **No Database**: Data is stored in-memory and resets on restart
- **No Authentication**: All endpoints are publicly accessible
- **CORS Enabled**: Allows requests from any origin
- **Single Process**: Not designed for clustering or horizontal scaling
- **Stateless**: No session management

## Important Implementation Notes

1. **Case-Insensitive Search**: Name search uses `toLowerCase()` for comparison
2. **Type Matching**: Type filter checks if Pokemon has ANY matching type
3. **Legendary Filter**: Compares against string 'true' for boolean conversion
4. **ID Parsing**: Uses `parseInt()` for route parameter conversion

## Development Commands

```bash
npm install    # Install dependencies
npm run dev    # Start with nodemon (hot reload)
npm start      # Start production server
```

## Integration Points

- **Frontend**: Consumed by pokemon-frontend React application
- **Proxy**: Frontend uses proxy configuration to `http://localhost:3001`
- **External**: Pokemon images sourced from PokeAPI GitHub sprites

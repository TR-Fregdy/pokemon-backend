# Pokemon Backend - AI Agent Guidance

## Project Overview

This is a Node.js/Express RESTful API for managing and filtering Pokemon data. It provides a minimal, focused backend for a Pokemon browsing and filtering application.

## Programming Language & Runtime

- **Language**: JavaScript (Node.js)
- **Node Version**: 18.0.0 or later (as specified in README)
- **Runtime**: Node.js
- **Package Manager**: npm

## Frameworks & Core Libraries

- **express** (^4.18.2) - Web framework for HTTP server and routing
- **cors** (^2.8.5) - Cross-Origin Resource Sharing middleware for frontend integration
- **nodemon** (^3.0.1) - Development dependency for auto-restarting server on file changes

## Architecture Pattern

**Monolithic REST API** with a single-file structure:
- All application logic, data, and routes in `server.js`
- Mock data (no persistent database)
- Stateless request-response pattern
- Simple filtering applied in-memory

## Key Constraints & Conventions

1. **Single File Structure**: All code in `server.js` - keep route definitions, middleware, and data together
2. **Mock Data Only**: Uses hardcoded Pokemon array - no database integration
3. **CORS Enabled**: Allows requests from any origin for cross-origin frontend communication
4. **JSON Response Format**: All endpoints return JSON with consistent structure:
   - Success responses include `success: true`, `count`, and `data`
   - Error responses include `success: false` and `message`
5. **Port Configuration**: Reads from `PORT` environment variable (defaults to 3001)
6. **Environment Modes**: Supports `NODE_ENV` for development/production distinction
7. **Filtering Strategy**: Client-friendly query parameters (`name`, `type`, `legendary`) applied server-side

## Critical Files & Their Responsibilities

- **server.js** (165 lines):
  - Initializes Express application
  - Configures CORS and JSON middleware
  - Defines mock Pokemon data (12 Pokemon with 5 properties each)
  - Implements 4 API endpoints (health check, list all, get by ID, get types)
  - Applies three-layered filtering logic (by name, by type, by legendary status)
  - Starts server and logs startup message

## API Endpoints Documentation

### GET /health
Health check endpoint for container/service monitoring.
- **Response**: `{ status: "OK", message: "Pokemon API is running!" }`
- **Status Code**: 200

### GET /api/pokemons
Get all Pokemon with optional filtering.
- **Query Parameters**:
  - `name` (string, optional) - Case-insensitive partial name match
  - `type` (string, optional) - Case-insensitive exact type match
  - `legendary` (string, optional) - `"true"` or `"false"` for legendary status filter
- **Response Format**:
  ```json
  {
    "success": true,
    "count": <number>,
    "data": [
      {
        "id": <number>,
        "name": <string>,
        "type": [<string>, ...],
        "legendary": <boolean>,
        "image": <string (URL)>
      }
    ]
  }
  ```
- **Status Code**: 200

### GET /api/pokemons/:id
Get a specific Pokemon by its ID.
- **Path Parameter**: `id` (number, 1-12)
- **Response**: Same as `/api/pokemons` but with single Pokemon object in data field
- **Status Code**: 200 (success) or 404 (not found)

### GET /api/types
Get all unique Pokemon types.
- **Response**:
  ```json
  {
    "success": true,
    "data": [<string>, ...]  // Sorted alphabetically
  }
  ```
- **Status Code**: 200

## Mock Data Structure

12 hardcoded Pokemon with consistent properties:
- **id**: Unique numeric identifier (1-12)
- **name**: Pokemon name string
- **type**: Array of type strings (e.g., `["Electric"]`, `["Fire", "Flying"]`)
- **legendary**: Boolean flag
- **image**: URL to official Pokemon sprite from PokeAPI

**Data Location**: Lines 12-97 in `server.js`

## Middleware Stack

1. **cors()** - Enables cross-origin requests from any origin
2. **express.json()** - Parses incoming JSON request bodies
3. Route handlers - Custom request handlers for each endpoint

## Important Assumptions & Notes

1. **No Database**: All Pokemon data is hardcoded in memory - resets on server restart
2. **Case Normalization**: All string comparisons are case-insensitive to improve UX
3. **Partial Name Matching**: Name filter uses `includes()`, not exact match
4. **Type Exact Matching**: Type filter requires exact match (after case conversion)
5. **Error Handling**: Minimal - only 404 on missing Pokemon by ID
6. **No Input Validation**: Query parameters are passed through without validation
7. **No Logging**: Minimal logging (only startup message)
8. **Single Process**: No clustering or load balancing

## Development Workflow

- **npm run dev**: Starts with nodemon for auto-reload during development
- **npm start**: Direct Node.js execution for production
- **Docker available**: `docker build -t pokemon-backend .` and `docker run -p 3001:3001 pokemon-backend`

## Code Generation Guidelines

When extending or modifying this backend:

1. **Keep the single-file structure** unless Pokemon data should be externalized
2. **Maintain JSON response format consistency** with existing endpoints
3. **Add new endpoints at the end** before the `app.listen()` call
4. **Use the same filtering pattern** for consistency (query params → in-memory filter → response)
5. **Update exports/routing** if refactoring into multiple files
6. **Test filtering logic** with edge cases (empty results, case variations, partial matches)
7. **Consider adding proper error handling** if extending with external data sources
8. **Use CORS configuration wisely** - current setup allows all origins

## Related Documentation

- **README.md**: Installation, setup, and API usage examples
- **package.json**: Dependency versions and scripts
- **Architecture**: See ARCHITECTURE.md for system-level overview
- **Frontend**: Connected via CORS to pokemon-frontend on port 3000 (see proxy in frontend's package.json)

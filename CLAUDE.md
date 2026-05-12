# Pokemon Backend - AI Agent Guidance

## Overview

This is a simple Node.js/Express REST API for serving and filtering Pokemon data. It's designed as a lightweight backend service for the Pokemon Frontend application.

## Technology Stack

- **Runtime**: Node.js (v18 or later)
- **Framework**: Express.js (^4.18.2)
- **Additional Libraries**: CORS (^2.8.5)
- **Development**: nodemon (^3.0.1)

## Architecture Pattern

This is a **single-file monolithic API** with the following characteristics:

- **No modular structure** - All logic is in `server.js`
- **No database** - Uses in-memory mock data
- **No middleware pipeline** - Basic Express setup with CORS and JSON middleware
- **Stateless design** - No session or state management

## Key Design Decisions

1. **Mock Data Approach**: The API uses hardcoded Pokemon data arrays instead of a database to keep it simple and deployable without external dependencies.

2. **Client-side Filtering**: Filters are applied on the server before sending responses, but the frontend also applies filters independently for better UX.

3. **CORS Enabled**: The API explicitly enables CORS to allow the frontend (running on a different port/domain) to make requests.

4. **RESTful Conventions**: Uses standard REST conventions with meaningful HTTP methods and status codes.

## Code Structure

```
server.js
├── Express app setup
├── Middleware configuration (CORS, JSON)
├── Mock data (12 Pokemon objects)
├── Route handlers
│   ├── GET /health
│   ├── GET /api/pokemons (with filtering)
│   ├── GET /api/pokemons/:id
│   └── GET /api/types
└── Server startup (listen)
```

## API Routes

- **GET /health** - Health check, returns `{status: 'OK', message: '...'}`
- **GET /api/pokemons** - Returns all Pokemon with optional query filters
- **GET /api/pokemons/:id** - Returns a specific Pokemon by ID
- **GET /api/types** - Returns all unique types from Pokemon data

## Request/Response Format

### Pokemon Object Structure

```javascript
{
  id: number,           // Unique identifier
  name: string,         // Pokemon name
  type: string[],       // Array of types
  legendary: boolean,   // Legendary status
  image: string         // URL to sprite image
}
```

### Filter Query Parameters

- `name` - Partial match (case-insensitive) on Pokemon name
- `type` - Exact match (case-insensitive) on one of the Pokemon's types
- `legendary` - Boolean filter (as string "true" or "false")

## Important Constraints & Assumptions

1. **No Authentication**: The API doesn't require or enforce authentication.
2. **No Input Validation**: Query parameters are not validated - frontend is trusted to send valid inputs.
3. **No Error Logging**: Errors are not logged to external services.
4. **Fixed Data**: The 12 Pokemon in the data array are hardcoded and cannot be modified.
5. **Synchronous Operation**: All operations are synchronous (no actual async I/O).
6. **CORS Permissive**: CORS is enabled for all origins (safe for development, should be restricted in production).

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (optional, used for Docker and development)

## Development Conventions

1. **Naming**: 
   - Variables use camelCase
   - Constants use camelCase (not UPPER_CASE)
   - Avoid abbreviations
   
2. **Code Style**:
   - ES6 arrow functions preferred
   - `.filter()` and `.find()` for array operations
   - Destructuring for object access

3. **Response Format**:
   - All responses include a `success` boolean (typically true)
   - Data is nested under `data` property for successful responses
   - Error responses include `message` property

## Common Modifications

If you need to modify this backend:

1. **Adding a new endpoint**: Add a new `app.get()` or `app.post()` route handler
2. **Adding a Pokemon**: Add to the `mockPokemons` array
3. **Adding a new filter**: Modify the filtering logic in `/api/pokemons` route
4. **Changing the port**: Update `PORT` variable or set `PORT` environment variable

## Docker Considerations

The backend is Dockerized with:
- Health checks using the `/health` endpoint
- Port exposure on 3001
- Node.js official image as base

## Known Limitations

1. **No persistence** - All data is lost if the server restarts
2. **No pagination** - All Pokemon are returned in a single response
3. **No sorting** - Results are not sorted
4. **No advanced filtering** - Only simple equals/contains filters
5. **No rate limiting** - No protection against request flooding
6. **Single-threaded** - Only one instance of the server runs

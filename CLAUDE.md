# CLAUDE.md - AI Agent Guidance for Pokemon Backend

This document provides context for AI agents working with this codebase.

## Project Overview

- **Type**: RESTful API Server
- **Language**: JavaScript (ES6+)
- **Runtime**: Node.js v18+
- **Framework**: Express.js

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Node.js | v18+ |
| Web Framework | Express.js | ^4.18.2 |
| CORS Middleware | cors | ^2.8.5 |
| Dev Tool | nodemon | ^3.0.1 |

## Architecture Pattern

- **Pattern**: Single-file monolithic Express application
- **Data Storage**: In-memory mock data (no database)
- **API Style**: RESTful JSON API

## Key Files

| File | Purpose |
|------|---------|
| `server.js` | Main entry point containing all routes, middleware, and mock data |
| `package.json` | Project configuration and dependencies |

## Code Structure in server.js

1. **Lines 1-9**: Express setup and middleware configuration
2. **Lines 12-97**: Mock Pokemon data array (12 Pokemon objects)
3. **Lines 100-102**: Health check endpoint (`/health`)
4. **Lines 104-136**: Main Pokemon list endpoint with filtering (`/api/pokemons`)
5. **Lines 138-153**: Single Pokemon by ID endpoint (`/api/pokemons/:id`)
6. **Lines 156-162**: Types list endpoint (`/api/types`)
7. **Lines 164-166**: Server startup

## API Endpoints Summary

| Endpoint | Method | Query Params | Description |
|----------|--------|--------------|-------------|
| `/health` | GET | - | Returns server status |
| `/api/pokemons` | GET | name, type, legendary | Returns filtered Pokemon list |
| `/api/pokemons/:id` | GET | - | Returns single Pokemon |
| `/api/types` | GET | - | Returns unique types array |

## Conventions and Patterns

1. **Response Format**: All endpoints return JSON with `{ success: boolean, data: any }` structure
2. **Error Handling**: 404 errors return `{ success: false, message: string }`
3. **Filtering**: Case-insensitive matching for name and type filters
4. **Port Configuration**: Uses `process.env.PORT` with fallback to 3001

## Data Model

```javascript
{
  id: number,           // Unique identifier
  name: string,         // Pokemon name
  type: string[],       // Array of types
  legendary: boolean,   // Legendary status
  image: string         // URL to sprite image
}
```

## Constraints and Assumptions

1. **No Database**: Data is stored in memory and resets on server restart
2. **No Authentication**: All endpoints are publicly accessible
3. **CORS Enabled**: Accepts requests from any origin
4. **Single File**: All code resides in `server.js`
5. **Mock Data Only**: 12 pre-defined Pokemon records

## Safe Code Generation Guidelines

When modifying this codebase:

1. **Adding Endpoints**: Follow the existing pattern of returning `{ success: true, data: ... }`
2. **Adding Filters**: Add query parameter handling similar to existing filters
3. **Adding Pokemon**: Extend the `mockPokemons` array with the same object structure
4. **Error Responses**: Use `res.status(code).json({ success: false, message: '...' })`
5. **Middleware**: Add new middleware between `app.use(express.json())` and routes

## Development Commands

```bash
npm install     # Install dependencies
npm run dev     # Start with nodemon (auto-reload)
npm start       # Start production server
```

## Integration Points

- **Frontend**: React application on port 3000 (proxied to this backend)
- **Docker**: Can be containerized and exposed on port 3001
- **Health Check**: `/health` endpoint for container orchestration

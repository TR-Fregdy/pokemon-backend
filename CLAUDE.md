# CLAUDE.md - AI Assistant Guide for Pokemon Backend

## Technology Stack & Versions

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | ^4.18.2 | Web framework |
| CORS | ^2.8.5 | Cross-origin resource sharing |
| Nodemon | ^3.0.1 | Development auto-reload (dev dependency) |

## Project Overview

This is a **REST API backend** for a Pokemon filtering application. It provides endpoints to fetch, filter, and query Pokemon data. The API uses in-memory mock data rather than a database.

## Architecture Pattern

- **Pattern**: Single-file Express server (monolithic)
- **Data Storage**: In-memory JavaScript array (no database)
- **API Style**: RESTful JSON API

## Key Files

| File | Purpose |
|------|---------|
| `server.js` | Main application entry point - contains all routes, middleware, and data |
| `package.json` | Dependencies and npm scripts |
| `.tr-codegen/Dockerfile` | Docker container configuration |
| `.tr-codegen/docker-compose.yml` | Docker Compose orchestration |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check endpoint |
| `/api/pokemons` | GET | List all Pokemon with optional filters |
| `/api/pokemons/:id` | GET | Get single Pokemon by ID |
| `/api/types` | GET | Get all unique Pokemon types |

### Query Parameters for `/api/pokemons`

- `name` - Case-insensitive partial name match
- `type` - Case-insensitive exact type match
- `legendary` - Boolean filter (`true` or `false`)

## Data Model

```javascript
{
  id: number,        // Unique identifier
  name: string,      // Pokemon name
  type: string[],    // Array of type names
  legendary: boolean,// Legendary status
  image: string      // URL to sprite image
}
```

## Development Commands

```bash
npm install       # Install dependencies
npm run dev       # Start with nodemon (hot reload)
npm start         # Start production server
npm run docker:build  # Build Docker image
npm run docker:run    # Run Docker container
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server listening port |
| `NODE_ENV` | development | Environment mode |

## Code Style & Conventions

- ES6+ JavaScript (CommonJS modules with `require`)
- Functional approach for route handlers
- Inline data (no separate data files)
- No TypeScript
- No testing framework configured

## Important Notes for Code Generation

1. **No Database**: Data is in-memory in `server.js` - changes require server restart
2. **Single File**: All server logic is in `server.js`
3. **Port 3001**: Default port - frontend expects this
4. **CORS Enabled**: Accepts requests from any origin
5. **No Authentication**: Public API, no auth required

## Response Format

All endpoints return JSON with this structure:

```javascript
// Success
{
  success: true,
  data: [...] | {...},
  count?: number  // For list endpoints
}

// Error
{
  success: false,
  message: string
}
```

## Docker Configuration

- Base image: `node:18-alpine`
- Health check configured on `/health` endpoint
- Exposed port: 3001

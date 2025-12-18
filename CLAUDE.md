# CLAUDE.md - Pokemon Backend API

This file provides essential context for AI agents working with this codebase.

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Runtime | Node.js | 18+ |
| Framework | Express.js | ^4.18.2 |
| CORS | cors | ^2.8.5 |
| Dev Tools | nodemon | ^3.0.1 |
| Containerization | Docker | Alpine-based |

## Project Overview

This is a RESTful API backend for a Pokemon filtering application. It provides endpoints to retrieve and filter Pokemon data, with CORS enabled for frontend integration.

## Architecture Pattern

- **Single-file monolithic** - All application logic resides in `server.js`
- **In-memory data store** - Uses mock data array (no database)
- **REST API** - Standard HTTP methods with JSON responses

## Key Files

| File | Purpose |
|------|---------|
| `server.js` | Main application entry point, contains all routes and data |
| `package.json` | Dependencies and npm scripts |
| `.tr-codegen/Dockerfile` | Production Docker image configuration |
| `.tr-codegen/docker-compose.yml` | Container orchestration |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/api/pokemons` | List all Pokemon with optional filters |
| GET | `/api/pokemons/:id` | Get single Pokemon by ID |
| GET | `/api/types` | Get all unique Pokemon types |

### Query Parameters for `/api/pokemons`

- `name` - Case-insensitive partial name match
- `type` - Case-insensitive exact type match
- `legendary` - Boolean filter (`"true"` or `"false"`)

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

## Response Format

All endpoints return JSON with consistent structure:

```javascript
{
  success: boolean,
  count?: number,    // For list endpoints
  data: object | array,
  message?: string   // For errors
}
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Start production server
npm start

# Build Docker image
npm run docker:build

# Run Docker container
npm run docker:run
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `NODE_ENV` | development | Environment mode |

## Code Patterns

### Error Handling
```javascript
if (!pokemon) {
  return res.status(404).json({
    success: false,
    message: 'Pokemon not found'
  });
}
```

### Filtering Pattern
```javascript
let filtered = [...data];
if (filterParam) {
  filtered = filtered.filter(item => /* condition */);
}
```

## Docker Configuration

- Base image: `node:18-alpine`
- Exposed port: 3001
- Health check: `curl -f http://localhost:3001/health`
- Auto-restart: `unless-stopped`

## Important Notes

1. **No Database**: Data is hardcoded in `server.js` - changes require code modification
2. **CORS Enabled**: All origins are allowed by default
3. **No Authentication**: API is publicly accessible
4. **Mock Data**: Contains 12 Pokemon (7 regular, 5 legendary)

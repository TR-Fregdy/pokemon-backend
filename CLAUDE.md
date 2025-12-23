# CLAUDE.md - Pokemon Backend

This file provides context for AI agents working with this codebase.

## Project Overview

Pokemon Backend is a RESTful API server built with Node.js and Express.js that provides Pokemon data to the frontend application.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | ^4.18.2 | Web framework |
| CORS | ^2.8.5 | Cross-origin resource sharing |
| Nodemon | ^3.0.1 | Development hot-reload |
| Docker | Alpine | Containerization |

## Architecture

- **Pattern**: Monolithic single-file API server
- **Data Storage**: In-memory mock data (no database)
- **API Style**: REST with JSON responses

## Key Files

| File | Description |
|------|-------------|
| `server.js` | Main application file containing Express app, routes, middleware, and mock data |
| `package.json` | Project dependencies and npm scripts |
| `.tr-codegen/Dockerfile` | Docker build configuration |
| `.tr-codegen/docker-compose.yml` | Container orchestration |

## API Endpoints

```
GET  /health           - Health check (returns { status: 'OK' })
GET  /api/pokemons     - List Pokemon with optional filtering
GET  /api/pokemons/:id - Get single Pokemon by ID
GET  /api/types        - Get all unique Pokemon types
```

### Query Parameters for `/api/pokemons`

- `name` - Filter by name (case-insensitive partial match)
- `type` - Filter by type (case-insensitive exact match)
- `legendary` - Filter by legendary status (`true`/`false`)

### Response Format

```json
{
  "success": true,
  "count": 12,
  "data": [...]
}
```

## Development Commands

```bash
npm install     # Install dependencies
npm run dev     # Start with hot-reload (nodemon)
npm start       # Start production server
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3001 | Server listening port |
| NODE_ENV | development | Environment mode |

## Code Conventions

- ES6+ JavaScript syntax
- Express middleware pattern
- Functional route handlers
- In-memory data filtering with array methods

## Data Model

```javascript
{
  id: number,           // Unique identifier
  name: string,         // Pokemon name
  type: string[],       // Array of types (e.g., ['Fire', 'Flying'])
  legendary: boolean,   // Is legendary Pokemon
  image: string         // URL to sprite image
}
```

## Common Tasks

### Adding a New Endpoint

Add route handler in `server.js`:
```javascript
app.get('/api/newroute', (req, res) => {
  res.json({ success: true, data: ... });
});
```

### Adding New Pokemon Data

Append to `mockPokemons` array in `server.js`.

### Modifying Filters

Update filter logic in the `/api/pokemons` route handler.

## Testing

Currently no test framework configured. API can be tested with:
```bash
curl http://localhost:3001/api/pokemons
curl http://localhost:3001/api/pokemons?type=fire
curl http://localhost:3001/health
```

## Docker Deployment

```bash
# Using Docker directly
docker build -t pokemon-backend .
docker run -p 3001:3001 pokemon-backend

# Using Docker Compose
docker-compose -f .tr-codegen/docker-compose.yml up
```

## Integration with Frontend

- Frontend expects API at `http://localhost:3001` by default
- CORS is enabled for all origins
- API responses follow consistent JSON format

# CLAUDE.md - Pokemon Backend

This file provides guidance for AI agents working with the Pokemon Backend codebase.

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | ^4.18.2 | Web framework |
| CORS | ^2.8.5 | Cross-origin resource sharing |
| Nodemon | ^3.0.1 | Development hot-reload (dev dependency) |

## Project Architecture

This is a **simple RESTful API** using a single-file architecture pattern:
- All routes, middleware, and data are contained in `server.js`
- Mock data is embedded directly in the application (no database)
- Express middleware stack: CORS -> JSON parser -> Routes

## Directory Structure

```
pokemon-backend/
├── server.js           # Main application entry point (all routes and data)
├── package.json        # Node.js dependencies and scripts
├── .gitignore          # Git ignore patterns
├── README.md           # User documentation
├── CLAUDE.md           # AI agent guidance (this file)
├── ARCHITECTURE.md     # Detailed architecture documentation
└── .tr-codegen/        # Docker deployment configuration
    ├── Dockerfile      # Container build instructions
    └── docker-compose.yml
```

## Quick Commands

```bash
# Install dependencies
npm install

# Development (with hot-reload)
npm run dev

# Production
npm start

# Docker build and run
npm run docker:build
npm run docker:run
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/pokemons` | List all Pokemon (with filtering) |
| GET | `/api/pokemons/:id` | Get single Pokemon by ID |
| GET | `/api/types` | Get all unique Pokemon types |

### Query Parameters for `/api/pokemons`

- `name` - Filter by name (case-insensitive partial match)
- `type` - Filter by type (case-insensitive exact match)
- `legendary` - Filter by legendary status (`"true"` or `"false"`)

## Data Model

```javascript
{
  id: number,           // Unique identifier
  name: string,         // Pokemon name
  type: string[],       // Array of type names
  legendary: boolean,   // Legendary status
  image: string         // URL to sprite image
}
```

## Code Patterns

### Response Format
All API responses follow this structure:
```javascript
{
  success: boolean,
  data: object | array,    // For successful responses
  count?: number,          // For list endpoints
  message?: string         // For errors
}
```

### Error Handling
- 404 errors return `{ success: false, message: "..." }`
- No global error handler - errors are handled per-route

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `NODE_ENV` | development | Environment mode |

## Testing Notes

- No tests are currently implemented
- Manual testing via curl or Postman recommended
- Health endpoint at `/health` for container health checks

## Key Considerations for Modifications

1. **Adding new Pokemon**: Edit the `mockPokemons` array in `server.js`
2. **Adding new filters**: Modify the `/api/pokemons` route handler
3. **Adding new endpoints**: Add routes before `app.listen()`
4. **Database integration**: Would require significant refactoring from in-memory data
5. **CORS configuration**: Currently allows all origins; may need restriction for production

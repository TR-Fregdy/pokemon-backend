# CLAUDE.md - Pokemon Backend

This file provides guidance for AI agents working with this codebase.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | Runtime environment |
| Express.js | 4.18.2 | Web framework |
| cors | 2.8.5 | CORS middleware |
| nodemon | 3.0.1 | Development hot-reload |

## Project Structure

```
pokemon-backend/
├── server.js              # Main application entry point (single-file API)
├── package.json           # Dependencies and npm scripts
├── .gitignore             # Git ignore rules
├── .tr-codegen/           # Docker deployment configuration
│   ├── Dockerfile         # Container image definition
│   └── docker-compose.yml # Container orchestration
└── README.md              # Project documentation
```

## Architecture Pattern

**Monolithic Single-File API**: This is a simple Express.js REST API contained entirely within `server.js`. The architecture is intentionally minimal:

- No separate routes, controllers, or services directories
- Mock data stored in-memory as a JavaScript array
- Direct filtering logic in route handlers

## Key Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start with hot-reload (nodemon)
npm start            # Production start

# Docker
npm run docker:build # Build Docker image
npm run docker:run   # Run container on port 3001
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/api/pokemons` | List all Pokemon (supports filtering) |
| GET | `/api/pokemons/:id` | Get single Pokemon by ID |
| GET | `/api/types` | Get all unique Pokemon types |

### Query Parameters for `/api/pokemons`

- `name` - Case-insensitive partial match on Pokemon name
- `type` - Case-insensitive exact match on Pokemon type
- `legendary` - `"true"` or `"false"` string for legendary status

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server listen port |
| `NODE_ENV` | - | Environment mode |

## Data Model

Pokemon objects have the following structure:

```javascript
{
  id: number,           // Unique identifier
  name: string,         // Pokemon name
  type: string[],       // Array of type strings
  legendary: boolean,   // Legendary status
  image: string         // URL to Pokemon sprite
}
```

## Code Patterns

### Response Format

All API responses follow this structure:

```javascript
// Success response
{
  success: true,
  data: [...],      // or single object
  count: number     // for list endpoints
}

// Error response
{
  success: false,
  message: string
}
```

### Filtering Logic

Filters are applied sequentially in `server.js`:
1. Name filter (case-insensitive `includes()`)
2. Type filter (case-insensitive exact match using `some()`)
3. Legendary filter (boolean comparison)

## Testing Notes

- No test framework is currently configured
- Manual testing via curl or API tools
- Health endpoint available for container health checks

## Common Development Tasks

### Adding a New Endpoint

Add route handlers directly in `server.js` following the existing pattern:

```javascript
app.get('/api/new-endpoint', (req, res) => {
  // Handler logic
  res.json({ success: true, data: result });
});
```

### Adding New Pokemon Data

Add objects to the `mockPokemons` array in `server.js` following the data model structure.

### Modifying Filters

Filter logic is in the `GET /api/pokemons` handler. Each filter is an independent `if` block that can be modified or extended.

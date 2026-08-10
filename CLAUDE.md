# CLAUDE.md - AI Agent Context for Pokemon Backend

## Quick Reference

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start with hot-reload (nodemon)
npm start            # Production start

# Docker
npm run docker:build # Build Docker image
npm run docker:run   # Run container on port 3001
```

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Runtime | Node.js | 18+ |
| Framework | Express.js | ^4.18.2 |
| CORS | cors | ^2.8.5 |
| Dev Tool | nodemon | ^3.0.1 |
| Container | Docker | Alpine-based |

## Architecture Overview

This is a **single-file REST API** backend with mock data:

```
pokemon-backend/
├── server.js              # Complete application (routes + data)
├── package.json           # Dependencies and npm scripts
├── .tr-codegen/
│   ├── Dockerfile         # Node 18 Alpine container
│   └── docker-compose.yml # Service orchestration
└── .gitignore
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check - returns `{status: "OK"}` |
| GET | `/api/pokemons` | List all Pokemon (supports filtering) |
| GET | `/api/pokemons/:id` | Get Pokemon by ID |
| GET | `/api/types` | Get all unique Pokemon types |

### Query Parameters for `/api/pokemons`

- `name` - Case-insensitive partial match
- `type` - Case-insensitive exact match
- `legendary` - Boolean string (`"true"` or `"false"`)

## Data Structure

Pokemon objects follow this schema:

```javascript
{
  id: Number,          // Unique identifier
  name: String,        // Pokemon name
  type: String[],      // Array of types (e.g., ["Fire", "Flying"])
  legendary: Boolean,  // Legendary status
  image: String        // URL to PokeAPI sprite
}
```

## Response Format

All API responses follow this structure:

```javascript
// Success
{
  success: true,
  count: Number,      // Only for list endpoints
  data: Object|Array
}

// Error
{
  success: false,
  message: String
}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `NODE_ENV` | development | Environment mode |

## Key Implementation Details

1. **No database** - Uses in-memory mock data array
2. **CORS enabled** - Allows cross-origin requests from frontend
3. **Express.json middleware** - Parses JSON request bodies
4. **Filtering logic** - Client-side in server.js lines 104-136

## Docker Configuration

- Base image: `node:18-alpine`
- Exposed port: 3001
- Health check: `/health` endpoint (30s interval)
- Network: `pokemon-network`

## Code Patterns

### Adding a New Endpoint

```javascript
app.get('/api/new-endpoint', (req, res) => {
  res.json({
    success: true,
    data: yourData
  });
});
```

### Adding New Mock Data

Extend the `mockPokemons` array in `server.js`:

```javascript
{
  id: 13,
  name: 'NewPokemon',
  type: ['Type1', 'Type2'],
  legendary: false,
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/XXX.png'
}
```

## Testing API

```bash
# Health check
curl http://localhost:3001/health

# Get all Pokemon
curl http://localhost:3001/api/pokemons

# Filter by type
curl "http://localhost:3001/api/pokemons?type=fire"

# Get legendary only
curl "http://localhost:3001/api/pokemons?legendary=true"

# Combined filters
curl "http://localhost:3001/api/pokemons?type=psychic&legendary=true"
```

## Common Issues

1. **Port conflict**: Change PORT env variable if 3001 is in use
2. **CORS errors**: Ensure frontend URL is allowed or use proxy
3. **Module not found**: Run `npm install` first

# CLAUDE.md - Pokemon Backend

This file provides guidance for AI agents working with this codebase.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.18.2 | Web framework |
| CORS | 2.8.5 | Cross-origin resource sharing |
| Nodemon | 3.0.1 | Development auto-reload (dev dependency) |
| Docker | - | Containerization |

## Project Overview

A RESTful API server providing Pokemon data with filtering capabilities. The backend serves as a data source for the Pokemon Explorer frontend application.

## Architecture Pattern

**Monolithic Single-File Architecture**

The entire application logic resides in `server.js`:
- Route definitions
- Data storage (in-memory mock data)
- Business logic (filtering)
- Server initialization

## Key Files

```
pokemon-backend/
├── server.js              # Main application (routes, data, logic)
├── package.json           # Dependencies and npm scripts
├── .tr-codegen/
│   ├── Dockerfile         # Docker image configuration
│   └── docker-compose.yml # Container orchestration
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check (returns server status) |
| GET | `/api/pokemons` | List all Pokemon with optional filters |
| GET | `/api/pokemons/:id` | Get single Pokemon by ID |
| GET | `/api/types` | List all unique Pokemon types |

### Query Parameters for `/api/pokemons`

- `name` - Case-insensitive partial match on Pokemon name
- `type` - Case-insensitive exact match on Pokemon type
- `legendary` - Filter by legendary status (`true` or `false`)

## Data Model

```javascript
{
  id: Number,        // Unique identifier
  name: String,      // Pokemon name
  type: String[],    // Array of type names
  legendary: Boolean,// Legendary status
  image: String      // URL to sprite image
}
```

## Response Format

All API responses follow this structure:

```javascript
// Success response
{
  success: true,
  data: Object | Array,
  count?: Number  // Only for list endpoints
}

// Error response
{
  success: false,
  message: String
}
```

## Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Start with auto-reload (nodemon)
npm start        # Start production server
```

## Docker Commands

```bash
npm run docker:build  # Build Docker image
npm run docker:run    # Run container on port 3001
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3001 | Server listening port |
| NODE_ENV | - | Environment mode |

## Important Patterns

### Filtering Logic

Filters are applied sequentially in `GET /api/pokemons`:
1. Name filter: case-insensitive `includes()` match
2. Type filter: case-insensitive exact match against type array
3. Legendary filter: boolean equality check

### CORS Configuration

CORS is enabled globally with default settings, allowing all origins.

## Testing

No test framework is currently configured. To add tests:
1. Install Jest: `npm install --save-dev jest`
2. Add test script to package.json
3. Create `__tests__` directory or `*.test.js` files

## Common Tasks

### Adding a New Pokemon

Edit `mockPokemons` array in `server.js`:

```javascript
{
  id: 13,  // Next sequential ID
  name: 'NewPokemon',
  type: ['Type1', 'Type2'],
  legendary: false,
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/XXX.png'
}
```

### Adding a New Endpoint

Add route handler in `server.js`:

```javascript
app.get('/api/your-endpoint', (req, res) => {
  res.json({
    success: true,
    data: yourData
  });
});
```

### Adding a New Filter Parameter

1. Extract from `req.query` in `/api/pokemons` route
2. Add filtering logic using `Array.filter()`
3. Document in README.md

## Integration Points

- **Frontend**: React application at `http://localhost:3000` (configured via proxy)
- **PokeAPI Sprites**: External image CDN for Pokemon sprites

## Health Check

The `/health` endpoint is used by Docker for container health monitoring:
- Interval: 30 seconds
- Timeout: 3 seconds
- Retries: 3

## Performance Considerations

- In-memory data storage (no database latency)
- Synchronous filtering operations
- Suitable for small datasets (current: 12 Pokemon)

## Scaling Notes

For production scaling, consider:
1. External database (MongoDB, PostgreSQL)
2. Caching layer (Redis)
3. API rate limiting
4. Request validation middleware
5. Logging infrastructure

# CLAUDE.md - AI Agent Guidelines for Pokemon Backend

This document provides essential information for AI agents working with this codebase.

## Technology Stack & Versions

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.18.2 | Web framework |
| CORS | 2.8.5 | Cross-origin resource sharing |
| Nodemon | 3.0.1 (dev) | Hot reload development server |
| Docker | Alpine-based | Containerization |

## Project Type

**RESTful API Server** - A simple Node.js/Express backend providing Pokemon data through HTTP endpoints with filtering capabilities.

## Architecture Pattern

**Monolithic Single-File Architecture**
- All application logic resides in `server.js`
- No database - uses in-memory mock data
- Stateless API design

## Quick Start Commands

```bash
# Install dependencies
npm install

# Development (with hot reload)
npm run dev

# Production
npm start

# Docker
docker build -t pokemon-backend .
docker run -p 3001:3001 pokemon-backend
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/api/pokemons` | List all Pokemon (supports filters) |
| GET | `/api/pokemons/:id` | Get Pokemon by ID |
| GET | `/api/types` | Get all unique Pokemon types |

### Query Parameters for `/api/pokemons`

- `name` - Case-insensitive partial match
- `type` - Case-insensitive exact match
- `legendary` - Boolean filter (`true`/`false`)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3001 | Server port |
| NODE_ENV | development | Environment mode |

## Code Conventions

- **No TypeScript** - Plain JavaScript ES6+
- **CommonJS modules** - Uses `require()` syntax
- **Single file structure** - All logic in `server.js`
- **No ORM/Database** - In-memory mock data array

## Data Model

Pokemon objects follow this structure:
```javascript
{
  id: Number,       // Unique identifier
  name: String,     // Pokemon name
  type: String[],   // Array of types (e.g., ['Fire', 'Flying'])
  legendary: Boolean,
  image: String     // URL to sprite image
}
```

## Response Format

All API responses follow this structure:
```javascript
{
  success: Boolean,
  count: Number,     // Only for list endpoints
  data: Object|Array,
  message: String    // Only for errors
}
```

## File Structure

```
pokemon-backend/
├── server.js          # Main application (entry point, routes, data)
├── package.json       # Dependencies and npm scripts
├── .gitignore         # Git ignore rules
├── README.md          # Project documentation
└── .tr-codegen/       # Docker configuration
    ├── Dockerfile
    └── docker-compose.yml
```

## Key Implementation Details

1. **CORS is enabled** - Accepts requests from any origin
2. **JSON body parsing** - Uses `express.json()` middleware
3. **Mock data** - 12 Pokemon with varied types and legendary status
4. **No authentication** - Public API endpoints
5. **No validation library** - Manual query parameter handling

## Adding New Features

When extending this API:

1. **New endpoints** - Add to `server.js` using Express routing
2. **New Pokemon** - Add to the `mockPokemons` array
3. **New filters** - Extend the filtering logic in `/api/pokemons` route
4. **External database** - Would require refactoring to add models/services

## Docker Notes

- Uses `node:18-alpine` base image
- Includes health check at `/health` endpoint
- Exposed on port 3001
- Production environment set via `NODE_ENV=production`

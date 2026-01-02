# CLAUDE.md - AI Agent Guide for Pokemon Backend

## Quick Reference

| Aspect | Details |
|--------|---------|
| **Language** | JavaScript (Node.js) |
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 4.18.2 |
| **Port** | 3001 (configurable via `PORT` env) |
| **Entry Point** | `server.js` |
| **Package Manager** | npm |

## Technology Stack

### Core Technologies
- **Node.js 18+**: JavaScript runtime environment
- **Express.js 4.18.2**: Minimal web framework for REST API
- **CORS 2.8.5**: Cross-Origin Resource Sharing middleware

### Development Tools
- **Nodemon 3.0.1**: Development server with hot-reload

### Containerization
- **Docker**: Multi-stage Alpine-based image
- **Docker Compose**: Service orchestration

## Project Structure

```
pokemon-backend/
├── server.js              # Main application - routes, middleware, data
├── package.json           # Dependencies and npm scripts
├── .gitignore            # Git ignore patterns
├── README.md             # User documentation
├── CLAUDE.md             # This file - AI agent guide
├── ARCHITECTURE.md       # Architecture documentation
└── .tr-codegen/          # Docker configuration
    ├── Dockerfile        # Container build instructions
    └── docker-compose.yml # Service orchestration
```

## Commands

```bash
# Install dependencies
npm install

# Development server (with hot reload)
npm run dev

# Production server
npm start

# Docker build
npm run docker:build
# OR
docker build -t pokemon-backend .

# Docker run
npm run docker:run
# OR
docker run -p 3001:3001 pokemon-backend
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check endpoint |
| `GET` | `/api/pokemons` | List all Pokemon (with optional filters) |
| `GET` | `/api/pokemons/:id` | Get single Pokemon by ID |
| `GET` | `/api/types` | List all unique Pokemon types |

### Query Parameters for `/api/pokemons`

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Filter by name (case-insensitive partial match) |
| `type` | string | Filter by type (case-insensitive exact match) |
| `legendary` | boolean | Filter by legendary status (`true`/`false`) |

### Response Format

```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "id": 1,
      "name": "Pikachu",
      "type": ["Electric"],
      "legendary": false,
      "image": "https://raw.githubusercontent.com/PokeAPI/sprites/..."
    }
  ]
}
```

## Architecture Pattern

- **Monolithic**: Single-file Express application
- **RESTful API**: Standard REST conventions
- **In-Memory Data**: Mock data stored in memory (no database)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server listening port |
| `NODE_ENV` | development | Environment mode |

## Code Conventions

### Response Structure
All API responses follow this pattern:
```javascript
// Success response
res.json({
  success: true,
  count: data.length,  // For list endpoints
  data: data
});

// Error response
res.status(404).json({
  success: false,
  message: 'Pokemon not found'
});
```

### Filtering Pattern
Filters are applied sequentially using array methods:
```javascript
let filtered = [...data];
if (name) filtered = filtered.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
if (type) filtered = filtered.filter(p => p.type.some(t => t.toLowerCase() === type.toLowerCase()));
```

## Data Model

### Pokemon Object
```typescript
interface Pokemon {
  id: number;
  name: string;
  type: string[];      // Array of type strings
  legendary: boolean;
  image: string;       // URL to PokeAPI sprite
}
```

## Testing

No test framework is currently configured. When adding tests:
- Recommended: Jest + Supertest
- Add to `package.json`: `"test": "jest"`

## Common Tasks

### Adding a New Endpoint
1. Add route in `server.js` after existing routes
2. Follow existing response format pattern
3. Update README.md with endpoint documentation

### Adding New Pokemon Data
1. Add new object to `mockPokemons` array in `server.js`
2. Ensure unique `id` and valid `type` array

### Connecting to a Real Database
1. Install database driver (e.g., `mongoose`, `pg`)
2. Replace `mockPokemons` with database queries
3. Add connection configuration via environment variables

## Docker Notes

- Base image: `node:18-alpine`
- Health check endpoint: `/health`
- Health check interval: 30 seconds
- Exposed port: 3001

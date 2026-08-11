# CLAUDE.md - Pokemon Backend

This file provides guidance for AI agents working with this codebase.

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Runtime | Node.js | 18+ |
| Framework | Express.js | ^4.18.2 |
| Middleware | CORS | ^2.8.5 |
| Dev Tool | Nodemon | ^3.0.1 |
| Container | Docker | Alpine-based |

## Project Overview

This is a **simple REST API** backend for a Pokemon filtering application. It serves mock Pokemon data with filtering capabilities.

## Architecture Pattern

- **Monolithic single-file architecture**
- All logic contained in `server.js`
- No database - uses in-memory mock data
- Stateless REST API

## Key Files

| File | Purpose |
|------|---------|
| `server.js` | Main application - routes, middleware, data |
| `package.json` | Dependencies and npm scripts |
| `.tr-codegen/Dockerfile` | Container build configuration |
| `.tr-codegen/docker-compose.yml` | Docker orchestration |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/pokemons` | List all Pokemon (with filters) |
| GET | `/api/pokemons/:id` | Get single Pokemon by ID |
| GET | `/api/types` | Get all Pokemon types |

### Query Parameters for `/api/pokemons`

- `name` - Filter by name (case-insensitive partial match)
- `type` - Filter by type (case-insensitive exact match)
- `legendary` - Filter by legendary status (`true`/`false`)

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

## Response Format

All API responses follow this structure:

```javascript
{
  success: boolean,
  data: object | array,
  count?: number,      // For list endpoints
  message?: string     // For errors
}
```

## Code Style Guidelines

- ES6+ JavaScript (CommonJS modules)
- Single-file architecture for simplicity
- Express middleware pattern
- RESTful API conventions
- Case-insensitive filtering

## Docker Configuration

- Base image: `node:18-alpine`
- Exposed port: 3001
- Health check: `/health` endpoint
- Auto-restart: `unless-stopped`

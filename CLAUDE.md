# CLAUDE.md - AI Agent Guidance

## Project Overview

This is the Pokemon Backend API - a Node.js/Express REST API that provides Pokemon data with filtering capabilities.

## Technology Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js v4.18.2
- **Language**: JavaScript (ES6+)
- **CORS**: cors v2.8.5
- **Development**: nodemon v3.0.1

## Architecture

- **Pattern**: Simple single-file REST API (monolithic)
- **Data Storage**: In-memory mock data (no database)
- **API Style**: RESTful with JSON responses

## Key Files

| File | Purpose |
|------|---------|
| `server.js` | Main application entry point, routes, and mock data |
| `package.json` | Dependencies and npm scripts |
| `.tr-codegen/Dockerfile` | Container configuration |
| `.tr-codegen/docker-compose.yml` | Docker orchestration |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/pokemons` | List all Pokemon (with optional filters) |
| GET | `/api/pokemons/:id` | Get Pokemon by ID |
| GET | `/api/types` | Get all available types |

## Query Parameters for `/api/pokemons`

- `name` - Case-insensitive partial match
- `type` - Case-insensitive exact match
- `legendary` - Boolean string (`"true"` or `"false"`)

## Conventions

- All responses follow the format: `{ success: boolean, data: any, count?: number }`
- Error responses include: `{ success: false, message: string }`
- HTTP status codes: 200 (success), 404 (not found)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `NODE_ENV` | - | Environment mode |

## Running the Application

```bash
# Development
npm run dev

# Production
npm start

# Docker
docker-compose -f .tr-codegen/docker-compose.yml up
```

## Constraints & Assumptions

- Mock data is hardcoded (12 Pokemon)
- No authentication required
- No database connection
- CORS is enabled for all origins
- Single-threaded Node.js process

## Code Generation Guidelines

- Follow Express.js patterns for new routes
- Use async/await for asynchronous operations
- Maintain consistent response format
- Add new Pokemon data following the existing schema:
  ```javascript
  {
    id: number,
    name: string,
    type: string[],
    legendary: boolean,
    image: string
  }
  ```

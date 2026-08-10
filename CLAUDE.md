# CLAUDE.md - AI Agent Guidance for Pokemon Backend

## Project Overview

This is a Node.js/Express REST API backend for the Pokemon Explorer application. It provides endpoints for fetching and filtering Pokemon data.

## Technology Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js v4.18.2
- **Middleware**: CORS v2.8.5
- **Development**: Nodemon v3.0.1 (hot-reload)
- **Containerization**: Docker with Alpine-based Node.js image

## Architecture Pattern

- **Pattern**: Simple RESTful API with in-memory data store
- **Structure**: Single-file server architecture (`server.js`)
- **Data**: Mock data embedded in server.js (no database)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/api/pokemons` | Get all Pokemon with optional filtering |
| GET | `/api/pokemons/:id` | Get specific Pokemon by ID |
| GET | `/api/types` | Get all unique Pokemon types |

### Query Parameters for `/api/pokemons`

- `name` - Case-insensitive partial name match
- `type` - Case-insensitive exact type match
- `legendary` - Boolean string (`"true"` or `"false"`)

## Code Conventions

- ES6+ JavaScript syntax (CommonJS modules)
- Express middleware chain pattern
- Error responses use `{ success: false, message: string }` format
- Success responses use `{ success: true, data: any, count?: number }` format
- Port configured via `PORT` environment variable (default: 3001)

## File Structure

```
pokemon-backend/
├── server.js              # Main application entry point and API routes
├── package.json           # Dependencies and npm scripts
├── .gitignore             # Git ignore rules
├── README.md              # Project documentation
└── .tr-codegen/           # Docker/deployment configuration
    ├── Dockerfile         # Container build instructions
    └── docker-compose.yml # Container orchestration
```

## Important Constraints

1. **No Database**: Data is mocked in-memory; changes are not persisted
2. **Single File**: All routes and logic are in `server.js`
3. **CORS Enabled**: Accepts requests from any origin
4. **No Authentication**: Public API without auth requirements

## Development Commands

```bash
npm install    # Install dependencies
npm run dev    # Start with hot-reload (nodemon)
npm start      # Start production server
```

## Docker Commands

```bash
npm run docker:build  # Build Docker image
npm run docker:run    # Run container on port 3001
```

## Safe Code Generation Notes

- When adding new endpoints, follow the existing response format pattern
- Keep filtering logic in the route handlers
- Maintain the mock data structure: `{ id, name, type[], legendary, image }`
- Health check endpoint is used by Docker for container health monitoring

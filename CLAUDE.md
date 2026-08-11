# CLAUDE.md - AI Agent Guidance

This document provides context for AI agents working with the Pokemon Backend API codebase.

## Project Overview

A RESTful API backend built with Node.js and Express.js that serves Pokemon data with filtering capabilities. The API provides endpoints for retrieving Pokemon by various criteria including name, type, and legendary status.

## Technology Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js 4.18.x
- **Language**: JavaScript (ES6+)
- **Middleware**: CORS for cross-origin resource sharing
- **Development**: Nodemon for hot-reloading during development
- **Containerization**: Docker with Alpine Linux base image

## Architecture Pattern

- **Pattern**: Monolithic REST API
- **Structure**: Single-file server architecture
- **Data Storage**: In-memory mock data (no database)

## Key Constraints

1. **No Database**: Data is stored in-memory as mock data; changes are not persisted
2. **Single Entry Point**: All application logic is in `server.js`
3. **Stateless**: No session management or authentication
4. **CORS Enabled**: All origins are allowed by default

## Code Conventions

- **Routing**: RESTful conventions with `/api/` prefix for data endpoints
- **Response Format**: JSON with consistent structure: `{ success: boolean, data: any, count?: number }`
- **Error Handling**: HTTP status codes with error messages in response body
- **Filtering**: Query parameters for filtering (case-insensitive)

## File Structure

```
pokemon-backend/
├── server.js           # Main application entry point (Express app, routes, mock data)
├── package.json        # Dependencies and npm scripts
├── .gitignore          # Git ignore configuration
├── .tr-codegen/        # Docker deployment configuration
│   ├── Dockerfile      # Container build instructions
│   └── docker-compose.yml  # Container orchestration
└── README.md           # Project documentation
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/api/pokemons` | List all Pokemon with optional filters |
| GET | `/api/pokemons/:id` | Get Pokemon by ID |
| GET | `/api/types` | Get all unique Pokemon types |

## Query Parameters

- `name` - Filter by name (case-insensitive partial match)
- `type` - Filter by type (case-insensitive exact match)
- `legendary` - Filter by legendary status (`true` or `false`)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server listening port |
| `NODE_ENV` | - | Environment mode (development/production) |

## Development Commands

```bash
npm install     # Install dependencies
npm run dev     # Start with hot-reloading (nodemon)
npm start       # Start production server
```

## Docker Commands

```bash
npm run docker:build  # Build Docker image
npm run docker:run    # Run Docker container
```

## Safe Code Generation Notes

- When adding new routes, follow the existing pattern in `server.js`
- Maintain the consistent JSON response format
- Keep CORS configuration permissive for frontend integration
- The mock data array `mockPokemons` can be extended with new Pokemon entries
- Health check endpoint is used by Docker for container health monitoring

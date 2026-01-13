# AI Agent Guidance - Pokemon Backend

## Overview

This is a Node.js/Express REST API backend for a Pokemon filtering application. It provides endpoints for retrieving and filtering Pokemon data.

## Programming Languages and Versions

- **JavaScript (ES6+)**: Primary language
- **Node.js**: v18 or later recommended
- **npm**: Package manager

## Frameworks and Major Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| Express | ^4.18.2 | Web framework for REST API |
| CORS | ^2.8.5 | Cross-Origin Resource Sharing middleware |
| Nodemon | ^3.0.1 | Development auto-reload (devDependency) |

## Architecture Pattern

- **Monolithic Single-File Architecture**: All logic contained in `server.js`
- **RESTful API Design**: Standard HTTP methods and resource-based URLs
- **In-Memory Data Store**: Mock data stored as JavaScript array (no database)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/api/pokemons` | Get all Pokemon with optional filtering |
| GET | `/api/pokemons/:id` | Get specific Pokemon by ID |
| GET | `/api/types` | Get all unique Pokemon types |

### Query Parameters for `/api/pokemons`

- `name` - Filter by Pokemon name (case-insensitive partial match)
- `type` - Filter by Pokemon type (case-insensitive exact match)
- `legendary` - Filter by legendary status (`true` or `false`)

## Response Format

All responses follow this JSON structure:

```json
{
  "success": boolean,
  "count": number,      // For list endpoints
  "data": object|array,
  "message": string     // For error responses
}
```

## Constraints and Conventions

1. **Port Configuration**: Default port is 3001, configurable via `PORT` environment variable
2. **Data Storage**: Uses mock in-memory data - no persistence between restarts
3. **Error Handling**: Returns 404 for non-existent Pokemon IDs with standardized error response
4. **CORS**: Enabled globally for all routes to support frontend integration

## File Structure

```
pokemon-backend/
├── server.js              # Main application entry point (all logic)
├── package.json           # Dependencies and npm scripts
├── .gitignore            # Git ignore configuration
├── README.md             # Project documentation
└── .tr-codegen/          # Docker deployment configuration
    ├── Dockerfile        # Container image definition
    └── docker-compose.yml # Container orchestration
```

## Development Notes

- **Start Command**: `npm start` (production) or `npm run dev` (development with auto-reload)
- **Testing**: No test framework configured
- **Linting**: No linter configured
- **Type Safety**: Plain JavaScript without TypeScript

## Code Generation Considerations

When generating code for this project:

1. **Keep it Simple**: Maintain the single-file architecture unless significant complexity is added
2. **Follow Existing Patterns**: Use similar response format `{ success, data/count/message }`
3. **Use ES6 Syntax**: Arrow functions, const/let, template literals
4. **Preserve Mock Data**: Data is hardcoded; consider adding to the existing array format
5. **CORS Compatibility**: All new endpoints should work with frontend on different port
6. **Health Check**: Keep `/health` endpoint functional for Docker health monitoring

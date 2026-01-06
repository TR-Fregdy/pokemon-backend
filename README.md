# Pokemon Backend API

A RESTful Node.js/Express API serving Pokemon data with filtering capabilities. This backend powers the Pokemon Explorer frontend application.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Or start production server
npm start
```

Server runs at: `http://localhost:3001`

## Features

- RESTful API design with JSON responses
- Multi-criteria filtering (name, type, legendary status)
- CORS enabled for cross-origin requests
- Docker support with health monitoring
- In-memory mock data (12 Pokemon)

## API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check for monitoring |
| GET | `/api/pokemons` | List Pokemon with optional filters |
| GET | `/api/pokemons/:id` | Get single Pokemon by ID |
| GET | `/api/types` | List all available types |

### Query Parameters

**GET /api/pokemons**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Case-insensitive partial match |
| `type` | string | Case-insensitive exact type match |
| `legendary` | boolean | Filter by legendary status |

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
      "image": "https://..."
    }
  ]
}
```

### Example Requests

```bash
# Get all Pokemon
curl http://localhost:3001/api/pokemons

# Search by name
curl http://localhost:3001/api/pokemons?name=pika

# Filter by type
curl http://localhost:3001/api/pokemons?type=fire

# Get legendary Pokemon
curl http://localhost:3001/api/pokemons?legendary=true

# Combine filters
curl http://localhost:3001/api/pokemons?type=psychic&legendary=true

# Get single Pokemon
curl http://localhost:3001/api/pokemons/5

# Get all types
curl http://localhost:3001/api/types
```

## Development

### Prerequisites

- Node.js v18 or later
- npm or yarn

### Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Run Docker container |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server listening port |
| `NODE_ENV` | - | Environment mode |

## Docker Deployment

### Standalone Container

```bash
# Build
docker build -t pokemon-backend -f .tr-codegen/Dockerfile .

# Run
docker run -p 3001:3001 pokemon-backend
```

### Docker Compose

```bash
# Start
docker-compose -f .tr-codegen/docker-compose.yml up -d

# Stop
docker-compose -f .tr-codegen/docker-compose.yml down
```

## Project Structure

```
pokemon-backend/
├── server.js              # Main application (routes, data, logic)
├── package.json           # Dependencies and scripts
├── .tr-codegen/
│   ├── Dockerfile         # Container image definition
│   └── docker-compose.yml # Multi-container orchestration
├── .gitignore             # Git exclusions
├── README.md              # This file
├── CLAUDE.md              # AI agent guidance
└── ARCHITECTURE.md        # System architecture docs
```

## Data Overview

### Pokemon Types Available

Dragon, Electric, Fire, Flying, Grass, Ice, Poison, Psychic, Water

### Sample Pokemon

| Regular | Legendary |
|---------|-----------|
| Pikachu, Charizard, Blastoise | Mewtwo, Mew |
| Venusaur, Gyarados, Dragonite | Articuno, Zapdos, Moltres |
| Alakazam | |

## Related Documentation

- [CLAUDE.md](./CLAUDE.md) - AI agent guidance and patterns
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture overview

## Integration

This API is designed to work with:
- **Pokemon Frontend**: React application at `http://localhost:3000`
- **PokeAPI Sprites**: External CDN for Pokemon images

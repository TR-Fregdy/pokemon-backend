# Pokemon Backend API

A RESTful API server built with Node.js and Express for managing and filtering Pokemon data. This backend serves as the data layer for the Pokemon Explorer application.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v18+ | Runtime environment |
| Express.js | ^4.18.2 | Web framework |
| CORS | ^2.8.5 | Cross-origin resource sharing |
| Nodemon | ^3.0.1 | Development auto-reload |

## Features

- RESTful API endpoints for Pokemon data
- Filter by name, type, and legendary status
- CORS enabled for frontend integration
- Docker support with health checks
- Mock data with 12 Pokemon (7 regular, 5 legendary)

## Quick Start

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pokemon-backend

# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Or start production server
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/api/pokemons` | Get all Pokemon with optional filtering |
| GET | `/api/pokemons/:id` | Get specific Pokemon by ID |
| GET | `/api/types` | Get all available Pokemon types |

### Query Parameters for `/api/pokemons`

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Filter by Pokemon name (case-insensitive partial match) |
| `type` | string | Filter by Pokemon type (case-insensitive exact match) |
| `legendary` | string | Filter by legendary status (`true` or `false`) |

### Example Requests

```bash
# Get all Pokemon
curl http://localhost:3001/api/pokemons

# Filter by name
curl http://localhost:3001/api/pokemons?name=pika

# Filter by type
curl http://localhost:3001/api/pokemons?type=fire

# Filter legendary Pokemon
curl http://localhost:3001/api/pokemons?legendary=true

# Combined filters
curl http://localhost:3001/api/pokemons?type=psychic&legendary=true
```

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
      "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
    }
  ]
}
```

## Docker Setup

```bash
# Build the image
npm run docker:build

# Run the container
npm run docker:run
```

Or using docker commands directly:

```bash
docker build -t pokemon-backend .
docker run -p 3001:3001 pokemon-backend
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `NODE_ENV` | development | Environment mode |

## Project Structure

```
pokemon-backend/
├── server.js          # Main application file with routes and data
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `node server.js` | Start production server |
| `dev` | `nodemon server.js` | Start development server with auto-reload |
| `docker:build` | `docker build -t pokemon-backend .` | Build Docker image |
| `docker:run` | `docker run -p 3001:3001 pokemon-backend` | Run Docker container |

## Mock Data

The API includes mock data for 12 Pokemon:

**Regular Pokemon:** Pikachu, Charizard, Blastoise, Venusaur, Gyarados, Dragonite, Alakazam

**Legendary Pokemon:** Mewtwo, Mew, Articuno, Zapdos, Moltres

Each Pokemon entity contains:
- `id` - Unique identifier
- `name` - Pokemon name
- `type` - Array of types (e.g., ["Fire", "Flying"])
- `legendary` - Boolean indicating legendary status
- `image` - URL to Pokemon sprite from PokeAPI

## Architecture

For detailed architecture information, see [ARCHITECTURE.md](./ARCHITECTURE.md).

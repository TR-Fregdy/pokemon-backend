# Pokemon Backend API

A simple Node.js/Express REST API for managing and filtering Pokemon data. This backend serves as the data layer for the Pokemon Explorer application.

## Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 4.18.2
- **Middleware**: CORS 2.8.5
- **Development**: Nodemon 3.0.1

## Quick Start

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Start production server
npm start
```

The server runs on `http://localhost:3001` by default.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check endpoint |
| `GET` | `/api/pokemons` | Get all Pokemon with optional filtering |
| `GET` | `/api/pokemons/:id` | Get specific Pokemon by ID |
| `GET` | `/api/types` | Get all available Pokemon types |

### Query Parameters for `/api/pokemons`

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Filter by Pokemon name (case-insensitive partial match) |
| `type` | string | Filter by Pokemon type (case-insensitive exact match) |
| `legendary` | boolean | Filter by legendary status (`true` or `false`) |

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

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment mode |

## Project Structure

```
pokemon-backend/
├── server.js          # Main application file with routes and data
├── package.json       # Dependencies and npm scripts
└── README.md          # This file
```

## Mock Data

The API includes mock data for 12 Pokemon:

**Regular Pokemon**: Pikachu, Charizard, Blastoise, Venusaur, Gyarados, Dragonite, Alakazam

**Legendary Pokemon**: Mewtwo, Mew, Articuno, Zapdos, Moltres

## Architecture

For detailed architecture information, see [ARCHITECTURE.md](./ARCHITECTURE.md).

# Pokemon Backend API

A lightweight Node.js/Express REST API that serves Pokemon data with filtering capabilities. This backend powers the Pokemon Explorer application, providing endpoints for listing, searching, and filtering Pokemon by name, type, and legendary status.

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | v18+ | JavaScript runtime |
| Express.js | ^4.18.2 | Web framework |
| CORS | ^2.8.5 | Cross-origin resource sharing |
| Nodemon | ^3.0.1 | Development auto-reload |
| Docker | - | Containerization |

## Quick Start

### Prerequisites

- Node.js v18 or later
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pokemon-backend

# Install dependencies
npm install

# Start the development server (with auto-reload)
npm run dev

# Or start the production server
npm start
```

The API server starts at `http://localhost:3001`.

### Docker

```bash
# Build and run with Docker
docker build -f .tr-codegen/Dockerfile -t pokemon-backend .
docker run -p 3001:3001 pokemon-backend

# Or use Docker Compose
docker-compose -f .tr-codegen/docker-compose.yml up -d
```

## API Endpoints

### Health Check

```
GET /health
Response: { "status": "OK", "message": "Pokemon API is running!" }
```

### List Pokemon

```
GET /api/pokemons
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Case-insensitive partial match on Pokemon name |
| `type` | string | Case-insensitive exact match on Pokemon type |
| `legendary` | string | `"true"` or `"false"` to filter by legendary status |

**Response:**
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

### Get Pokemon by ID

```
GET /api/pokemons/:id
```

**Response (200):**
```json
{ "success": true, "data": { ... } }
```

**Response (404):**
```json
{ "success": false, "message": "Pokemon not found" }
```

### List Types

```
GET /api/types
```

**Response:**
```json
{
  "success": true,
  "data": ["Dragon", "Electric", "Fire", "Flying", "Grass", "Ice", "Poison", "Psychic", "Water"]
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

# Filter legendary Pokemon
curl http://localhost:3001/api/pokemons?legendary=true

# Combined filters
curl "http://localhost:3001/api/pokemons?type=psychic&legendary=true"
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server listening port |
| `NODE_ENV` | `development` | Environment mode (`development` / `production`) |

## Mock Data

The API serves 12 hardcoded Pokemon from an in-memory array:

**Regular Pokemon:** Pikachu, Charizard, Blastoise, Venusaur, Gyarados, Dragonite, Alakazam

**Legendary Pokemon:** Mewtwo, Mew, Articuno, Zapdos, Moltres

Each Pokemon object includes: `id`, `name`, `type` (array), `legendary` (boolean), and `image` (PokeAPI sprite URL).

## Project Structure

```
pokemon-backend/
├── server.js              # Main application (entry point, routes, data)
├── package.json           # Dependencies and npm scripts
├── .tr-codegen/           # Deployment configuration
│   ├── Dockerfile         # Docker image build
│   └── docker-compose.yml # Container orchestration
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm start` | `node server.js` | Start production server |
| `npm run dev` | `nodemon server.js` | Start dev server with auto-reload |
| `npm run docker:build` | `docker build ...` | Build Docker image |
| `npm run docker:run` | `docker run ...` | Run Docker container |

## Architecture

For a detailed overview of the system architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md).

# .tr-codegen Directory

## Purpose

This directory contains Docker deployment configuration files for containerizing and orchestrating the Pokemon Backend API.

## Key Files

| File | Description |
|------|-------------|
| `Dockerfile` | Defines the Docker image build process for the Node.js application |
| `docker-compose.yml` | Orchestrates container deployment with environment configuration |

## File Responsibilities

### Dockerfile

- **Base Image**: `node:18-alpine` (lightweight Node.js runtime)
- **Build Process**: Copies package files, installs dependencies, copies source code
- **Exposed Port**: 3001
- **Health Check**: Configured to poll `/health` endpoint every 30 seconds
- **Entry Point**: `npm start`

### docker-compose.yml

- **Service Name**: `main_app_pokemon-backend`
- **Container Name**: `main_app_pokemon`
- **Port Mapping**: 3001:3001
- **Environment Variables**: `NODE_ENV=production`, `PORT=3001`
- **Restart Policy**: `unless-stopped`
- **Network**: `pokemon-network`

## Connection to Other Parts

- **Parent Directory**: Contains the main application source (`server.js`)
- **Frontend Integration**: The `pokemon-network` Docker network allows frontend containers to communicate with this backend service
- **Health Monitoring**: The health check configuration ensures container orchestration tools can verify service availability

## Usage

```bash
# Build and run with Docker Compose
cd ..
docker-compose -f .tr-codegen/docker-compose.yml up -d

# Or build manually
docker build -t pokemon-backend -f .tr-codegen/Dockerfile ..
docker run -p 3001:3001 pokemon-backend
```

## Related Documentation

- See [ARCHITECTURE.md](../ARCHITECTURE.md) for high-level system design

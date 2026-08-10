# .tr-codegen Directory

## Purpose

This directory contains Docker and deployment configuration files for containerizing the Pokemon Backend API.

## Key Files

| File | Description |
|------|-------------|
| `Dockerfile` | Multi-stage Docker build instructions for creating a production-ready container |
| `docker-compose.yml` | Docker Compose configuration for orchestrating the backend service |

## Dockerfile Details

- **Base Image**: `node:18-alpine` (minimal footprint)
- **Working Directory**: `/app`
- **Exposed Port**: 3001
- **Health Check**: Polls `/health` endpoint every 30 seconds
- **Start Command**: `npm start`

## docker-compose.yml Details

- **Service Name**: `main_app_pokemon-backend`
- **Container Name**: `main_app_pokemon`
- **Port Mapping**: `3001:3001`
- **Environment Variables**:
  - `NODE_ENV=production`
  - `PORT=3001`
- **Restart Policy**: `unless-stopped`
- **Network**: `pokemon-network`

## Usage

```bash
# Build and run using Docker Compose
docker-compose -f .tr-codegen/docker-compose.yml up -d

# Stop the service
docker-compose -f .tr-codegen/docker-compose.yml down
```

## Connection to Project

This directory is referenced by:
- `package.json` docker scripts (build from parent directory)
- Frontend's `docker-compose.yml` (includes backend as a dependency)

For overall project architecture, see [ARCHITECTURE.md](../ARCHITECTURE.md).

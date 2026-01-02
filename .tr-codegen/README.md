# .tr-codegen Directory

> Docker configuration files for containerized deployment

## Purpose

This directory contains Docker-related configuration files used for building and deploying the Pokemon Backend API in containerized environments.

## Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Container build instructions using Node.js 18 Alpine |
| `docker-compose.yml` | Service orchestration configuration |

## Dockerfile

The Dockerfile uses a single-stage build with `node:18-alpine` base image:

1. Sets `/app` as working directory
2. Copies and installs dependencies
3. Copies source code
4. Exposes port 3001
5. Configures health check endpoint
6. Runs `npm start` on container launch

### Health Check Configuration
- **Endpoint**: `http://localhost:3001/health`
- **Interval**: 30 seconds
- **Timeout**: 3 seconds
- **Start Period**: 5 seconds
- **Retries**: 3

## docker-compose.yml

Orchestrates the backend service with:

- **Service Name**: `main_app_pokemon-backend`
- **Container Name**: `main_app_pokemon`
- **Port Mapping**: 3001:3001
- **Network**: `pokemon-network`
- **Environment**: Production mode with PORT=3001
- **Restart Policy**: `unless-stopped`

## Usage

```bash
# Build and run with Docker Compose
cd .tr-codegen
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Related Documentation

- [Project README](../README.md) - Quick start guide
- [ARCHITECTURE.md](../ARCHITECTURE.md) - System architecture overview
- [CLAUDE.md](../CLAUDE.md) - AI agent reference guide

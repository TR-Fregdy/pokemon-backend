# .tr-codegen Directory

This directory contains Docker and deployment configuration files for the Pokemon Backend API.

## Contents

| File | Purpose |
|------|---------|
| `Dockerfile` | Docker image build configuration |
| `docker-compose.yml` | Docker Compose service orchestration |

## Dockerfile

Multi-stage build based on `node:18-alpine`:
- Installs npm dependencies
- Copies source code
- Exposes port 3001
- Includes health check configuration
- Runs `npm start` as entry command

## docker-compose.yml

Defines the `main_app_pokemon-backend` service:
- Builds from parent directory context
- Maps port 3001:3001
- Sets production environment variables
- Configures health checks (30s interval)
- Uses `pokemon-network` bridge network

## Usage

```bash
# Build and run with Docker Compose
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

## Related Documentation

See [ARCHITECTURE.md](../ARCHITECTURE.md) for system architecture details.

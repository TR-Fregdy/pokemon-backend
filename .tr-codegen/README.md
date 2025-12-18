# .tr-codegen Directory

> Part of [Pokemon Backend API](../ARCHITECTURE.md)

This directory contains deployment and containerization configuration files for the Pokemon Backend API.

## Purpose

The `.tr-codegen` directory holds Docker-related configuration that enables the application to be containerized and deployed consistently across different environments.

## Files

### Dockerfile

**Purpose**: Defines the Docker image build process for the backend API.

**Key Features**:
- Base image: `node:18-alpine` (lightweight Node.js image)
- Installs npm dependencies
- Copies application source code
- Exposes port 3001
- Includes health check configuration
- Runs `npm start` as the entry command

**Usage**:
```bash
# Build from repository root
docker build -f .tr-codegen/Dockerfile -t pokemon-backend .
```

### docker-compose.yml

**Purpose**: Orchestrates the backend container with proper networking and configuration.

**Service Definition**:
- Service name: `main_app_pokemon-backend`
- Container name: `main_app_pokemon`
- Port mapping: `3001:3001`
- Network: `pokemon-network`
- Restart policy: `unless-stopped`

**Environment Variables**:
| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | production | Enables production mode |
| `PORT` | 3001 | Server listening port |

**Health Check Configuration**:
| Parameter | Value |
|-----------|-------|
| Test | `curl -f http://localhost:3001/health` |
| Interval | 30 seconds |
| Timeout | 10 seconds |
| Retries | 3 |
| Start Period | 40 seconds |

**Usage**:
```bash
# Start the service
docker-compose -f .tr-codegen/docker-compose.yml up -d

# Stop the service
docker-compose -f .tr-codegen/docker-compose.yml down
```

## Relationship to Architecture

```
┌─────────────────────────────────────────────┐
│              Docker Container               │
│  ┌───────────────────────────────────────┐  │
│  │       node:18-alpine                  │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │    server.js (Express App)      │  │  │
│  │  │    Port: 3001                   │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Network: pokemon-network                   │
└─────────────────────────────────────────────┘
```

## Related Documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Full system architecture overview
- [CLAUDE.md](../CLAUDE.md) - AI agent context and quick reference

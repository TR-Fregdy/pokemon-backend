# Docker Deployment Configuration

> Part of [Pokemon Backend Architecture](../ARCHITECTURE.md)

This directory contains Docker deployment configurations for the Pokemon Backend API.

## Directory Structure

```
.tr-codegen/
├── Dockerfile           # Container build instructions
├── docker-compose.yml   # Service orchestration
└── README.md            # This file
```

## File Descriptions

### Dockerfile

**Purpose**: Defines the container image for the Pokemon Backend API.

**Base Image**: `node:18-alpine`

**Build Stages**:
1. Set working directory to `/app`
2. Copy `package*.json` files
3. Install dependencies with `npm install`
4. Copy source code
5. Expose port 3001
6. Configure health check
7. Set start command

**Key Instructions**:

| Instruction | Purpose |
|-------------|---------|
| `FROM node:18-alpine` | Lightweight Node.js base image |
| `WORKDIR /app` | Set working directory |
| `COPY package*.json ./` | Copy dependency manifests |
| `RUN npm install` | Install dependencies |
| `COPY . .` | Copy application code |
| `EXPOSE 3001` | Document exposed port |
| `HEALTHCHECK` | Container health monitoring |
| `CMD ["npm", "start"]` | Start application |

**Health Check Configuration**:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1
```

### docker-compose.yml

**Purpose**: Orchestrates the backend service with networking and configuration.

**Service Definition**:

| Property | Value | Purpose |
|----------|-------|---------|
| `build.context` | `..` | Build from parent directory |
| `build.dockerfile` | `.tr-codegen/Dockerfile` | Dockerfile path |
| `container_name` | `main_app_pokemon` | Container identifier |
| `ports` | `3001:3001` | Port mapping |
| `environment` | NODE_ENV, PORT | Environment variables |
| `restart` | `unless-stopped` | Restart policy |
| `healthcheck` | `/health` endpoint | Container health |

**Network Configuration**:
- Network name: `pokemon-network`
- All services on same network for inter-container communication

## Usage

### Build and Run with Docker

```bash
# From repository root
docker build -t pokemon-backend -f .tr-codegen/Dockerfile .

# Run container
docker run -p 3001:3001 pokemon-backend
```

### Using Docker Compose

```bash
# Start service
docker-compose -f .tr-codegen/docker-compose.yml up -d

# View logs
docker-compose -f .tr-codegen/docker-compose.yml logs -f

# Stop service
docker-compose -f .tr-codegen/docker-compose.yml down
```

### Health Check

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' main_app_pokemon

# Manual health check
curl http://localhost:3001/health
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `3001` | Server listening port |

## Integration with Frontend

The frontend's `docker-compose.yml` includes this service as a dependency:

```yaml
depends_on:
  - main_app_pokemon-backend
```

Both containers run on the `pokemon-network` bridge network.

## Related Documentation

- [../ARCHITECTURE.md](../ARCHITECTURE.md) - Full architecture overview
- [../CLAUDE.md](../CLAUDE.md) - AI agent context

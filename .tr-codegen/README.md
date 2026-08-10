# Deployment Configuration (.tr-codegen)

> Part of [Pokemon Backend](../ARCHITECTURE.md) | [Deployment Architecture](../ARCHITECTURE.md#deployment-architecture)

## Purpose

This directory contains Docker configuration files for containerizing and deploying the Pokemon Backend API.

## Directory Structure

```
.tr-codegen/
├── Dockerfile            # Docker container definition
├── docker-compose.yml    # Service orchestration
└── README.md             # This file
```

## File Descriptions

### Dockerfile

Single-stage Node.js container:

```dockerfile
FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Configure
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["npm", "start"]
```

**Key Features:**
- Node.js 18 Alpine base (minimal footprint)
- Built-in health check using `/health` endpoint
- Production npm start command

### docker-compose.yml

Service definition for standalone deployment:

| Property | Value | Description |
|----------|-------|-------------|
| Service name | `main_app_pokemon-backend` | Container service identifier |
| Container name | `main_app_pokemon` | Actual container name |
| Port | 3001:3001 | Host:Container port mapping |
| Network | `pokemon-network` | Bridge network |
| Restart | `unless-stopped` | Auto-restart policy |

**Environment Variables:**
```yaml
environment:
  - NODE_ENV=production
  - PORT=3001
```

**Health Check:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Usage

### Build Image

```bash
# From project root
docker build -f .tr-codegen/Dockerfile -t pokemon-backend .

# Or using npm script
npm run docker:build
```

### Run Container

```bash
# Direct docker run
docker run -p 3001:3001 pokemon-backend

# Or using npm script
npm run docker:run
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

## Health Monitoring

The container includes automatic health checks:

```
Check interval: 30 seconds
Timeout: 10 seconds
Retries: 3
Start period: 40 seconds
```

**Health Endpoint Response:**
```json
{
  "status": "OK",
  "message": "Pokemon API is running!"
}
```

**Check Container Health:**
```bash
docker inspect --format='{{.State.Health.Status}}' main_app_pokemon
```

## Network Configuration

```
┌─────────────────────────────────┐
│       pokemon-network           │
│                                 │
│  ┌───────────────────────────┐ │
│  │    pokemon-backend        │ │
│  │    Port: 3001             │ │
│  │    Health: /health        │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | production | Runtime environment |
| `PORT` | 3001 | Server listening port |

## Customization

### Change Port

1. Update Dockerfile EXPOSE directive
2. Update docker-compose.yml port mapping
3. Update environment PORT variable

### Add Volume for Logs

```yaml
volumes:
  - ./logs:/app/logs
```

### Add Database Connection

```yaml
environment:
  - DATABASE_URL=mongodb://db:27017/pokemon
depends_on:
  - db
```

## Troubleshooting

### Container Won't Start

1. Check logs: `docker logs main_app_pokemon`
2. Verify port 3001 is not in use
3. Ensure Dockerfile context is project root

### Health Check Failing

1. Wait for start_period (40s)
2. Verify curl is available in container
3. Check `/health` endpoint manually

### Network Issues

```bash
# Inspect network
docker network inspect pokemon-network

# Recreate network
docker-compose down
docker network rm pokemon-network
docker-compose up -d
```

## Related Documentation

- [Backend Architecture](../ARCHITECTURE.md) - Full architecture documentation
- [CLAUDE.md](../CLAUDE.md) - AI agent quick reference
- [Frontend Deployment](../../pokemon-frontend/.tr-codegen/README.md) - Frontend container config

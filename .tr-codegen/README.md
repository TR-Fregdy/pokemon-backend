# TR-Codegen Directory

This directory contains Docker and deployment configuration files generated for containerization.

> For detailed architecture information, see [ARCHITECTURE.md](../ARCHITECTURE.md)

## Directory Structure

```
.tr-codegen/
├── Dockerfile          # Docker build configuration
├── docker-compose.yml  # Container orchestration
└── README.md           # This file
```

## Files Overview

### `Dockerfile`

Docker configuration for the Node.js Express API server.

**Base Image**: `node:18-alpine`

**Build Steps**:
1. Set working directory to `/app`
2. Copy `package*.json` files
3. Install dependencies with `npm install`
4. Copy application source code
5. Expose port 3001
6. Configure health check
7. Start with `npm start`

**Health Check**:
- Endpoint: `http://localhost:3001/health`
- Interval: 30 seconds
- Timeout: 3 seconds
- Start period: 5 seconds
- Retries: 3

**Build Command**:
```bash
docker build -f .tr-codegen/Dockerfile -t pokemon-backend .
```

### `docker-compose.yml`

Docker Compose configuration for the backend service.

**Service Configuration**:

| Setting | Value |
|---------|-------|
| Service Name | `main_app_pokemon-backend` |
| Container Name | `main_app_pokemon` |
| Port Mapping | 3001:3001 |
| Environment | NODE_ENV=production, PORT=3001 |
| Restart Policy | unless-stopped |
| Network | pokemon-network |

**Health Check**:
- Command: `curl -f http://localhost:3001/health`
- Interval: 30s
- Timeout: 10s
- Retries: 3
- Start period: 40s

**Run Command**:
```bash
cd .tr-codegen
docker-compose up -d
```

## Deployment

### Single Service Deployment

```bash
# Build the image
docker build -f .tr-codegen/Dockerfile -t pokemon-backend ..

# Run the container
docker run -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  pokemon-backend
```

### Docker Compose Deployment

```bash
cd .tr-codegen
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Verify Health

```bash
curl http://localhost:3001/health
# Expected: {"status":"OK","message":"Pokemon API is running!"}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3001 | Server port |
| NODE_ENV | production | Environment mode |

## Network

The `pokemon-network` bridge network allows communication between frontend and backend containers when deployed together.

## Notes

- Container uses Alpine Linux for minimal image size
- Health check ensures container readiness
- Restart policy ensures service recovery after failures
- Production environment disables development features

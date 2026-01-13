# .tr-codegen Directory

This directory contains Docker deployment configuration files for the Pokemon Backend API.

## Purpose

The `.tr-codegen` directory holds infrastructure-as-code files for containerizing and deploying the backend application. These files enable consistent deployment across different environments.

## Key Files

| File | Description |
|------|-------------|
| `Dockerfile` | Multi-stage Docker build configuration for the Node.js application |
| `docker-compose.yml` | Container orchestration configuration for running the backend service |

## Dockerfile

The Dockerfile uses a Node.js 18 Alpine base image and:
- Sets up the working directory
- Installs npm dependencies
- Copies application source code
- Exposes port 3001
- Configures health check endpoint
- Starts the application with `npm start`

## docker-compose.yml

Defines the `main_app_pokemon-backend` service with:
- Port mapping: 3001:3001
- Environment variables: `NODE_ENV=production`, `PORT=3001`
- Health check configuration
- Restart policy: `unless-stopped`
- Network: `pokemon-network`

## Usage

```bash
# Build and run with Docker Compose
docker-compose -f .tr-codegen/docker-compose.yml up -d

# Stop the service
docker-compose -f .tr-codegen/docker-compose.yml down
```

## Connection to Project

This directory supports the deployment workflow defined in the main project. See [ARCHITECTURE.md](../ARCHITECTURE.md) for the overall system architecture.

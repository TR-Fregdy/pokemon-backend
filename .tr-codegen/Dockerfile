# Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend

# Copy frontend package files
COPY pokemon-frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY pokemon-frontend/ .

# Build frontend
RUN npm run build

# Build backend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY pokemon-backend/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY pokemon-backend/. .

# Copy frontend build files from builder stage
COPY --from=frontend-builder /frontend/build/ ./public/

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "start"]
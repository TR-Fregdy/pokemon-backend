# Stage 1: Build frontend
FROM node:20-alpine AS builder

WORKDIR /builder

# Copy frontend and backend code
COPY pokemon-frontend ./frontend
COPY pokemon-backend ./backend

# Build frontend
RUN cd frontend && npm install && npm run build

# Stage 2: Runtime - Express backend serving frontend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built frontend from builder stage
COPY --from=builder /builder/frontend/build ./public

# Copy backend package files
COPY pokemon-backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY pokemon-backend .

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "start"]
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the entire project structure (preserves pokemon-backend and pokemon-frontend directories)
COPY . .

# Build the frontend first (required for server to serve static files)
RUN cd pokemon-frontend && npm install && npm run build

# Install backend dependencies from the pokemon-backend directory
RUN cd pokemon-backend && npm install

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Set working directory to pokemon-backend for server startup
WORKDIR /app/pokemon-backend

# Start the application
CMD ["npm", "start"]
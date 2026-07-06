FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend package files
COPY pokemon-backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY pokemon-backend ./

# Copy frontend build files
COPY pokemon-frontend/build ./public/

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "start"]
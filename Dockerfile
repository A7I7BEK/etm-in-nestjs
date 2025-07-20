# Use the official Node.js 22 image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Create uploads directory and set permissions
RUN mkdir -p /app/uploads && \
    chmod -R 777 /app/uploads

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership of the app directory to the nestjs user
RUN chown -R nestjs:nodejs /app

# Switch to the nestjs user
USER nestjs

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the application
CMD ["npm", "run", "start:prod"]

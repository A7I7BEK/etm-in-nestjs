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

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -s /bin/sh

# Create uploads directory and set permissions
RUN mkdir -p /app/uploads && \
    chown -R nestjs:nodejs /app/uploads && \
    chmod -R 775 /app/uploads

# Change ownership of the app directory to the nestjs user
RUN chown -R nestjs:nodejs /app

# Switch to the nestjs user
USER nestjs

# Expose the port the app runs on
EXPOSE 3001

# Create a startup script to ensure permissions
USER root
RUN echo -e '#!/bin/sh\nchown -R nestjs:nodejs /app/uploads 2>/dev/null || true\nchmod -R 775 /app/uploads 2>/dev/null || true\nexec su -s /bin/sh nestjs -c "cd /app && npm run start:prod"' > /usr/local/bin/start.sh && \
    chmod +x /usr/local/bin/start.sh

# Define the command to run the application
CMD ["/usr/local/bin/start.sh"]

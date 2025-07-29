FROM node:18-slim

# Install curl, tini (for proper signal handling), python3 and build tools needed for native modules
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl tini python3 make g++ gcc && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local/app

# Install nodemon globally (optional)
RUN npm install -g nodemon

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy application source including otel.js
COPY . .

# Expose the port your app listens on
ENV PORT=80
EXPOSE 80

# Use tini for proper signal handling
ENTRYPOINT ["/usr/bin/tini", "--"]

# Start the app with OpenTelemetry auto-instrumentation
CMD ["npm", "start"]

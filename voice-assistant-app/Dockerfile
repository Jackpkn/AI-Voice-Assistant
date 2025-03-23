# Use Node.js LTS version
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source
COPY . .

# Expose port 19000 (Expo), 19001 (Metro bundler), and 19002 (Dev tools)
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start the app
CMD ["npm", "start"] 
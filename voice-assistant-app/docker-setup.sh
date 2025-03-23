#!/bin/bash

# 1. Dockerfile
git add Dockerfile
git commit -m "feat(docker): Add Dockerfile for React Native app

- Configure Node.js 18 slim image
- Set up working directory and dependencies
- Expose Expo and Metro bundler ports
- Configure npm start command"

# 2. docker-compose.yml
git add docker-compose.yml
git commit -m "feat(docker): Add docker-compose.yml for service orchestration

- Configure frontend service with Expo ports
- Set up backend service with FastAPI
- Configure development environment variables
- Enable hot-reload for both services"

# 3. .dockerignore
git add .dockerignore
git commit -m "chore(docker): Add .dockerignore for optimized builds

- Exclude node_modules and development files
- Ignore environment and log files
- Skip version control files
- Exclude build artifacts"

# 4. README.md
git add README.md
git commit -m "docs: Add Docker installation instructions to README

- Add Docker prerequisites
- Document Docker installation steps
- Add Docker usage instructions
- Include container management commands"

# 5. Development environment
git add .env.example
git commit -m "feat(config): Set up development environment variables

- Add example environment configuration
- Configure development ports
- Set up API endpoints
- Document environment variables"

# 6. Volume mounts
git add docker-compose.override.yml
git commit -m "feat(docker): Add volume mounts for local development

- Configure bind mounts for hot-reload
- Set up node_modules volume
- Enable real-time code changes
- Optimize development workflow"

# 7. Port configuration
git add app.json
git commit -m "feat(config): Configure port exposure for services

- Set up Expo ports (19000-19002)
- Configure FastAPI port (8000)
- Enable external access
- Document port usage" 
# API Gateway Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy monorepo files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY services/api-gateway ./services/api-gateway
COPY packages ./packages

# Build
WORKDIR /app/services/api-gateway
RUN pnpm run build

EXPOSE 3001

CMD ["pnpm", "start"]

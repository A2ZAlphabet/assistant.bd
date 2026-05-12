# Worker/Service Dockerfile (for background services)
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY services ./services
COPY packages ./packages

WORKDIR /app/services/${SERVICE_NAME}
RUN pnpm run build

CMD ["pnpm", "start"]

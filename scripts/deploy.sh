#!/bin/bash

# Production deployment script

set -e

echo "🚀 Deploying assistant.bd to production..."

# Build all services
echo "🔨 Building services..."
pnpm run build

# Run migrations
echo "🗄️ Running database migrations..."
pnpm --filter=@assistant.bd/api-gateway run migrate

# Deploy with Docker
echo "🐳 Building Docker images..."
docker-compose -f docker-compose.prod.yml build

echo "📤 Pushing to registry..."
docker-compose -f docker-compose.prod.yml push

echo "🚢 Deploying to Kubernetes..."
kubectl apply -f infra/kubernetes/

echo ""
echo "✅ Deployment complete!"
echo "🌐 Application: https://app.assistant.bd"

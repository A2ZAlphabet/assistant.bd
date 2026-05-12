# 🚀 Quick Start Guide

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+
- pnpm (recommended) or npm

## Installation

### 1. Clone & Setup

```bash
cd assistant.bd
pnpm install
```

### 2. Environment Setup

```bash
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh
```

This creates:
- `.env` file with all required variables
- Database initialization script
- Docker Compose configuration

### 3. Update Secrets

Edit `.env` with your actual API keys:

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
WHATSAPP_ACCESS_TOKEN=...
STRIPE_SECRET_KEY=sk_...
```

### 4. Start Infrastructure

```bash
docker-compose up -d
```

Verifies:
- ✅ PostgreSQL running on :5432
- ✅ Redis running on :6379
- ✅ Database initialized

### 5. Run Services

```bash
# Terminal 1: API Gateway
pnpm --filter=@assistant.bd/api-gateway dev

# Terminal 2: Workflow Engine
pnpm --filter=@assistant.bd/workflow-engine dev

# Terminal 3: AI Orchestrator
pnpm --filter=@assistant.bd/ai-orchestrator dev

# Terminal 4: Web Dashboard
pnpm --filter=@assistant.bd/web dev
```

Or run all at once:
```bash
pnpm run dev
```

### 6. Access Applications

- **Dashboard**: http://localhost:3000
- **API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Common Commands

### Development

```bash
# Install dependencies
pnpm install

# Start all services
pnpm run dev

# Build all services
pnpm run build

# Run tests
pnpm run test

# Lint & format
pnpm run lint
pnpm run format
```

### Working with Specific Services

```bash
# Run specific service
pnpm --filter=@assistant.bd/api-gateway dev

# Build specific service
pnpm --filter=@assistant.bd/api-gateway build

# Test specific service
pnpm --filter=@assistant.bd/api-gateway test
```

### Database

```bash
# Connect to PostgreSQL
psql postgresql://admin:secure_password@localhost:5432/assistant_bd

# View Redis
redis-cli -p 6379
```

### Docker

```bash
# View logs
docker-compose logs -f

# Rebuild images
docker-compose build --no-cache

# Stop all
docker-compose down

# Remove everything (careful!)
docker-compose down -v
```

## Project Structure

```
assistant.bd/
├── apps/              # User-facing applications
│   ├── web/          # Next.js dashboard
│   ├── inbox/        # Messaging UI
│   ├── builder/      # Agent builder
│   └── workflow-canvas/ # Workflow automation
├── services/          # Backend microservices
│   ├── api-gateway/  # Main API
│   ├── workflow-engine/ # Automation engine
│   ├── ai-orchestrator/ # AI routing
│   └── ...
├── packages/          # Shared libraries
│   ├── types/        # TypeScript types
│   ├── ai-core/      # LLM wrapper
│   └── ...
├── agents/            # AI agents
│   ├── support-agent/
│   ├── sales-agent/
│   └── ...
└── workflows/         # Automation templates
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Verify PostgreSQL is running
docker-compose ps

# Check connection
psql postgresql://admin:secure_password@localhost:5432/assistant_bd

# View logs
docker-compose logs postgres
```

### Redis Connection Error

```bash
# Test Redis connection
redis-cli -p 6379 ping

# View logs
docker-compose logs redis
```

### Build Errors

```bash
# Clean everything
pnpm run clean

# Reinstall
pnpm install

# Rebuild
pnpm run build
```

## Next Steps

1. **Create First Workflow** → Go to http://localhost:3000/workflows
2. **Configure Integrations** → WhatsApp, Stripe, etc.
3. **Deploy AI Agent** → Create a support agent
4. **Test End-to-End** → Send a test message

## Need Help?

- **Docs**: See `/docs` folder
- **Issues**: Check GitHub issues
- **Community**: Discord server (link)

---

**Happy building! 🚀**

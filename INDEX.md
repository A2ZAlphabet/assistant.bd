# 🗂️ Project Navigation Guide

Welcome to **assistant.bd** — Your production-grade AI Operating System monorepo.

---

## 📖 Start Here

### First Time?
1. Read: **[SETUP_SUMMARY.md](./SETUP_SUMMARY.md)** ← Start here!
2. Read: **[docs/QUICKSTART.md](./docs/QUICKSTART.md)** ← 5-minute setup
3. Read: **[README.md](./README.md)** ← Full overview

---

## 📚 Documentation Index

### System Design
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — System architecture, data flow, module responsibilities
- **[docs/AGENTS.md](./docs/AGENTS.md)** — How to build AI agents, agent types, orchestration

### Setup & Deployment
- **[SETUP_SUMMARY.md](./SETUP_SUMMARY.md)** — What was created, quick start
- **[docs/QUICKSTART.md](./docs/QUICKSTART.md)** — 5-minute setup guide
- **.env.example** — All environment variables explained

### Configuration
- **package.json** — Root monorepo configuration
- **turbo.json** — Build system configuration
- **tsconfig.json** — TypeScript configuration
- **docker-compose.yml** — Local development infrastructure

---

## 🗂️ Directory Structure

### Applications (`/apps`)
- **web/** → Main Next.js dashboard
- **inbox/** → Messaging inbox UI
- **builder/** → Visual agent builder
- **workflow-canvas/** → Workflow automation UI
- **admin/** → SaaS admin panel
- **landing/** → Marketing website

### Services (`/services`)
- **api-gateway/** → Main REST API (NestJS)
- **workflow-engine/** → Automation execution core
- **ai-orchestrator/** → Agent routing & decision making
- **auth-service/** → Authentication & authorization (scaffolded)
- **messaging-service/** → WhatsApp/Email/FB handling (scaffolded)
- **crm-service/** → Customer data & memory (scaffolded)
- **billing-service/** → Payments & subscriptions (scaffolded)
- **analytics-service/** → Usage metrics & dashboards (scaffolded)
- **event-bus/** → Message queue & events (scaffolded)

### Shared Libraries (`/packages`)
- **types/** → TypeScript type definitions
- **ai-core/** → LLM abstraction layer
- **memory/** → Vector database & CRM queries (scaffolded)
- **connectors/** → External API integrations (scaffolded)
- **queue/** → Message queue abstraction (scaffolded)
- **logger/** → Centralized logging (scaffolded)
- **utils/** → Common utilities (scaffolded)

### AI Agents (`/agents`)
- **support-agent/** → Customer support automation
- **sales-agent/** → Lead qualification & sales
- **voice-agent/** → Phone call handling
- **booking-agent/** → Calendar & appointment scheduling
- **custom-agent-runtime/** → User-created agents

### Workflows (`/workflows`)
- **templates/** → Pre-built workflow templates
- **runtime/** → Trigger/condition/action engine
- **scheduler/** → Job scheduling & cron tasks

### Infrastructure (`/infra`)
- **docker/** → Docker image definitions
- **kubernetes/** → Kubernetes manifests (scaffolded)
- **terraform/** → IaC for AWS & DigitalOcean (scaffolded)
- **monitoring/** → Prometheus & Grafana configs (scaffolded)

### Scripts (`/scripts`)
- **dev-setup.sh** → One-click development setup
- **deploy.sh** → Production deployment

---

## 🚀 Quick Commands

### Setup
```bash
cd /Users/sojib/Downloads/assistant.bd
pnpm install
./scripts/dev-setup.sh
docker-compose up -d
```

### Development
```bash
# Run all services
pnpm run dev

# Run specific service
pnpm --filter=@assistant.bd/api-gateway dev
pnpm --filter=@assistant.bd/web dev

# Build everything
pnpm run build

# Test & lint
pnpm run test
pnpm run lint
```

### Database
```bash
# Connect to PostgreSQL
psql postgresql://admin:secure_password@localhost:5432/assistant_bd

# Access Redis
redis-cli -p 6379
```

### Docker
```bash
# View logs
docker-compose logs -f

# Stop all
docker-compose down
```

---

## 🔑 Key Files

- **`.env.example`** — All environment variables (copy to `.env`)
- **`.gitignore`** — Git ignore rules
- **`package.json`** — Root package configuration
- **`turbo.json`** — Turbo build system config
- **`docker-compose.yml`** — Local development stack

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────────┐
│          USER APPLICATIONS (Next.js/React)          │
├─────────────────────────────────────────────────────┤
│  Web Dashboard │ Inbox │ Builder │ Workflow Canvas  │
└────────────────────┬────────────────────────────────┘
                     │
            ┌────────▼────────┐
            │  API GATEWAY    │
            │  (NestJS :3001) │
            └────────┬────────┘
         ┌──────────┼──────────┐
         │          │          │
    ┌────▼────┐ ┌──▼────┐ ┌──▼─────────┐
    │Workflow │ │  AI   │ │    CRM +   │
    │ Engine  │ │Orch.  │ │  Memory    │
    └────┬────┘ └──┬────┘ └──┬────────┘
         │         │         │
    ┌────▼─────────▼─────────▼────┐
    │      EVENT BUS (Redis)       │
    └────┬──────────────────────┬──┘
         │                      │
    ┌────▼────────┐         ┌──▼──────────┐
    │  Messaging  │         │   Billing   │
    │  Service    │         │   Service   │
    └─────────────┘         └─────────────┘
```

---

## 🎯 Development Workflow

### 1. Adding a New Feature
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes across services
pnpm --filter=@assistant.bd/api-gateway dev
# ... code ...

# Test
pnpm run test

# Commit
git add .
git commit -m "Add my feature"

# Push
git push origin feature/my-feature
```

### 2. Adding a New Service
```bash
mkdir -p services/new-service/src
cd services/new-service
npm init -y
# ... add package.json and tsconfig.json ...
```

### 3. Adding Shared Package
```bash
mkdir -p packages/new-package/src
cd packages/new-package
npm init -y
# ... add to /packages /* in root package.json ...
```

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
lsof -i :3000
# Kill process if needed
```

### Database Connection Error
```bash
docker-compose logs postgres
docker-compose ps  # Check if running
```

### Build Failures
```bash
pnpm run clean
pnpm install
pnpm run build
```

---

## 📞 Resources

- **System Design**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **Quick Start**: [docs/QUICKSTART.md](./docs/QUICKSTART.md)
- **Building Agents**: [docs/AGENTS.md](./docs/AGENTS.md)
- **Environment**: [.env.example](./.env.example)

---

## 🎉 Next Steps

1. ✅ Read [SETUP_SUMMARY.md](./SETUP_SUMMARY.md)
2. ✅ Follow [docs/QUICKSTART.md](./docs/QUICKSTART.md)
3. ✅ Explore [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
4. ✅ Build first agent with [docs/AGENTS.md](./docs/AGENTS.md)

---

**Happy building! 🚀**

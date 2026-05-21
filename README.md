# 🧠 assistant.bd — AI Operating System

[![CI](https://github.com/c7sqhzb45q-prog/assistant.bd/actions/workflows/ci.yml/badge.svg)](https://github.com/c7sqhzb45q-prog/assistant.bd/actions/workflows/ci.yml)

**A production-grade no-code automation platform** combining:
- **Zapier/Make.com** — Workflow automation
- **Tasklet.ai** — AI agent orchestration  
- **Notion** — Dynamic databases & CMS
- **Bangladesh-first** — WhatsApp, bKash, local integrations

---

## 🏗️ Monorepo Structure

### 📱 **Apps** (User-facing UI layer)
- `web/` — Next.js main dashboard
- `inbox/` — Unified messaging inbox (WhatsApp, FB, IG, Email)
- `builder/` — Visual agent builder (drag-drop AI creation)
- `workflow-canvas/` — Zapier-style automation canvas
- `admin/` — SaaS admin panel (billing, users, logs)
- `landing/` — Marketing website

### ⚙️ **Services** (Backend microservices)
- `api-gateway/` — Main API entry point (NestJS)
- `auth-service/` — JWT, OAuth, MFA
- `crm-service/` — Customer memory system with vector DB
- `messaging-service/` — WhatsApp, FB, IG, Telegram, Email routing
- `ai-orchestrator/` — Agent decision engine (core brain)
- `workflow-engine/` — Trigger → Condition → Action execution
- `event-bus/` — Real-time message queue (Redis/NATS)
- `billing-service/` — Subscriptions, payments (Stripe, bKash)
- `analytics-service/` — Dashboards & usage insights

### 🤖 **Agents** (AI employees)
- `support-agent/` — Customer support automation
- `sales-agent/` — Lead scoring & conversion
- `voice-agent/` — Phone call handling
- `booking-agent/` — Calendar & appointment scheduling
- `custom-agent-runtime/` — User-created agents

### 🔁 **Workflows** (Automation templates)
- `templates/` — Pre-built workflows (ecommerce, lead gen, etc)
- `runtime/` — Trigger engine, condition evaluator, action executor
- `scheduler/` — Delayed jobs, reminders, scheduling

### 📦 **Packages** (Shared libraries)
- `ai-core/` — LLM wrapper (OpenAI, Anthropic, local LLMs)
- `memory/` — Vector DB + CRM storage
- `types/` — Shared TypeScript types
- `utils/` — Common helpers & utilities
- `connectors/` — External API integrations
- `queue/` — Message queue abstraction
- `logger/` — Centralized logging

### 🏗️ **Infra** (Deployment)
- `docker/` — Container definitions
- `kubernetes/` — K8s manifests
- `terraform/` — IaC (AWS, DigitalOcean)
- `monitoring/` — Prometheus, Grafana

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development environment
npm run dev

# Build for production
npm run build

# Deploy to production
npm run deploy
```

---

## 🔌 API Docs

- Health check: `http://localhost:3001/health`
- Swagger UI: `http://localhost:3001/docs`
- OpenAPI JSON: `http://localhost:3001/docs-json`
- Lovable integration guide: `docs/LOVABLE_API.md`

---

## 🧠 Core Architecture

```
User Message (WhatsApp/Email/API)
    ↓
Messaging Service (receives & normalizes)
    ↓
Event Bus (Redis/NATS publish)
    ↓
Workflow Engine (checks triggers & conditions)
    ↓
AI Orchestrator (routes to best agent)
    ↓
Agent (Support/Sales/Voice/Custom)
    ↓
CRM Memory (stores interaction)
    ↓
Action Executor (reply/email/call/automation)
```

---

## 🔑 Key Features

### Automation Layer
- ✅ Visual workflow builder (Zapier-style)
- ✅ 1000+ pre-built integrations
- ✅ Conditional logic & branching
- ✅ Scheduled tasks & reminders

### AI Layer
- ✅ Multi-agent orchestration
- ✅ Natural language understanding
- ✅ Context-aware memory
- ✅ Tool calling & API integration

### Messaging Layer
- ✅ WhatsApp Business API
- ✅ Facebook Messenger
- ✅ Instagram DMs
- ✅ Email (SMTP/IMAP)
- ✅ Telegram
- ✅ SMS (Twilio)

### CRM Layer
- ✅ Customer profiles
- ✅ Interaction history
- ✅ Sentiment analysis
- ✅ Vector memory (semantic search)

### Billing Layer
- ✅ Stripe integration
- ✅ bKash/Nagad (Bangladesh)
- ✅ Usage-based pricing
- ✅ Team billing

---

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, TailwindCSS, Zustand |
| Backend | NestJS, FastAPI, Node.js |
| Database | PostgreSQL, Redis, Pinecone/Milvus (vector) |
| AI/LLM | OpenAI, Anthropic, Ollama |
| Message Queue | Redis, NATS |
| Deployment | Docker, Kubernetes, Terraform |
| Monitoring | Prometheus, Grafana, ELK |

---

## 🤝 Contributing

This monorepo uses:
- **Turborepo** for build optimization
- **npm workspaces** for package management (pnpm optional)
- **ESLint + Prettier** for code quality

```bash
# Development workflow
npm install
npm run dev

# Run specific service
npm run -w @assistant.bd/api-gateway dev

# Run all tests
npm run test

# Lint & format
npm run lint
npm run format
```

---

## 📝 Environment Setup

Create `.env` files in each service:

```env
# API Gateway
DATABASE_URL=postgresql://user:pass@localhost/assistantbd
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sk-...
JWT_SECRET=your-secret-key

# Messaging Service
WHATSAPP_BUSINESS_ACCOUNT_ID=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_ACCESS_TOKEN=...

# Billing Service
STRIPE_SECRET_KEY=sk_live_...
BKASH_API_KEY=...

# Monitoring
DATADOG_API_KEY=...
```

---

## 🔧 Database Schema Overview

- **users** — Account & authentication
- **teams** — Multi-tenant organization
- **workspaces** — User workspaces
- **workflows** — Automation definitions
- **agents** — AI agent configurations
- **conversations** — Message history
- **customers** — CRM contacts
- **integrations** — Connected apps
- **logs** — Execution logs
- **billing_events** — Usage tracking

---

## 📚 Documentation

See `/docs` for:
- Architecture deep-dive
- API reference
- Agent development guide
- Workflow creation guide
- Deployment guide

---

## 📞 Support

- **Docs**: https://docs.assistant.bd
- **Status**: https://status.assistant.bd
- **Email**: hello@assistant.bd
- **WhatsApp**: +880 1...

---

## ⚖️ License

Proprietary — All rights reserved © 2024-2025 assistant.bd

---

**Built with ❤️ for Bangladesh's SaaS ecosystem**

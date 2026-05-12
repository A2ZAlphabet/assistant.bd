# 📚 Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER-FACING APPLICATIONS                      │
├─────────────┬──────────────┬──────────────┬─────────────────────┤
│  Web Dashboard  │  Inbox UI  │ Builder UI  │  Workflow Canvas    │
│  (Next.js)      │            │             │                    │
└────────┬────────┴──────┬─────┴──────┬──────┴────────┬────────────┘
         │               │            │               │
         └───────────────┼────────────┼───────────────┘
                         │            │
                    ┌────▼────────────▼────┐
                    │   API GATEWAY         │
                    │   (NestJS)            │
                    │   :3001               │
                    └────┬────────────┬─────┘
                         │            │
        ┌────────────────┼────────────┼──────────────┐
        │                │            │              │
   ┌────▼─────┐   ┌──────▼──────┐   │   ┌───────────▼──────┐
   │ Auth      │   │ Workflow    │   │   │ CRM/Memory       │
   │ Service   │   │ Engine      │   │   │ PostgreSQL       │
   │           │   │             │   │   │ + Vector DB      │
   └───────────┘   └──────┬──────┘   │   └──────────────────┘
                          │          │
                    ┌─────▼──────────▼─────┐
                    │   EVENT BUS (Redis)   │
                    │   Message Queue       │
                    └─────┬──────────┬──────┘
                          │          │
        ┌─────────────────┼──────────┼─────────────────┐
        │                 │          │                 │
   ┌────▼──────┐  ┌──────▼─────┐   │  ┌──────────────▼──┐
   │ AI         │  │ Messaging  │   │  │ Billing Service │
   │ Orchestrator│  │ Service    │   │  │                │
   │            │  │            │   │  └─────────────────┘
   └────────────┘  └────────────┘   │
                                     │
                        ┌────────────▼────────────┐
                        │  EXTERNAL INTEGRATIONS  │
                        │  • WhatsApp             │
                        │  • Facebook/Instagram   │
                        │  • Stripe               │
                        │  • Twilio               │
                        │  • Email                │
                        └─────────────────────────┘
```

## Data Flow

### 1. **Incoming Message** (WhatsApp/Email/API)
```
Incoming Message
    ↓
Messaging Service (normalize format)
    ↓
Publish to Event Bus
    ↓
Store in Conversation DB
```

### 2. **Workflow Trigger**
```
Event Bus receives message
    ↓
Workflow Engine evaluates triggers
    ↓
Check conditions (if any)
    ↓
Execute actions (or route to agent)
```

### 3. **AI Agent Processing**
```
Workflow routes to Agent
    ↓
AI Orchestrator loads context (CRM)
    ↓
LLM processes with tools
    ↓
Generate response + actions
    ↓
Execute response (send message, create task, etc)
    ↓
Update CRM memory
```

## Service Responsibilities

### API Gateway (:3001)
- ✅ Central entry point for all requests
- ✅ Authentication & authorization
- ✅ Request validation & sanitization
- ✅ Rate limiting
- ✅ Route to appropriate services

### Workflow Engine
- ✅ Parse workflow definitions
- ✅ Evaluate triggers (webhook, schedule, event)
- ✅ Execute conditions (if/switch/loop)
- ✅ Call action executors
- ✅ Log execution history

### AI Orchestrator
- ✅ Route to best agent (support/sales/voice/custom)
- ✅ Load customer context from CRM
- ✅ Call LLM with system prompt + tools
- ✅ Parse LLM response
- ✅ Execute tool calls
- ✅ Store interaction in memory

### Messaging Service
- ✅ Receive from external channels (WhatsApp, Email, FB)
- ✅ Normalize message format
- ✅ Publish to event bus
- ✅ Send outbound messages
- ✅ Handle webhook validation

### CRM/Memory Service
- ✅ Store customer profiles
- ✅ Store interaction history
- ✅ Vector embeddings for semantic search
- ✅ Sentiment analysis
- ✅ Context retrieval for agents

## Module Organization

### `/apps`
Each app is a standalone Next.js/React application with its own build.

```
web/           → Main dashboard (create workflows, view analytics)
inbox/         → Unified messaging inbox
builder/       → Drag-drop agent builder
workflow-canvas/ → Zapier-style workflow editor
admin/         → Team management, billing
landing/       → Marketing website
```

### `/services`
Each service runs as a separate Docker container/process.

```
api-gateway/      → Routes requests, validates auth
auth-service/     → JWT, OAuth, MFA
workflow-engine/  → Processes workflows
ai-orchestrator/  → AI decision making
messaging-service/ → Handles external channels
crm-service/      → Customer data & memory
billing-service/  → Payments, subscriptions
analytics-service/ → Usage metrics & dashboards
```

### `/packages`
Shared libraries used by multiple services.

```
types/        → TypeScript interfaces
ai-core/      → LLM abstraction layer
memory/       → Vector DB + CRM queries
connectors/   → External API integrations
queue/        → Message queue abstraction
logger/       → Centralized logging
utils/        → Common utilities
```

### `/agents`
AI agents are modular and can be deployed independently.

```
support-agent/    → Customer service automation
sales-agent/      → Lead qualification & conversion
voice-agent/      → Phone call handling
booking-agent/    → Calendar & scheduling
custom-agent-runtime/ → User-created agents
```

## Database Schema

### Core Tables
- `users` → User accounts
- `teams` → Organization/workspace
- `customers` → CRM contacts
- `conversations` → Chat history
- `workflows` → Automation definitions
- `agents` → AI agent configs
- `integrations` → Connected services
- `audit_logs` → All actions

### Vector Tables
- `customer_embeddings` → Semantic search for context
- `workflow_executions` → Logs with full context

## Deployment Strategy

### Development
```bash
docker-compose up
pnpm run dev
# All services in one environment
```

### Production
```bash
# Kubernetes deployment
kubectl apply -f infra/kubernetes/

# Environment-specific configs
ENVIRONMENT=production pnpm run deploy
```

## Testing Strategy

### Unit Tests
```bash
pnpm run test
```

### Integration Tests
```bash
pnpm run test:integration
```

### E2E Tests (Workflow execution)
```bash
pnpm run test:e2e
```

## Monitoring & Observability

- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Metrics**: Prometheus
- **Dashboards**: Grafana
- **Traces**: Jaeger (optional)
- **Alerting**: Alert Manager

---

## Next Steps

1. **Setup Database** → Run migrations
2. **Configure Services** → Create .env files
3. **Deploy APIs** → Docker Compose
4. **Build Frontend** → Next.js build
5. **Setup Integrations** → WhatsApp, Stripe, etc.

---

For detailed setup, see `/docs` folder.

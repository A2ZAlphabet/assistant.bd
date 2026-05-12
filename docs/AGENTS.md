# 🤖 Building Your First Agent

## Agent Types

### 1. Support Agent 
**Purpose**: Answer customer questions, resolve issues

```typescript
{
  type: 'support',
  systemPrompt: `You are a helpful customer support agent. 
    Your goal is to resolve customer issues quickly and professionally.
    Use the provided tools to fetch customer data and create tickets.`,
  tools: ['get_customer_data', 'create_ticket', 'send_email'],
  model: 'gpt-4-turbo'
}
```

### 2. Sales Agent
**Purpose**: Qualify leads, handle objections, close deals

```typescript
{
  type: 'sales',
  systemPrompt: `You are a persuasive sales agent.
    Your goal is to qualify leads and move them through the sales funnel.
    Ask qualifying questions, handle objections, and suggest products.`,
  tools: ['get_lead_data', 'update_crm', 'send_proposal'],
  model: 'gpt-4-turbo'
}
```

### 3. Voice Agent
**Purpose**: Handle phone calls, transcription, decision-making

```typescript
{
  type: 'voice',
  systemPrompt: `You are a voice assistant handling phone calls.
    Speak naturally and help resolve issues quickly.`,
  tools: ['transfer_to_human', 'schedule_callback', 'access_account'],
  model: 'gpt-4-turbo'
}
```

### 4. Booking Agent
**Purpose**: Schedule appointments, manage calendars

```typescript
{
  type: 'booking',
  systemPrompt: `You are a scheduling assistant.
    Help customers book appointments at available time slots.`,
  tools: ['check_availability', 'create_appointment', 'send_confirmation'],
  model: 'gpt-4-turbo'
}
```

---

## Agent Components

### System Prompt
Defines the agent's personality and behavior.

```
You are a helpful customer support assistant for XYZ Company.
- Be friendly and professional
- Always validate customer identity before sharing personal data
- If you can't solve the issue, escalate to a human
- Keep responses concise (under 200 words)
```

### Tools
Actions the agent can take.

```typescript
tools: [
  {
    name: 'get_customer_data',
    description: 'Fetch customer information by email or ID',
    schema: {
      type: 'object',
      properties: {
        customerId: { type: 'string' },
        email: { type: 'string' }
      }
    }
  },
  {
    name: 'create_ticket',
    description: 'Create a support ticket',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        priority: { enum: ['low', 'medium', 'high'] },
        description: { type: 'string' }
      },
      required: ['title', 'description']
    }
  }
]
```

### Memory Configuration
How the agent remembers context.

```typescript
memory: {
  type: 'hybrid',          // short-term + long-term
  shortTermSize: 10,       // Last N messages
  longTermSize: 100        // Vector embeddings
}
```

---

## Agent Orchestration Flow

```
User Message
    ↓
[Context Loading]
- Load customer profile
- Fetch recent conversation history
- Get customer sentiment
    ↓
[Agent Selection]
- Route to Support/Sales/Voice/Booking agent
- OR run custom agent
    ↓
[LLM Processing]
- System prompt + context
- Tools available
- Temperature/creativity setting
    ↓
[Tool Execution]
- Agent calls tools (get_customer_data, create_ticket, etc)
- Results fed back to LLM
- LLM formulates final response
    ↓
[Response Generation]
- Format message for channel (WhatsApp/Email/etc)
- Store in conversation history
- Update CRM
    ↓
Response sent to user
```

---

## Creating Your First Support Agent

### Step 1: Define Agent
```typescript
const supportAgent = {
  id: 'agent_support_001',
  teamId: 'team_123',
  name: 'Customer Support Bot',
  type: 'support',
  config: {
    systemPrompt: `You are a helpful support agent for CustomerXYZ.
      Your goal is to resolve issues quickly.
      Available tools: search knowledge base, create tickets, escalate.`,
    model: 'gpt-4-turbo',
    temperature: 0.7,
    tools: [
      {
        name: 'search_kb',
        description: 'Search knowledge base for answers',
        schema: {
          type: 'object',
          properties: {
            query: { type: 'string' }
          }
        }
      },
      {
        name: 'create_ticket',
        description: 'Create a support ticket if KB search fails',
        schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            priority: { enum: ['low', 'medium', 'high'] }
          }
        }
      }
    ]
  }
};
```

### Step 2: Deploy Agent
```bash
# Via API
POST /agents
{
  "name": "Customer Support Bot",
  "type": "support",
  "config": { ... }
}

# Response: { id: "agent_support_001", status: "deployed" }
```

### Step 3: Test Agent
```bash
# Send test message
POST /agents/agent_support_001/test
{
  "message": "How do I reset my password?",
  "customerId": "cust_123"
}

# Response:
{
  "response": "I'll help you reset your password...",
  "toolsCalled": ["search_kb"],
  "confidence": 0.95
}
```

### Step 4: Connect to Workflow
```typescript
{
  name: 'Support Automation',
  triggers: [
    {
      type: 'message',
      channel: 'whatsapp'
    }
  ],
  actions: [
    {
      type: 'run_agent',
      agentId: 'agent_support_001'
    }
  ]
}
```

---

## Advanced Agent Features

### Tool Calling Loop
```
User: "What's my order status?"
    ↓
Agent thinks: "I need customer data"
    ↓
Calls tool: get_order_status(orderId=123)
    ↓
Tool returns: { status: 'shipped', tracking: 'TRK123' }
    ↓
Agent formulates response
    ↓
Response: "Your order is shipped. Tracking: TRK123"
```

### Context Window Management
```
Conversation history (kept in memory):
- Message 1: User asks about refund
- Message 2: Agent asks for order ID
- Message 3: User provides order ID
- Message 4: Agent checks refund status

New context sent to LLM: Last 4 messages + customer profile
```

### Sentiment Analysis
```typescript
const sentiment = await analyzer.analyze(userMessage);
// Returns: { emotion: 'frustrated', confidence: 0.92 }

// Adapt agent behavior
if (sentiment.emotion === 'frustrated') {
  systemPrompt += "\nCustomer is frustrated. Be extra helpful.";
}
```

---

## Agent Metrics & Monitoring

```typescript
{
  agentId: 'agent_support_001',
  metrics: {
    messagesProcessed: 1250,
    averageResponseTime: 2.3,    // seconds
    customerSatisfaction: 0.87,   // CSAT score
    escalationRate: 0.12,         // % escalated to human
    toolSuccessRate: 0.94
  }
}
```

---

## Production Checklist

- [ ] Agent tested with 100+ examples
- [ ] Tools have proper error handling
- [ ] Fallback to human escalation works
- [ ] System prompt is clear and concise
- [ ] Knowledge base is up-to-date
- [ ] Monitoring & alerting configured
- [ ] Rate limiting enabled
- [ ] Audit logging enabled

---

## Examples

### Support Agent Response Flow
```
User: "Can I return a product after 30 days?"
  ↓
Agent calls: search_kb("return policy")
  ↓
KB returns: "Returns accepted within 30 days of purchase"
  ↓
Agent response: "Yes, you can return products within 30 days of purchase!"
```

### Sales Agent Response Flow
```
User: "Do you have premium plan?"
  ↓
Agent calls: get_customer_data(userId)
  ↓
Agent calls: get_subscription_plans()
  ↓
Agent formulates pitch based on customer data
  ↓
Response: "Yes! Based on your usage, the Premium plan is perfect for you..."
```

---

For more examples and advanced configurations, see `/docs/AGENTS.md`

# Supabase ↔ assistant.bd Integration

Complete guide for integrating Supabase PostgreSQL database with your API Gateway and Lovable app.

## 1) Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Choose:
   - **Name**: `assistant-bd`
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project" (takes ~1 min)

## 2) Get Your Credentials

In your Supabase dashboard:

1. Go to **Settings → API**
2. Copy these values:
   - `Project URL` (your Supabase endpoint)
   - `anon (public)` key - for client-side queries
   - `service_role` key - for server-side queries (keep secret!)

Add to your `.env.local`:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## 3) Create Database Tables

In Supabase Dashboard → SQL Editor, run this script:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  stripe_customer_id VARCHAR(255),
  subscription_plan VARCHAR(50) DEFAULT 'free',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- API Keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_hash VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Billing/Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'active', -- active, cancelled, past_due
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workflows table (for automation tracking)
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  last_run_at TIMESTAMP,
  next_run_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workflow runs (execution history)
CREATE TABLE workflow_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, running, success, failed
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  error_message TEXT,
  duration_ms INTEGER,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit logs (track API usage)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_workflows_user_id ON workflows(user_id);
CREATE INDEX idx_workflow_runs_workflow_id ON workflow_runs(workflow_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "Users can read own API keys"
  ON api_keys FOR SELECT
  USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can read own subscriptions"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can read own workflows"
  ON workflows FOR SELECT
  USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can read own workflow runs"
  ON workflow_runs FOR SELECT
  USING (
    workflow_id IN (
      SELECT id FROM workflows WHERE user_id = auth.uid()
    ) OR auth.role() = 'service_role'
  );
```

## 4) Install Supabase Client

```bash
npm install --save -w @assistant.bd/api-gateway @supabase/supabase-js
```

## 5) Create Supabase Service

Create `packages/supabase-client/src/index.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// User Management
export async function createUser(email: string, name: string) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, name }])
    .select()
    .single();

  if (error) throw new Error(`Failed to create user: ${error.message}`);
  return data;
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new Error(`User not found: ${error.message}`);
  return data;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data;
}

// API Key Management
export async function generateApiKey(userId: string, name: string) {
  const key = `sk_${Math.random().toString(36).substr(2, 32)}`;
  const keyHash = Buffer.from(key).toString('base64');

  const { data, error } = await supabase
    .from('api_keys')
    .insert([
      {
        user_id: userId,
        name,
        key_hash: keyHash,
        is_active: true,
      }
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to generate API key: ${error.message}`);

  return { id: data.id, key }; // Return plaintext key only once!
}

export async function validateApiKey(key: string): Promise<string | null> {
  const keyHash = Buffer.from(key).toString('base64');

  const { data, error } = await supabase
    .from('api_keys')
    .select('user_id')
    .eq('key_hash', keyHash)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  // Update last_used_at
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date() })
    .eq('key_hash', keyHash);

  return data.user_id;
}

export async function getApiKeys(userId: string) {
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, name, is_active, last_used_at, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch API keys: ${error.message}`);
  return data;
}

export async function revokeApiKey(keyId: string, userId: string) {
  const { error } = await supabase
    .from('api_keys')
    .update({ is_active: false })
    .eq('id', keyId)
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to revoke API key: ${error.message}`);
}

// Subscription Management
export async function getSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  return data || null;
}

export async function createSubscription(
  userId: string,
  stripeSubscriptionId: string,
  planId: string
) {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([
      {
        user_id: userId,
        stripe_subscription_id: stripeSubscriptionId,
        plan_id: planId,
        status: 'active',
        current_period_start: new Date(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create subscription: ${error.message}`);
  return data;
}

export async function updateSubscription(
  stripeSubscriptionId: string,
  status: string
) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ status })
    .eq('stripe_subscription_id', stripeSubscriptionId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update subscription: ${error.message}`);
  return data;
}

// Workflow Management
export async function createWorkflow(userId: string, name: string, config: any) {
  const { data, error } = await supabase
    .from('workflows')
    .insert([
      {
        user_id: userId,
        name,
        config,
        is_active: true,
      }
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create workflow: ${error.message}`);
  return data;
}

export async function getWorkflows(userId: string) {
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch workflows: ${error.message}`);
  return data;
}

export async function getWorkflow(workflowId: string, userId: string) {
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .eq('id', workflowId)
    .eq('user_id', userId)
    .single();

  if (error) throw new Error(`Workflow not found: ${error.message}`);
  return data;
}

export async function updateWorkflow(
  workflowId: string,
  userId: string,
  updates: any
) {
  const { data, error } = await supabase
    .from('workflows')
    .update(updates)
    .eq('id', workflowId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update workflow: ${error.message}`);
  return data;
}

export async function deleteWorkflow(workflowId: string, userId: string) {
  const { error } = await supabase
    .from('workflows')
    .delete()
    .eq('id', workflowId)
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to delete workflow: ${error.message}`);
}

// Workflow Runs (execution history)
export async function createWorkflowRun(
  workflowId: string,
  inputData: any
) {
  const { data, error } = await supabase
    .from('workflow_runs')
    .insert([
      {
        workflow_id: workflowId,
        status: 'running',
        input_data: inputData,
        started_at: new Date(),
      }
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create workflow run: ${error.message}`);
  return data;
}

export async function completeWorkflowRun(
  runId: string,
  status: string,
  outputData: any,
  errorMessage?: string
) {
  const completedAt = new Date();
  const startedAtResult = await supabase
    .from('workflow_runs')
    .select('started_at')
    .eq('id', runId)
    .single();

  const durationMs = startedAtResult.data
    ? new Date(completedAt).getTime() - new Date(startedAtResult.data.started_at).getTime()
    : 0;

  const { data, error } = await supabase
    .from('workflow_runs')
    .update({
      status,
      output_data: outputData,
      error_message: errorMessage || null,
      completed_at: completedAt,
      duration_ms: durationMs,
    })
    .eq('id', runId)
    .select()
    .single();

  if (error) throw new Error(`Failed to complete workflow run: ${error.message}`);
  return data;
}

// Audit Logging
export async function logAuditEvent(
  userId: string | null,
  action: string,
  resourceType: string,
  resourceId: string,
  details: any,
  ipAddress?: string,
  userAgent?: string
) {
  const { error } = await supabase
    .from('audit_logs')
    .insert([
      {
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        ip_address: ipAddress,
        user_agent: userAgent,
        details,
      }
    ]);

  if (error) console.error(`Audit log error: ${error.message}`);
}
```

## 6) Create API Authentication Middleware

Create `packages/api-gateway/src/middleware/auth.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { validateApiKey } from '@assistant.bd/supabase-client';

export interface AuthRequest extends Request {
  userId?: string;
  apiKeyId?: string;
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    const userId = await validateApiKey(token);

    if (!userId) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    req.userId = userId;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
}
```

## 7) Update API Gateway Routes with Auth

Create `packages/api-gateway/src/routes/workflows.ts`:

```typescript
import { Router } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import {
  createWorkflow,
  getWorkflows,
  updateWorkflow,
  deleteWorkflow,
  logAuditEvent,
} from '@assistant.bd/supabase-client';

const router = Router();

// Apply auth to all routes
router.use(authMiddleware);

// GET /workflows - List user's workflows
router.get('/', async (req: AuthRequest, res) => {
  try {
    const workflows = await getWorkflows(req.userId!);

    await logAuditEvent(
      req.userId,
      'LIST_WORKFLOWS',
      'workflow',
      '',
      { count: workflows.length },
      req.ip,
      req.get('user-agent')
    );

    res.json({ data: workflows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /workflows - Create new workflow
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, config } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Workflow name is required' });
    }

    const workflow = await createWorkflow(req.userId!, name, config || {});

    await logAuditEvent(
      req.userId,
      'CREATE_WORKFLOW',
      'workflow',
      workflow.id,
      { name },
      req.ip,
      req.get('user-agent')
    );

    res.status(201).json({ data: workflow });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /workflows/:id - Update workflow
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { name, config, is_active } = req.body;

    const workflow = await updateWorkflow(req.params.id, req.userId!, {
      name,
      config,
      is_active,
    });

    await logAuditEvent(
      req.userId,
      'UPDATE_WORKFLOW',
      'workflow',
      req.params.id,
      { updates: { name, config, is_active } },
      req.ip,
      req.get('user-agent')
    );

    res.json({ data: workflow });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /workflows/:id - Delete workflow
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    await deleteWorkflow(req.params.id, req.userId!);

    await logAuditEvent(
      req.userId,
      'DELETE_WORKFLOW',
      'workflow',
      req.params.id,
      {},
      req.ip,
      req.get('user-agent')
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

Create `packages/api-gateway/src/routes/api-keys.ts`:

```typescript
import { Router } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import {
  generateApiKey,
  getApiKeys,
  revokeApiKey,
  logAuditEvent,
} from '@assistant.bd/supabase-client';

const router = Router();

// Apply auth to all routes
router.use(authMiddleware);

// GET /api-keys - List user's API keys
router.get('/', async (req: AuthRequest, res) => {
  try {
    const keys = await getApiKeys(req.userId!);
    res.json({ data: keys });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api-keys - Generate new API key
router.post('/generate', async (req: AuthRequest, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Key name is required' });
    }

    const { id, key } = await generateApiKey(req.userId!, name);

    await logAuditEvent(
      req.userId,
      'GENERATE_API_KEY',
      'api_key',
      id,
      { name },
      req.ip,
      req.get('user-agent')
    );

    res.status(201).json({ id, key, warning: 'Save this key securely. You won\'t see it again.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api-keys/:id - Revoke API key
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    await revokeApiKey(req.params.id, req.userId!);

    await logAuditEvent(
      req.userId,
      'REVOKE_API_KEY',
      'api_key',
      req.params.id,
      {},
      req.ip,
      req.get('user-agent')
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

## 8) Integrate Stripe Webhook with Supabase

Create `packages/api-gateway/src/routes/billing.ts` (webhook handling):

```typescript
import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import express from 'express';
import { createSubscription, updateSubscription, logAuditEvent } from '@assistant.bd/supabase-client';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// POST /billing/webhook - Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const customer = await stripe.customers.retrieve(customerId);
        const userId = (customer as any).metadata?.user_id;

        if (userId) {
          await createSubscription(
            userId,
            subscription.id,
            subscription.items.data[0].price.id
          );

          await logAuditEvent(userId, 'SUBSCRIPTION_CREATED', 'subscription', subscription.id, {
            planId: subscription.items.data[0].price.id,
          });
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSub = event.data.object as Stripe.Subscription;
        await updateSubscription(deletedSub.id, 'cancelled');
        break;
    }

    res.json({ received: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
```

## 9) Environment Variables Checklist

Create `.env.local` in API Gateway:

```env
# Supabase (REQUIRED)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,https://your-app.lovable.app
```

## 10) Local Testing

```bash
# Start API Gateway
npm run -w @assistant.bd/api-gateway dev

# Create a test user in Supabase (via SQL Editor)
INSERT INTO users (email, name) VALUES ('test@example.com', 'Test User');
-- Copy the user ID

# Generate API key
curl -X POST http://localhost:3001/api-keys/generate \
  -H "Content-Type: application/json" \
  -d '{"name": "test-key"}'
# Response: { "id": "...", "key": "sk_xxxxx" }

# Use generated key
API_KEY="sk_xxxxx"
curl http://localhost:3001/workflows \
  -H "Authorization: Bearer $API_KEY"

# Create workflow
curl -X POST http://localhost:3001/workflows \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Workflow",
    "config": { "trigger": "manual" }
  }'
```

## 11) Deploy Supabase Project

Supabase is hosted for you — just ensure:

1. ✅ Project created in Supabase dashboard
2. ✅ Environment variables added to deployment platform
3. ✅ Database tables created (run SQL script above)
4. ✅ RLS policies enabled
5. ✅ Stripe webhook configured in Stripe dashboard

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Connection refused" | Verify `SUPABASE_URL` from dashboard Settings → API |
| API key validation failing | Check `api_keys` table has data; verify key hash format |
| RLS blocking queries | Use `service_role` key on server; check RLS policies |
| Workflows not appearing | Verify `user_id` matches authenticated user |
| Stripe webhooks not firing | Check webhook secret in Stripe → Webhooks; verify endpoint URL |

## Next Steps

1. ✅ Create Supabase project
2. ✅ Run SQL schema script
3. ✅ Install Supabase client
4. ✅ Create authentication middleware
5. ✅ Update API routes with auth
6. ✅ Test API key generation and usage
7. ✅ Set up Stripe webhooks
8. ✅ Deploy to production

See [LOVABLE_API.md](./LOVABLE_API.md) for integrating with your Lovable frontend app.

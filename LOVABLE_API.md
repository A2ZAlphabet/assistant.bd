# Lovable ↔ assistant.bd (API integration)

This repo includes a minimal API Gateway you can connect to a Lovable app. Includes Supabase for database, authentication, and user management.

## 1) Run the API Gateway locally

```bash
cd "/Users/sojib/Documents/New project/assistant.bd"
npm install
npm run -w @assistant.bd/api-gateway dev
```

Default URL: `http://localhost:3001`

Health check: `GET /health`

### Core Endpoints

**Public (no auth required):**
- `GET /health` - Health check
- `GET /billing/plans` - List subscription plans

**Protected (API key required):**
- `GET /workflows` - List user's workflows
- `POST /workflows` - Create new workflow
- `GET /api-keys` - List user's API keys
- `POST /api-keys/generate` - Generate new API key

**Billing:**
- `POST /billing/checkout` - Create Stripe Checkout Session
- `POST /billing/portal` - Create Stripe Customer Portal Session
- `POST /billing/webhook` - Stripe webhook receiver for subscription events

## 2) Get an OpenAPI spec (Swagger)

When the API Gateway is running:

- Swagger UI: `http://localhost:3001/docs`
- OpenAPI JSON: `http://localhost:3001/docs-json`

If you deploy the API publicly, the same paths work on your production domain.

## 3) Deploy (so Lovable can reach it)

Lovable needs a public HTTPS URL.

Options:
- Deploy the `assistant.bd` monorepo to your preferred host (Render/Fly.io/VPS/etc).
- For quick testing from your laptop, use a tunnel (e.g ngrok) to expose `http://localhost:3001` as `https://...`.

## 4) Configure CORS for your Lovable app

Set `CORS_ORIGIN` in your API Gateway environment to your Lovable published URL (or your custom domain).

Examples:

```env
# single origin
CORS_ORIGIN=https://your-app.lovable.app

# multiple origins
CORS_ORIGIN=http://localhost:3000,https://your-app.lovable.app
```

## 5) Set Up Supabase Database

**Important:** Database is required for authentication and user management.

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for:
- Creating Supabase project
- Database schema setup
- API key management
- User authentication
- Billing integration

## 6) In Lovable: integrate the API

### Option A: Without Authentication (Quick Testing)

In your Lovable project chat, paste:

```
Integrate my API.
Base URL: https://YOUR_PUBLIC_API_DOMAIN
OpenAPI spec: https://YOUR_PUBLIC_API_DOMAIN/docs-json
No auth for now.
Create a simple "Health" check component that calls GET /health and displays the response.
```

### Option B: With API Key Authentication (Production)

First, generate an API key via the `/api-keys/generate` endpoint (requires authentication).

Then in Lovable:

```
Integrate my API with API key authentication.
Base URL: https://YOUR_PUBLIC_API_DOMAIN
OpenAPI spec: https://YOUR_PUBLIC_API_DOMAIN/docs-json

Authentication:
- Type: Bearer Token
- Store API key in Cloud → Secrets as MY_API_KEY
- Include header: Authorization: Bearer ${MY_API_KEY}

Protected endpoints:
- GET /workflows - List user's workflows
- POST /workflows - Create new workflow
- GET /api-keys - List user's API keys

Create components:
1. "Workflows List" - calls GET /workflows, displays all workflows
2. "Create Workflow" - form to POST /workflows with name and config
3. "API Key Manager" - displays current API keys
```

---

## Implementation Guide

### Step 1: Verify API Gateway Structure

Check that your monorepo has the `@assistant.bd/api-gateway` workspace:

```bash
ls -la packages/
# Should include: api-gateway, web, supabase-client, etc.
```

### Step 2: Environment Setup

Create `.env.local` files for local development:

**`.env.local` (in api-gateway root)**
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Supabase (required for auth)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe (for billing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 3: Install Supabase Client

```bash
npm install --save -w @assistant.bd/api-gateway @supabase/supabase-js
```

### Step 4: Run Locally

```bash
# Install dependencies
npm install

# Start API Gateway (should run on port 3001)
npm run -w @assistant.bd/api-gateway dev

# In another terminal, verify it's running
curl http://localhost:3001/health
```

You should see a response like:
```json
{"status": "ok", "timestamp": "2026-06-02T..."}
```

### Step 5: Create Your First API Key

Use Supabase dashboard or directly:

```bash
# Generate API key for your user
curl -X POST http://localhost:3001/api-keys/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid-here",
    "name": "Lovable Integration"
  }'

# Response:
# { "id": "key-id", "key": "sk_xxxxxxxxxxxxx" }
```

Save the `key` value — you'll use this in Lovable.

### Step 6: Test Protected Endpoints

```bash
API_KEY="sk_xxxxxxxxxxxxx"

# List workflows (empty at first)
curl http://localhost:3001/workflows \
  -H "Authorization: Bearer $API_KEY"

# Create a workflow
curl -X POST http://localhost:3001/workflows \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Workflow",
    "config": { "trigger": "manual", "actions": [] }
  }'
```

### Step 7: Expose Publicly (for testing)

**Using ngrok** (quick testing):
```bash
ngrok http 3001
```

This gives you a URL like: `https://abcd-12-34-56-78.ngrok.io`

**Using Render or Fly.io** (production):
- Push your code to GitHub
- Connect to Render/Fly.io
- Set environment variables in the deployment dashboard
- Get your public HTTPS URL

### Step 8: Test All Endpoints

Before integrating with Lovable, verify:

```bash
# Health check (public)
curl https://YOUR_PUBLIC_URL/health

# List billing plans (public)
curl https://YOUR_PUBLIC_URL/billing/plans

# Get workflows (protected)
curl https://YOUR_PUBLIC_URL/workflows \
  -H "Authorization: Bearer $YOUR_API_KEY"

# View API docs
# Open in browser: https://YOUR_PUBLIC_URL/docs
```

### Step 9: Integrate with Lovable

1. Log in to your **Lovable** project
2. Open the chat or builder
3. Paste one of the integration prompts from **Section 6** above
4. Lovable will:
   - Fetch your OpenAPI spec
   - Parse available endpoints
   - Generate API integration code
   - Create UI components to call your API

### Step 10: Add More Features in Lovable

Once basic integration works, ask Lovable to add:

```
Add to my app:
1. Workflow creation form with:
   - Name input
   - Description textarea
   - Config JSON editor
   - Create button (POST /workflows)
   
2. Workflows list view with:
   - Display all workflows from GET /workflows
   - Show name, description, status
   - Delete button (DELETE /workflows/:id)
   - Edit button (opens form)

3. User dashboard with:
   - Current subscription plan
   - API key display with copy button
   - Usage statistics
```

---

## Architecture Overview

```
┌─────────────────────┐
│   Lovable App       │
│  (React/TypeScript) │
└──────────┬──────────┘
           │
           │ HTTPS + API Key
           │
┌──────────▼──────────────────────────────┐
│  API Gateway (Node.js/Express)          │
│  - /workflows                           │
│  - /api-keys                            │
│  - /billing                             │
│  - /health                              │
└──────────┬──────────────────────────────┘
           │
           │ Authenticated Queries
           │
┌──────────▼──────────────────────────────┐
│  Supabase PostgreSQL Database           │
│  - users                                │
│  - api_keys                             │
│  - workflows                            │
│  - subscriptions                        │
│  - audit_logs                           │
└─────────────────────────────────────────┘
           │
           │ Webhooks
           │
┌──────────▼──────────────────────────────┐
│  Stripe (Billing & Payments)            │
└─────────────────────────────────────────┘
```

---

## Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGIN` matches your Lovable published URL exactly
- Check for trailing slashes and protocol (http vs https)

### 401 Unauthorized on Protected Routes
- Verify API key is valid: `curl /api-keys with Authorization header`
- Check that Supabase `api_keys` table has the key
- Ensure key is active (`is_active = true`)

### 404 on `/docs-json`
- Verify API Gateway is using OpenAPI/Swagger middleware
- Check that docs generation is enabled in server config

### Lovable Can't Reach API
- Test with: `curl -I https://YOUR_PUBLIC_URL/health`
- Ensure HTTPS is enabled (not HTTP)
- Check firewall/NAT rules if behind a VPN

### Billing Endpoints Not Working
- Verify Stripe API keys are set in environment
- Check webhook secret is configured
- Review Stripe dashboard for failed events

### Database Connection Errors
- Verify `SUPABASE_URL` is correct (from Supabase dashboard Settings → API)
- Check `SUPABASE_SERVICE_ROLE_KEY` is the server key, not anon key
- Ensure database tables were created (run SQL script from SUPABASE_SETUP.md)

---

## Next Steps

1. ✅ Create Supabase project (see SUPABASE_SETUP.md)
2. ✅ Run API Gateway locally
3. ✅ Generate API key
4. ✅ Test endpoints with curl
5. ✅ Deploy API to public HTTPS URL
6. ✅ Integrate with Lovable
7. ✅ Add UI components in Lovable
8. ✅ Monitor usage in audit logs

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Lovable Documentation](https://lovable.dev/docs)
- [OpenAPI/Swagger Spec](https://swagger.io/specification/)

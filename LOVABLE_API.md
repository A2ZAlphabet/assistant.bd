# Lovable ↔ assistant.bd (API integration)

This repo includes a minimal API Gateway you can connect to a Lovable app.

## 1) Run the API Gateway locally

```bash
cd "/Users/sojib/Documents/New project/assistant.bd"
npm install
npm run -w @assistant.bd/api-gateway dev
```

Default URL: `http://localhost:3001`

Health check: `GET /health`

Billing:

- `GET /billing/plans` - list configured subscription plans.
- `POST /billing/checkout` - create a Stripe Checkout Session.
- `POST /billing/portal` - create a Stripe Customer Portal Session.
- `POST /billing/webhook` - Stripe webhook receiver for subscription events.

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

## 5) In Lovable: integrate the API

In your Lovable project chat, paste something like:

> Integrate my API.  
> Base URL: `https://YOUR_PUBLIC_API_DOMAIN`  
> OpenAPI spec: `https://YOUR_PUBLIC_API_DOMAIN/docs-json`  
> No auth for now.  
> Create a simple "Health" check that calls `GET /health` and displays the response.

If/when you add API keys or tokens to this API, route calls through Lovable Cloud + an Edge Function and store secrets in `Cloud → Secrets` (so keys are not exposed in the browser).

---

## Implementation Guide

### Step 1: Verify API Gateway Structure

Check that your monorepo has the `@assistant.bd/api-gateway` workspace:

```bash
ls -la packages/
# Should include: api-gateway, web, etc.
```

### Step 2: Environment Setup

Create `.env` files for local development:

**`.env.local` (in api-gateway root)**
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Stripe (if using billing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 3: Run Locally

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

### Step 4: Expose Publicly (for testing)

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

### Step 5: Test the Endpoints

Before integrating with Lovable, verify all endpoints work:

```bash
# Health check
curl https://YOUR_PUBLIC_URL/health

# List billing plans
curl https://YOUR_PUBLIC_URL/billing/plans

# View API docs
# Open in browser: https://YOUR_PUBLIC_URL/docs
```

### Step 6: Integrate with Lovable

1. Log in to your **Lovable** project
2. Open the chat or builder
3. Paste the integration prompt:

```
Integrate my API.
Base URL: https://YOUR_PUBLIC_URL
OpenAPI spec: https://YOUR_PUBLIC_URL/docs-json
No auth for now.
Create a simple Health Check component that calls GET /health and displays the response.
```

4. Lovable will:
   - Fetch your OpenAPI spec
   - Parse available endpoints
   - Generate API integration code
   - Create UI components to call your API

### Step 7: Add Authentication (Next Steps)

Once basic integration works, add API key authentication:

1. **Generate API keys** in your database or environment
2. **Pass keys via Lovable Cloud Secrets** (not in browser code)
3. **Use Edge Functions** to append auth headers before sending requests

Example Lovable Edge Function:
```javascript
export default async function handler(request) {
  const apiKey = Deno.env.get("API_KEY");
  
  const response = await fetch(request.url, {
    method: request.method,
    headers: {
      ...request.headers,
      Authorization: `Bearer ${apiKey}`
    },
    body: request.body
  });
  
  return response;
}
```

---

## Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGIN` matches your Lovable published URL exactly
- Check for trailing slashes and protocol (http vs https)

### 404 on `/docs-json`
- Verify API Gateway is using OpenAPI/Swagger middleware
- Check that docs generation is enabled in your server config

### Lovable Can't Reach API
- Test with: `curl -I https://YOUR_PUBLIC_URL/health`
- Ensure HTTPS is enabled (not HTTP)
- Check firewall/NAT rules if behind a VPN

### Billing Endpoints Not Working
- Verify Stripe API keys are set in environment
- Check webhook secret is configured
- Review Stripe dashboard for failed events

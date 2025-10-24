# CraftyCart KYC Demo

A comprehensive React + TypeScript demonstration of Persona KYC integration featuring both **Buyer (modal)** and **Seller (inline)** flows.

## Features

- **Buyer Flow**: Modal-based verification using Persona's JS SDK
- **Seller Flow**: Inline verification using Persona's React SDK  
- **Real-time Status Tracking**: Server-side status management with polling
- **Event Logging**: Comprehensive event tracking and debugging
- **Admin Dashboard**: Status monitoring and dev controls
- **Responsive Design**: Mobile-friendly interface
- **Type Safety**: Full TypeScript implementation with strict typing

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Backend**: Express + Node.js + TypeScript
- **KYC**: Persona JS SDK + Persona React SDK
- **Validation**: Zod schemas
- **Styling**: Custom CSS with responsive design

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Setup

Copy the environment template and configure your Persona credentials:

```bash
cp env.sample env.local
```

Edit `env.local` with your actual values:

```env
# Persona Configuration
VITE_PERSONA_ENVIRONMENT=sandbox
VITE_BUYER_TEMPLATE_ID=itmpl_your_actual_buyer_template_id
VITE_SELLER_TEMPLATE_ID=itmpl_your_actual_seller_template_id

# Webhook Secret (server-side only)
PERSONA_WEBHOOK_SECRET=whsec_your_actual_webhook_secret
```

### 3. Run the Application

**Terminal 1 - Frontend (Vite):**
```bash
npm run dev
```
Opens at: http://localhost:5173

**Terminal 2 - Backend (Express):**
```bash
npm run server
```
Runs at: http://localhost:3001

## Persona Dashboard Configuration

### 1. Allow-list Your Domain

In your Persona Dashboard:
1. Go to **Settings** → **Security**
2. Add `localhost:5173` to **Allowed Domains**
3. For production, add your actual domain

### 2. Template Configuration

- **Buyer Template**: Configure for modal flow with appropriate fields
- **Seller Template**: Configure for inline flow with seller-specific requirements
- Both templates should be set to **Sandbox** environment for testing

### 3. Webhook Setup (Optional)

For production webhook testing:
1. Set webhook URL to: `http://localhost:3001/webhooks/persona`
2. Enable events: `inquiry.completed`, `inquiry.decision_made`
3. Copy the webhook secret to your `.env` file

## Testing Flows

### Buyer Flow (Modal)

1. Navigate to **Buyer Flow** tab
2. Click **"Verify to Buy (≈2 min)"**
3. Complete verification in the modal
4. Observe status changes and event logs
5. Test **"Place Order"** button gating

**Test Scenarios:**
- ✅ Happy path: Complete verification → Order enabled
- ❌ Cancel: Modal closed → Order remains disabled
- ⏱️ Timeout: Session expires → Order remains disabled

### Seller Flow (Inline)

1. Navigate to **Seller Flow** tab
2. Complete verification in the embedded widget
3. Monitor status updates in real-time
4. Test **"Finish Setup"** button gating

**Test Scenarios:**
- ✅ Happy path: Complete verification → Setup enabled
- 🔍 Refer: Manual review → Setup disabled with "Under review"
- ❌ Decline: Verification failed → Setup disabled

### Admin Dashboard

1. Navigate to **Admin** tab
2. Monitor current status for both flows
3. Use **Dev Controls** to simulate decisions (development mode only)
4. View webhook information and configuration

## Project Structure

```
craftycart-kyc-demo/
├── src/
│   ├── components/
│   │   ├── BuyerModal.tsx      # Modal flow using Persona.Client
│   │   ├── SellerInline.tsx    # Inline flow using PersonaReact
│   │   ├── ConfigPanel.tsx     # Environment and template configuration
│   │   ├── LogPanel.tsx        # Event logging and debugging
│   │   └── GuardedButton.tsx   # Status-gated action buttons
│   ├── pages/
│   │   ├── BuyerDemo.tsx       # Buyer flow demonstration
│   │   ├── SellerDemo.tsx      # Seller flow demonstration
│   │   └── Admin.tsx           # Admin dashboard
│   ├── lib/
│   │   └── persona.ts          # Persona client utilities
│   ├── api/
│   │   └── client.ts           # API client and status management
│   ├── App.tsx                 # Main application component
│   ├── main.tsx               # Application entry point
│   └── styles.css             # Global styles
├── server/
│   ├── index.ts               # Express server with API endpoints
│   └── verifySignature.ts    # Webhook signature verification (stub)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## API Endpoints

### Frontend → Backend

- `GET /api/kyc/status?role=buyer|seller` - Get current verification status
- `POST /api/kyc/buyer/complete` - Complete buyer verification
- `POST /api/kyc/seller/complete` - Complete seller verification
- `POST /api/kyc/simulate` - Simulate verification decision (dev only)

### Persona → Backend (Webhooks)

- `POST /webhooks/persona` - Receive Persona webhook events

## Security Notes

⚠️ **Important Security Considerations:**

1. **Webhook Signature Verification**: Currently stubbed for demo purposes. Implement proper HMAC-SHA256 verification before production deployment.

2. **Environment Variables**: Never commit real credentials to version control. Use `.env.local` for local development.

3. **Domain Allow-listing**: Always configure allowed domains in Persona Dashboard to prevent unauthorized usage.

4. **Status Validation**: Never trust frontend status. All gating logic must verify status with the backend.

## Development

### Adding New Features

1. **New Verification Flow**: Create component in `src/components/`
2. **API Endpoints**: Add routes to `server/index.ts`
3. **Status Management**: Update `src/api/client.ts`
4. **Event Logging**: Use the `onLog` callback pattern

### Debugging

- **Event Logs**: Use the LogPanel to monitor Persona events
- **Network Tab**: Check API calls and responses
- **Console**: Backend logs include detailed webhook and API information
- **Admin Dashboard**: Monitor status changes and simulate decisions

## Production Deployment

### Checklist

- [ ] Replace template IDs with production values
- [ ] Set `VITE_PERSONA_ENVIRONMENT=production`
- [ ] Implement proper webhook signature verification
- [ ] Configure production domain allow-listing
- [ ] Set up proper error monitoring and logging
- [ ] Test all flows in production environment

### Environment Variables

```env
VITE_PERSONA_ENVIRONMENT=production
VITE_BUYER_TEMPLATE_ID=itmpl_prod_buyer_template
VITE_SELLER_TEMPLATE_ID=itmpl_prod_seller_template
PERSONA_WEBHOOK_SECRET=whsec_prod_webhook_secret
```

## Troubleshooting

### Common Issues

1. **Widget Not Loading**: Check domain allow-listing in Persona Dashboard
2. **Template ID Errors**: Verify template IDs start with `itmpl_`
3. **Environment Mismatch**: Ensure template environment matches `VITE_PERSONA_ENVIRONMENT`
4. **CORS Errors**: Verify backend is running on port 3001
5. **Status Not Updating**: Check network requests and polling intervals

### Debug Commands

```bash
# Check if backend is running
curl http://localhost:3001/health

# Test webhook endpoint
curl -X POST http://localhost:3001/webhooks/persona \
  -H "Content-Type: application/json" \
  -d '{"type":"test","data":{}}'
```

## Support

For Persona-specific issues:
- [Persona Documentation](https://docs.withpersona.com/)
- [Persona Support](https://withpersona.com/support)

For this demo:
- Check the event logs in the LogPanel
- Review the Admin dashboard for status information
- Use browser dev tools to inspect network requests
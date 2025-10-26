# CraftyCart KYC Demo

A comprehensive React + TypeScript demonstration of Persona KYC integration featuring both **Buyer (modal)** and **Seller (inline)** flows.

<img width="958" height="469" alt="Screenshot 2025-10-26 155806" src="https://github.com/user-attachments/assets/cfb3e0c3-5e1b-4c30-8d3f-83f6ea2d603d" />
<img width="958" height="471" alt="Screenshot 2025-10-26 155843" src="https://github.com/user-attachments/assets/b13507b3-96b5-47d2-884f-8b14927dfd8a" />


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
VITE_BUYER_TEMPLATE_ID=itmpl_uHaDfigwShJ4xo4KUVqk14tcjJzU
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

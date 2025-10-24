import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { z } from 'zod'
import { verifyPersonaSignature } from './verifySignature.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// In-memory store for demo purposes
interface KYCData {
  status: 'approved' | 'referred' | 'declined' | 'pending' | null
  inquiryId?: string
  completedAt?: string
  decisionReason?: string
}

const kycStore: Record<string, { buyer: KYCData; seller: KYCData }> = {}

// Get or create user data
function getUserData(userId: string = 'demo-user') {
  if (!kycStore[userId]) {
    kycStore[userId] = {
      buyer: { status: null },
      seller: { status: null }
    }
  }
  return kycStore[userId]
}

// Validation schemas
const completeKYCSchema = z.object({
  inquiryId: z.string(),
  status: z.string()
})

const simulateSchema = z.object({
  role: z.enum(['buyer', 'seller']),
  status: z.enum(['approved', 'declined', 'referred'])
})

// API Routes
app.get('/api/kyc/status', (req, res) => {
  const { role } = req.query
  
  if (!role || (role !== 'buyer' && role !== 'seller')) {
    return res.status(400).json({ error: 'Invalid role parameter' })
  }

  const userData = getUserData()
  const kycData = userData[role as 'buyer' | 'seller']
  
  res.json({
    role,
    status: kycData.status,
    inquiryId: kycData.inquiryId
  })
})

app.post('/api/kyc/buyer/complete', (req, res) => {
  try {
    const { inquiryId, status } = completeKYCSchema.parse(req.body)
    const userData = getUserData()
    
    userData.buyer = {
      status: status as any,
      inquiryId,
      completedAt: new Date().toISOString()
    }
    
    console.log('Buyer KYC completed:', { inquiryId, status })
    res.json({ success: true })
  } catch (error) {
    console.error('Buyer KYC completion error:', error)
    res.status(400).json({ error: 'Invalid request data' })
  }
})

app.post('/api/kyc/seller/complete', (req, res) => {
  try {
    const { inquiryId, status } = completeKYCSchema.parse(req.body)
    const userData = getUserData()
    
    userData.seller = {
      status: status as any,
      inquiryId,
      completedAt: new Date().toISOString()
    }
    
    console.log('Seller KYC completed:', { inquiryId, status })
    res.json({ success: true })
  } catch (error) {
    console.error('Seller KYC completion error:', error)
    res.status(400).json({ error: 'Invalid request data' })
  }
})

app.post('/api/kyc/simulate', (req, res) => {
  try {
    const { role, status } = simulateSchema.parse(req.body)
    const userData = getUserData()
    
    userData[role] = {
      ...userData[role],
      status,
      completedAt: new Date().toISOString(),
      decisionReason: `Simulated ${status} decision`
    }
    
    console.log(`Simulated ${role} decision:`, { status })
    res.json({ success: true })
  } catch (error) {
    console.error('Simulation error:', error)
    res.status(400).json({ error: 'Invalid request data' })
  }
})

// Webhook endpoint
app.post('/webhooks/persona', (req, res) => {
  try {
    // Verify signature (stubbed for demo)
    const isValidSignature = verifyPersonaSignature(req)
    
    if (!isValidSignature) {
      console.warn('Invalid webhook signature')
      // In production, you should reject invalid signatures
      // return res.status(401).json({ error: 'Invalid signature' })
    }
    
    const payload = req.body
    console.log('Received Persona webhook:', JSON.stringify(payload, null, 2))
    
    // Handle different webhook events
    if (payload.type === 'inquiry.completed') {
      const { inquiryId, status } = payload.data
      const userData = getUserData()
      
      // Update both buyer and seller if they match the inquiry
      if (userData.buyer.inquiryId === inquiryId) {
        userData.buyer.status = status
        userData.buyer.completedAt = new Date().toISOString()
      }
      if (userData.seller.inquiryId === inquiryId) {
        userData.seller.status = status
        userData.seller.completedAt = new Date().toISOString()
      }
    }
    
    if (payload.type === 'inquiry.decision_made') {
      const { inquiryId, status, decisionReason } = payload.data
      const userData = getUserData()
      
      // Update both buyer and seller if they match the inquiry
      if (userData.buyer.inquiryId === inquiryId) {
        userData.buyer.status = status
        userData.buyer.decisionReason = decisionReason
      }
      if (userData.seller.inquiryId === inquiryId) {
        userData.seller.status = status
        userData.seller.decisionReason = decisionReason
      }
    }
    
    res.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhooks/persona`)
})

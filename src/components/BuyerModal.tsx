import React, { useState } from 'react'
import { createPersonaClient, PersonaCallbacks } from '../lib/persona'
import { completeKYC, fetchKYCStatus, KYCStatus } from '../api/client'

interface BuyerModalProps {
  onLog: (name: string, meta: unknown) => void
  onStatusChange: (status: KYCStatus) => void
}

export default function BuyerModal({ onLog, onStatusChange }: BuyerModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerifyClick = async () => {
    setIsLoading(true)
    setError(null)

    const templateId = import.meta.env.VITE_BUYER_TEMPLATE_ID
    const environment = import.meta.env.VITE_PERSONA_ENVIRONMENT as 'sandbox' | 'production'

    if (!templateId) {
      setError('Buyer template ID not configured')
      setIsLoading(false)
      return
    }

    const callbacks: PersonaCallbacks = {
      onLoad: () => {
        onLog('buyer.onLoad', { templateId, environment })
      },
      onReady: () => {
        onLog('buyer.onReady', {})
      },
      onComplete: async (payload) => {
        onLog('buyer.onComplete', payload)
        try {
          await completeKYC('buyer', payload.inquiryId, payload.status)
          const status = await fetchKYCStatus('buyer')
          onStatusChange(status)
        } catch (err) {
          console.error('Failed to complete buyer KYC:', err)
          setError('Failed to complete verification')
        }
      },
      onCancel: () => {
        onLog('buyer.onCancel', {})
        setError('Verification cancelled')
      },
      onError: (error) => {
        onLog('buyer.onError', { error: error.message })
        setError(`Verification error: ${error.message}`)
      },
      onEvent: (name, meta) => {
        onLog(`buyer.${name}`, meta)
      }
    }

    try {
      const client = createPersonaClient(
        { templateId, environment, routingCountry: 'US' },
        callbacks
      )
      
      // Open the modal
      client.open()
    } catch (err) {
      console.error('Failed to create Persona client:', err)
      setError('Failed to start verification')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="buyer-modal">
      <h2>Buyer Verification</h2>
      <p>Complete identity verification to proceed with your purchase.</p>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <button 
        className="verify-button"
        onClick={handleVerifyClick}
        disabled={isLoading}
      >
        {isLoading ? 'Starting verification...' : 'Verify to Buy (≈2 min)'}
      </button>
      
      <div className="verification-note">
        <small>
          Verification is required to complete your purchase. 
          If you cancel or encounter an error, you'll need to verify again.
        </small>
      </div>
    </div>
  )
}

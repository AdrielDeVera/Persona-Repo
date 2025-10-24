import React, { useState, useEffect } from 'react'
import { PersonaReact } from 'persona-react'
import { completeKYC, fetchKYCStatus, KYCStatus } from '../api/client'

interface SellerInlineProps {
  onLog: (name: string, meta: unknown) => void
  onStatusChange: (status: KYCStatus) => void
}

export default function SellerInline({ onLog, onStatusChange }: SellerInlineProps) {
  const [status, setStatus] = useState<KYCStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Poll for status updates
    const pollStatus = async () => {
      const currentStatus = await fetchKYCStatus('seller')
      setStatus(currentStatus)
      onStatusChange(currentStatus)
    }

    pollStatus()
    const interval = setInterval(pollStatus, 2000) // Poll every 2 seconds

    return () => clearInterval(interval)
  }, [onStatusChange])

  const handleComplete = async (payload: { inquiryId: string; status: string; fields?: Record<string, unknown> }) => {
    onLog('seller.onComplete', payload)
    setIsLoading(true)
    
    try {
      await completeKYC('seller', payload.inquiryId, payload.status)
      const newStatus = await fetchKYCStatus('seller')
      setStatus(newStatus)
      onStatusChange(newStatus)
    } catch (error) {
      console.error('Failed to complete seller KYC:', error)
      onLog('seller.error', { error: 'Failed to complete verification' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleError = (error: Error) => {
    onLog('seller.onError', { error: error.message })
  }

  const handleEvent = (name: string, meta: unknown) => {
    onLog(`seller.${name}`, meta)
  }

  const templateId = import.meta.env.VITE_SELLER_TEMPLATE_ID
  const environment = import.meta.env.VITE_PERSONA_ENVIRONMENT as 'sandbox' | 'production'

  if (!templateId) {
    return (
      <div className="seller-inline">
        <h2>Seller Verification</h2>
        <div className="error-message">
          Seller template ID not configured
        </div>
      </div>
    )
  }

  return (
    <div className="seller-inline">
      <div className="step-header">
        <h2>Step 2 of 4 — Verify Identity</h2>
        <p>Complete identity verification to continue with seller setup.</p>
      </div>

      <div className="verification-container">
        <PersonaReact
          templateId={templateId}
          environment={environment}
          onComplete={handleComplete}
          onError={handleError}
          onEvent={handleEvent}
        />
      </div>

      {status && (
        <div className="status-display">
          <h3>Verification Status</h3>
          <div className={`status-badge ${status.status || 'pending'}`}>
            {status.status || 'Pending'}
          </div>
          {status.inquiryId && (
            <p><small>Inquiry ID: {status.inquiryId}</small></p>
          )}
        </div>
      )}

      {isLoading && (
        <div className="loading-message">
          Processing verification...
        </div>
      )}
    </div>
  )
}

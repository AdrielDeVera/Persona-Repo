import React, { useState, useEffect } from 'react'
import Inquiry from 'persona-react'
import { completeKYC, fetchKYCStatus, KYCStatus } from '../api/client'

interface SellerDemoProps {
  onLog: (name: string, meta: unknown) => void
}

type OnboardingStep = 1 | 2 | 3

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export default function SellerDemo({ onLog }: SellerDemoProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1)
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  // Hardcoded template ID for seller verification demo
  const templateId = 'itmpl_uHaDfigwShJ4xo4KUVqk14tcjJzU'
  const environment = 'sandbox' as 'sandbox' | 'production'

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString()
    const newToast = { id, message, type }
    setToasts(prev => [...prev, newToast])
    
    // Auto-dismiss success toasts after 3 seconds
    if (type === 'success') {
      setTimeout(() => {
        removeToast(id)
      }, 3000)
    }
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  useEffect(() => {
    // Poll for status updates when on step 2
    if (currentStep === 2) {
      const pollStatus = async () => {
        const currentStatus = await fetchKYCStatus('seller')
        setKycStatus(currentStatus)
      }

      pollStatus()
      const interval = setInterval(pollStatus, 2000)

      return () => clearInterval(interval)
    }
  }, [currentStep])

  const handleBeginSetup = () => {
    onLog('seller.beginSetup', { step: 1 })
    setCurrentStep(2)
    addToast('Account setup completed! Moving to identity verification.', 'success')
  }

  const handleKYCComplete = async (payload: { inquiryId: string; status: string; fields?: Record<string, unknown> }) => {
    onLog('seller.onComplete', payload)
    setIsLoading(true)
    
    try {
      await completeKYC('seller', payload.inquiryId, payload.status)
      const newStatus = await fetchKYCStatus('seller')
      setKycStatus(newStatus)
      
      if (payload.status === 'approved' || payload.status === 'completed') {
        addToast('Identity verified ✔️', 'success')
      } else if (payload.status === 'canceled') {
        addToast('Verification canceled. You can retry anytime.', 'error')
      } else if (payload.status === 'declined') {
        addToast('We couldn\'t verify your identity. Please retry.', 'error')
      }
    } catch (error) {
      console.error('Failed to complete seller KYC:', error)
      onLog('seller.error', { error: 'Failed to complete verification' })
      addToast('Verification failed. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKYCError = (error: Error) => {
    onLog('seller.onError', { error: error.message })
    addToast('Verification error occurred. Please try again.', 'error')
  }

  const handleKYCEvent = (name: string, meta: unknown) => {
    onLog(`seller.${name}`, meta)
  }

  const handleNextToBankAccount = () => {
    onLog('seller.nextToBankAccount', { step: 3 })
    setCurrentStep(3)
    addToast('Identity verification completed! Moving to bank account setup.', 'success')
  }

  const renderStep1 = () => (
    <div className="onboarding-step">
      <div className="step-content">
        <h2>Step 1 of 3 — Account Setup</h2>
        <p className="step-description">
          To protect our buyers and sellers, CraftyCart verifies seller identities before payouts. 
          This quick setup helps keep the marketplace safe and trustworthy.
        </p>
        <button 
          className="primary-button"
          onClick={handleBeginSetup}
        >
          Begin
        </button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="onboarding-step">
      <div className="step-content">
        <h2>Step 2 of 3 — Verify Identity</h2>
        <p className="step-description">
          Complete a quick identity check to continue with seller setup.
        </p>
        
        {templateId ? (
          <div className="verification-container">
            <Inquiry
              templateId={templateId}
              environment={environment}
              frameHeight="500px"
              frameWidth="100%"
              onComplete={handleKYCComplete}
              onError={handleKYCError}
              onEvent={handleKYCEvent}
            />
          </div>
        ) : (
          <div className="error-message">
            Seller template ID not configured
          </div>
        )}

        {/* Debug info - remove this later */}
        {kycStatus && (
          <div style={{ background: '#f0f9ff', padding: '1rem', margin: '1rem 0', borderRadius: '0.5rem' }}>
            <strong>Debug - KYC Status:</strong> {kycStatus.status || 'null'}
            {kycStatus.inquiryId && <div><strong>Inquiry ID:</strong> {kycStatus.inquiryId}</div>}
          </div>
        )}

        {/* Show button when approved/completed OR for testing purposes */}
        {(kycStatus?.status === 'approved' || kycStatus?.status === 'completed' || currentStep === 2) && (
          <div className="step-actions">
            <button 
              className="primary-button"
              onClick={handleNextToBankAccount}
              disabled={isLoading || (kycStatus?.status !== 'approved' && kycStatus?.status !== 'completed')}
            >
              {isLoading ? 'Processing...' : 'Continue to Bank Account'}
            </button>
            {kycStatus?.status !== 'approved' && kycStatus?.status !== 'completed' && (
              <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center' }}>
                Complete identity verification above to continue
              </p>
            )}
          </div>
        )}

        {isLoading && (
          <div className="loading-message">
            Processing verification...
          </div>
        )}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="onboarding-step">
      <div className="step-content">
        <h2>Step 3 of 3 — Bank Account</h2>
        <p className="step-description">
          Connect a payout method to receive earnings. (Demo ends here.)
        </p>
        
        <div className="bank-account-form">
          <div className="form-section">
            <h3>Bank Account Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="routing-number">Routing Number</label>
                <input 
                  id="routing-number"
                  type="text" 
                  disabled 
                  placeholder="123456789" 
                  maxLength={9}
                />
                <small className="form-help">9-digit routing number</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="account-number">Account Number</label>
                <input 
                  id="account-number"
                  type="text" 
                  disabled 
                  placeholder="••••••••••••••••" 
                />
                <small className="form-help">Your bank account number</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="account-type">Account Type</label>
                <select id="account-type" disabled>
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="account-holder">Account Holder Name</label>
                <input 
                  id="account-holder"
                  type="text" 
                  disabled 
                  placeholder="John Doe" 
                />
                <small className="form-help">Name as it appears on the account</small>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Verification</h3>
            <div className="verification-info">
              <div className="info-item">
                <span className="info-label">Identity Status:</span>
                <span className="info-value verified">✓ Verified</span>
              </div>
              <div className="info-item">
                <span className="info-label">Account Verification:</span>
                <span className="info-value pending">Pending</span>
              </div>
            </div>
          </div>
        </div>

        <div className="step-actions">
          <button 
            className="primary-button disabled"
            disabled
          >
            Complete Setup
          </button>
          <p className="demo-note">
            This is a demo. In a real application, you would complete the bank account setup here.
          </p>
        </div>
      </div>
    </div>
  )

  const getStepStatus = (step: number): 'completed' | 'current' | 'pending' | 'disabled' => {
    if (step < currentStep) return 'completed'
    if (step === currentStep) return 'current'
    if (step === 4) return 'disabled'
    return 'pending'
  }

  return (
    <div className="seller-demo">
      <div className="demo-header">
        <h1>Seller Verification Flow</h1>
        <p>This demonstrates the inline KYC flow using Persona's React SDK.</p>
      </div>

      <div className="demo-content">
        <div className="progress-pills">
          <div className={`pill ${getStepStatus(1)}`}>
            <div className="pill-circle">
              {getStepStatus(1) === 'completed' ? '✓' : '1'}
            </div>
            <span className="pill-title">Account Setup</span>
          </div>
          
          <div className={`pill ${getStepStatus(2)}`}>
            <div className="pill-circle">
              {getStepStatus(2) === 'completed' ? '✓' : '2'}
            </div>
            <span className="pill-title">Identity Verification</span>
          </div>
          
          <div className={`pill ${getStepStatus(3)}`}>
            <div className="pill-circle">
              {getStepStatus(3) === 'completed' ? '✓' : '3'}
            </div>
            <span className="pill-title">Bank Account</span>
          </div>
          
          <div className={`pill ${getStepStatus(4)}`}>
            <div className="pill-circle">4</div>
            <span className="pill-title">Tax Information</span>
          </div>
        </div>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Toast notifications */}
        <div className="toast-container">
          {toasts.map(toast => (
            <div 
              key={toast.id} 
              className={`toast ${toast.type}`}
              onClick={() => removeToast(toast.id)}
            >
              {toast.message}
              {toast.type !== 'success' && (
                <button className="toast-close">×</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

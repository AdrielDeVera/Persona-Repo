import React, { useState } from 'react'
import SellerInline from '../components/SellerInline'
import GuardedButton from '../components/GuardedButton'
import { KYCStatus } from '../api/client'

interface SellerDemoProps {
  onLog: (name: string, meta: unknown) => void
}

export default function SellerDemo({ onLog }: SellerDemoProps) {
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null)

  const handleFinishSetup = () => {
    onLog('seller.finishSetup', { status: kycStatus })
    alert('Seller setup completed! (Demo)')
  }

  return (
    <div className="seller-demo">
      <div className="demo-header">
        <h1>Seller Verification Flow</h1>
        <p>This demonstrates the inline KYC flow using Persona's React SDK.</p>
      </div>

      <div className="demo-content">
        <div className="setup-steps">
          <div className="step completed">
            <span className="step-number">1</span>
            <span className="step-title">Account Setup</span>
            <span className="step-status">✓</span>
          </div>
          
          <div className="step current">
            <span className="step-number">2</span>
            <span className="step-title">Identity Verification</span>
            <span className="step-status">In Progress</span>
          </div>
          
          <div className="step pending">
            <span className="step-number">3</span>
            <span className="step-title">Bank Account</span>
            <span className="step-status">Pending</span>
          </div>
          
          <div className="step pending">
            <span className="step-number">4</span>
            <span className="step-title">Tax Information</span>
            <span className="step-status">Pending</span>
          </div>
        </div>

        <SellerInline 
          onLog={onLog} 
          onStatusChange={setKycStatus}
        />

        <div className="setup-section">
          <h3>Complete Setup</h3>
          <p>Finish your seller account setup after verification is approved.</p>
          
          <GuardedButton
            role="seller"
            onClick={handleFinishSetup}
            className="finish-setup-button"
          >
            Finish Setup
          </GuardedButton>
        </div>

        {kycStatus && (
          <div className="status-info">
            <h4>Verification Status</h4>
            <div className={`status-badge ${kycStatus.status || 'pending'}`}>
              {kycStatus.status || 'Pending'}
            </div>
            {kycStatus.inquiryId && (
              <p><small>Inquiry ID: {kycStatus.inquiryId}</small></p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

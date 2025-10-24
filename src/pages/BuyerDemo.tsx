import React, { useState } from 'react'
import BuyerModal from '../components/BuyerModal'
import GuardedButton from '../components/GuardedButton'
import { KYCStatus } from '../api/client'

interface BuyerDemoProps {
  onLog: (name: string, meta: unknown) => void
}

export default function BuyerDemo({ onLog }: BuyerDemoProps) {
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null)

  const handlePlaceOrder = () => {
    onLog('buyer.placeOrder', { status: kycStatus })
    alert('Order placed successfully! (Demo)')
  }

  return (
    <div className="buyer-demo">
      <div className="demo-header">
        <h1>Buyer Verification Flow</h1>
        <p>This demonstrates the modal-based KYC flow using Persona's JS SDK.</p>
      </div>

      <div className="demo-content">
        <BuyerModal 
          onLog={onLog} 
          onStatusChange={setKycStatus}
        />

        <div className="order-section">
          <h3>Complete Your Order</h3>
          <p>You must complete identity verification before placing your order.</p>
          
          <GuardedButton
            role="buyer"
            onClick={handlePlaceOrder}
            className="place-order-button"
          >
            Place Order
          </GuardedButton>
        </div>

        {kycStatus && (
          <div className="status-info">
            <h4>Current Status</h4>
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

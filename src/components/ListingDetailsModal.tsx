import { useState } from 'react'
import { MarketplaceItem } from './MarketplaceGrid'
import { createPersonaClient, PersonaCallbacks } from '../lib/persona'
import { completeKYC, fetchKYCStatus, KYCStatus } from '../api/client'
import { usePersonaModal } from '../hooks/usePersonaModal'

interface ListingDetailsModalProps {
  item: MarketplaceItem | null
  isOpen: boolean
  onClose: () => void
  onLog: (name: string, meta: unknown) => void
  onOrderPlaced: (item: MarketplaceItem) => void
  purchasedItems?: Set<string>
  kycStatus?: KYCStatus | null
  onKYCStatusChange?: (status: KYCStatus) => void
}

export default function ListingDetailsModal({ 
  item, 
  isOpen, 
  onClose, 
  onLog, 
  onOrderPlaced,
  purchasedItems = new Set(),
  kycStatus,
  onKYCStatusChange
}: ListingDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { isModalOpen, setIsModalOpen } = usePersonaModal()

  const handleConfirmPurchase = async () => {
    if (!item) return
    
    
    // Check if user is already KYC verified
    if (kycStatus?.status === 'completed' || kycStatus?.status === 'approved') {
      console.log('Skipping KYC - user is verified')
      // Skip KYC and directly place order
      setIsLoading(true)
      try {
        onOrderPlaced(item)
        setShowSuccessModal(true)
        onLog('marketplace.orderPlacedDirect', { itemId: item.id, title: item.title, kycSkipped: true })
      } catch (err) {
        console.error('Failed to place order:', err)
        setError('Failed to place order')
      } finally {
        setIsLoading(false)
      }
      return
    }
    
    console.log('Proceeding with KYC verification')
    // Proceed with KYC verification
    setIsLoading(true)
    setError(null)

    // Hardcoded template ID for buyer verification demo
    const templateId = 'itmpl_uHaDfigwShJ4xo4KUVqk14tcjJzU'
    const environment = 'sandbox' as 'sandbox' | 'production'

    const callbacks: PersonaCallbacks = {
      onLoad: () => {
        onLog('buyer.onLoad', { templateId, environment, itemId: item.id })
        setIsModalOpen(true)
      },
      onReady: () => {
        onLog('buyer.onReady', { itemId: item.id })
      },
      onComplete: async (payload) => {
        onLog('buyer.onComplete', { ...payload, itemId: item.id })
        setIsModalOpen(false)
        try {
          await completeKYC('buyer', payload.inquiryId, payload.status)
          const status = await fetchKYCStatus('buyer')
          
          console.log('KYC Complete - Fetched Status:', status)
          
          if (onKYCStatusChange) {
            console.log('Calling onKYCStatusChange with:', status)
            onKYCStatusChange(status)
          }
          
          if (status.status === 'completed' || status.status === 'approved') {
            // Show success modal and place order
            setShowSuccessModal(true)
            onOrderPlaced(item)
            onLog('buyer.orderPlaced', { itemId: item.id, status: status.status })
          } else {
            setError('Verification was not completed. Please try again.')
          }
        } catch (err) {
          console.error('Failed to complete buyer KYC:', err)
          setError('Failed to complete verification')
        }
      },
      onCancel: () => {
        onLog('buyer.onCancel', { itemId: item.id })
        setIsModalOpen(false)
        setError('Verification was canceled. Please try again.')
      },
      onError: (error) => {
        onLog('buyer.onError', { error: error.message, itemId: item.id })
        setIsModalOpen(false)
        setError(`We couldn't verify your identity. You can retry verification.`)
      },
      onEvent: (name, meta) => {
        onLog(`buyer.${name}`, { meta, itemId: item.id })
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

  const handleClose = () => {
    setError(null)
    setShowSuccessModal(false)
    onClose()
  }

  if (!isOpen || !item) return null


  return (
    <>
      {/* Visual indicator when modal is open */}
      {isModalOpen && (
        <div className="persona-modal-indicator">
          🔒 Verification in progress - Site remains accessible
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal success-modal">
            <div className="success-content">
              <div className="success-icon">✅</div>
              <h2>Verified & Order Placed</h2>
              <p>Thanks! Your identity is verified and your order for <strong>{item.title}</strong> is on the way.</p>
              <p>You'll receive a confirmation email shortly with shipping details.</p>
              <button className="close-button" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listing Details Modal */}
      <div className="modal-overlay">
        <div className="modal listing-details-modal">
          <div className="modal-header">
            <h2>{item.title}</h2>
            <button className="close-button" onClick={handleClose}>×</button>
          </div>
          
          <div className="modal-content">
            <div className="item-details-grid">
              <div className="item-image-large">
                <img src={item.image} alt={item.title} />
                <div className="item-condition">{item.condition}</div>
              </div>
              
              <div className="item-info">
                <h3>{item.title}</h3>
                <p className="item-description">{item.description}</p>
                
                <div className="item-meta">
                  <div className="meta-row">
                    <span className="meta-label">Price:</span>
                    <span className="meta-value price">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Seller:</span>
                    <span className="meta-value">{item.seller}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Location:</span>
                    <span className="meta-value">{item.location}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">{item.category}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Condition:</span>
                    <span className="meta-value">{item.condition}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {kycStatus && kycStatus.status !== 'completed' && kycStatus.status !== 'approved' && (
              <div className="kyc-status">
                <h4>Verification Status</h4>
                <div className={`status-badge ${kycStatus.status || 'pending'}`}>
                  {kycStatus.status || 'Pending'}
                </div>
                {kycStatus.inquiryId && (
                  <p><small>Inquiry ID: {kycStatus.inquiryId}</small></p>
                )}
              </div>
            )}
            
            
            <div className="modal-actions">
              {item && purchasedItems.has(item.id) ? (
                <div className="already-purchased">
                  <div className="purchased-status">
                    <span className="purchased-icon">✓</span>
                    <span>This item has already been purchased</span>
                  </div>
                </div>
              ) : (
                <>
                  {kycStatus?.status === 'completed' || kycStatus?.status === 'approved' ? (
                    <div className="verified-user-section">
                      <div className="verified-status">
                        <span className="verified-icon">✓</span>
                        <span>You are verified! No additional verification needed.</span>
                      </div>
                      <button 
                        className="confirm-purchase-button verified"
                        onClick={handleConfirmPurchase}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Placing order...' : 'Confirm Purchase'}
                      </button>
                    </div>
                  ) : (
                    <>
                      <button 
                        className="confirm-purchase-button"
                        onClick={handleConfirmPurchase}
                        disabled={isLoading || isModalOpen}
                      >
                        {isLoading ? 'Starting verification...' : 'Confirm Purchase'}
                      </button>
                      
                      <div className="verification-note">
                        <small>
                          Launching verification… complete the Persona flow to continue.
                        </small>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

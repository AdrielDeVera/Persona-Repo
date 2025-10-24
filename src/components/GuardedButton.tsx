import React from 'react'
import { fetchKYCStatus, KYCStatus } from '../api/client'

interface GuardedButtonProps {
  children: React.ReactNode
  onClick: () => void
  role: 'buyer' | 'seller'
  className?: string
}

export default function GuardedButton({ children, onClick, role, className = '' }: GuardedButtonProps) {
  const [status, setStatus] = React.useState<KYCStatus | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const currentStatus = await fetchKYCStatus(role)
        setStatus(currentStatus)
      } catch (error) {
        console.error('Failed to fetch status:', error)
        setStatus({ role, status: null })
      } finally {
        setIsLoading(false)
      }
    }

    checkStatus()
    // Poll for status updates
    const interval = setInterval(checkStatus, 3000)
    return () => clearInterval(interval)
  }, [role])

  const isDisabled = isLoading || status?.status !== 'approved'

  const getStatusMessage = () => {
    if (isLoading) return 'Checking verification status...'
    if (!status) return 'Verification required'
    if (status.status === 'approved') return 'Verified ✓'
    if (status.status === 'referred') return 'Under review'
    if (status.status === 'declined') return 'Verification declined'
    return 'Verification required'
  }

  return (
    <div className="guarded-button-container">
      <button 
        className={`guarded-button ${className}`}
        onClick={onClick}
        disabled={isDisabled}
      >
        {children}
      </button>
      <div className={`status-message ${status?.status || 'pending'}`}>
        {getStatusMessage()}
      </div>
    </div>
  )
}

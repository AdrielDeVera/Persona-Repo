import React, { useState, useEffect } from 'react'
import { fetchKYCStatus, postJSON, KYCStatus } from '../api/client'
import ConfigPanel from '../components/ConfigPanel'
import LogPanel from '../components/LogPanel'

export default function Admin() {
  const [buyerStatus, setBuyerStatus] = useState<KYCStatus | null>(null)
  const [sellerStatus, setSellerStatus] = useState<KYCStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [logs, setLogs] = useState<Array<{ id: string; timestamp: string; name: string; meta: unknown }>>([])

  const addLog = (name: string, meta: unknown) => {
    const log = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      name,
      meta
    }
    setLogs(prev => [log, ...prev])
  }

  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const [buyer, seller] = await Promise.all([
          fetchKYCStatus('buyer'),
          fetchKYCStatus('seller')
        ])
        setBuyerStatus(buyer)
        setSellerStatus(seller)
      } catch (error) {
        console.error('Failed to load statuses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStatuses()
    const interval = setInterval(loadStatuses, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const simulateDecision = async (role: 'buyer' | 'seller', status: 'approved' | 'declined' | 'referred') => {
    try {
      await postJSON('/api/kyc/simulate', { role, status })
      // Reload statuses
      const [buyer, seller] = await Promise.all([
        fetchKYCStatus('buyer'),
        fetchKYCStatus('seller')
      ])
      setBuyerStatus(buyer)
      setSellerStatus(seller)
    } catch (error) {
      console.error('Failed to simulate decision:', error)
    }
  }

  const renderStatusCard = (role: 'buyer' | 'seller', status: KYCStatus | null) => (
    <div className="status-card">
      <h3>{role.charAt(0).toUpperCase() + role.slice(1)} Status</h3>
      <div className={`status-badge ${status?.status || 'pending'}`}>
        {status?.status || 'No verification'}
      </div>
      {status?.inquiryId && (
        <p><small>Inquiry ID: {status.inquiryId}</small></p>
      )}
      
      {import.meta.env.DEV && status?.status === 'pending' && (
        <div className="dev-controls">
          <h4>Dev Controls:</h4>
          <div className="simulate-buttons">
            <button onClick={() => simulateDecision(role, 'approved')}>
              Approve
            </button>
            <button onClick={() => simulateDecision(role, 'declined')}>
              Decline
            </button>
            <button onClick={() => simulateDecision(role, 'referred')}>
              Refer
            </button>
          </div>
        </div>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <div className="admin">
        <h1>Admin Dashboard</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="admin">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Monitor KYC verification statuses and manage decisions.</p>
      </div>

      <div className="admin-content">
        <div className="admin-main">
          <div className="status-cards">
            {renderStatusCard('buyer', buyerStatus)}
            {renderStatusCard('seller', sellerStatus)}
          </div>

          <div className="admin-info">
            <h3>Webhook Information</h3>
            <p>
              Webhook endpoint: <code>POST /webhooks/persona</code>
            </p>
            <p>
              Events handled: <code>inquiry.completed</code>, <code>inquiry.decision_made</code>
            </p>
            <p>
              <small>
                Note: Signature verification is stubbed for demo purposes. 
                Implement proper HMAC verification for production.
              </small>
            </p>
          </div>

          {import.meta.env.DEV && (
            <div className="dev-note">
              <h3>Development Mode</h3>
              <p>
                Use the "Simulate Decision" buttons above to test different verification outcomes 
                when no webhook is connected.
              </p>
            </div>
          )}
        </div>

        <div className="admin-sidebar">
          <ConfigPanel />
          <LogPanel logs={logs} />
        </div>
      </div>
    </div>
  )
}

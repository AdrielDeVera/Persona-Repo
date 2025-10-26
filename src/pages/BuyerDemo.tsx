import { useState, useEffect } from 'react'
import MarketplaceGrid, { MarketplaceItem } from '../components/MarketplaceGrid'
import ListingDetailsModal from '../components/ListingDetailsModal'
import { KYCStatus, fetchKYCStatus } from '../api/client'

interface BuyerDemoProps {
  onLog: (name: string, meta: unknown) => void
}

export default function BuyerDemo({ onLog }: BuyerDemoProps) {
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set())
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null)

  // Fetch initial KYC status on component mount
  useEffect(() => {
    const loadKYCStatus = async () => {
      try {
        const status = await fetchKYCStatus('buyer')
        console.log('Initial KYC Status loaded:', status)
        setKycStatus(status)
        onLog('kyc.initialStatus', { status: status.status, inquiryId: status.inquiryId })
      } catch (err) {
        console.error('Failed to load initial KYC status:', err)
      }
    }
    
    loadKYCStatus()
  }, [onLog])

  const handleItemClick = (item: MarketplaceItem) => {
    // Don't allow clicking on already purchased items
    if (purchasedItems.has(item.id)) {
      return
    }
    
    console.log('Opening modal for item:', item.title, 'Current KYC Status:', kycStatus)
    setSelectedItem(item)
    setIsModalOpen(true)
    onLog('marketplace.itemSelected', { itemId: item.id, title: item.title, kycStatus })
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  const handleOrderPlaced = (item: MarketplaceItem) => {
    setPurchasedItems(prev => new Set([...prev, item.id]))
    onLog('marketplace.orderPlaced', { itemId: item.id, title: item.title })
  }

  const handleKYCStatusChange = (status: KYCStatus) => {
    console.log('KYC Status Changed:', status)
    setKycStatus(status)
    onLog('kyc.statusChanged', { status: status.status, inquiryId: status.inquiryId })
  }

  return (
    <div className="buyer-demo">
      <MarketplaceGrid 
        onItemClick={handleItemClick} 
        purchasedItems={purchasedItems}
      />
      
      <ListingDetailsModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onLog={onLog}
        onOrderPlaced={handleOrderPlaced}
        purchasedItems={purchasedItems}
        kycStatus={kycStatus}
        onKYCStatusChange={handleKYCStatusChange}
      />
    </div>
  )
}

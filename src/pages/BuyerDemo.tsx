import { useState } from 'react'
import MarketplaceGrid, { MarketplaceItem } from '../components/MarketplaceGrid'
import ListingDetailsModal from '../components/ListingDetailsModal'

interface BuyerDemoProps {
  onLog: (name: string, meta: unknown) => void
}

export default function BuyerDemo({ onLog }: BuyerDemoProps) {
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleItemClick = (item: MarketplaceItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
    onLog('marketplace.itemSelected', { itemId: item.id, title: item.title })
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  const handleOrderPlaced = (item: MarketplaceItem) => {
    onLog('marketplace.orderPlaced', { itemId: item.id, title: item.title })
  }

  return (
    <div className="buyer-demo">
      <MarketplaceGrid onItemClick={handleItemClick} />
      
      <ListingDetailsModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onLog={onLog}
        onOrderPlaced={handleOrderPlaced}
      />
    </div>
  )
}

import { useState } from 'react'
import MarketplaceGrid, { MarketplaceItem } from '../components/MarketplaceGrid'
import ListingDetailsModal from '../components/ListingDetailsModal'

interface BuyerDemoProps {
  onLog: (name: string, meta: unknown) => void
}

export default function BuyerDemo({ onLog }: BuyerDemoProps) {
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set())

  const handleItemClick = (item: MarketplaceItem) => {
    // Don't allow clicking on already purchased items
    if (purchasedItems.has(item.id)) {
      return
    }
    
    setSelectedItem(item)
    setIsModalOpen(true)
    onLog('marketplace.itemSelected', { itemId: item.id, title: item.title })
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  const handleOrderPlaced = (item: MarketplaceItem) => {
    setPurchasedItems(prev => new Set([...prev, item.id]))
    onLog('marketplace.orderPlaced', { itemId: item.id, title: item.title })
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
      />
    </div>
  )
}

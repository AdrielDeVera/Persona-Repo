export interface MarketplaceItem {
  id: string
  title: string
  description: string
  price: number
  image: string
  seller: string
  category: string
  condition: 'new' | 'like-new' | 'good' | 'fair'
  location: string
}

interface MarketplaceGridProps {
  onItemClick: (item: MarketplaceItem) => void
}

const mockItems: MarketplaceItem[] = [
  {
    id: '1',
    title: 'Vintage Leather Jacket',
    description: 'Classic brown leather jacket in excellent condition. Perfect for fall weather.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=200&fit=crop',
    seller: 'FashionForward',
    category: 'Clothing',
    condition: 'like-new',
    location: 'San Francisco, CA'
  },
  {
    id: '2',
    title: 'MacBook Pro 13" (2020)',
    description: 'M1 chip, 8GB RAM, 256GB SSD. Barely used, comes with original charger.',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop',
    seller: 'TechDeals',
    category: 'Electronics',
    condition: 'like-new',
    location: 'Austin, TX'
  },
  {
    id: '3',
    title: 'Handmade Ceramic Bowl Set',
    description: 'Set of 4 beautiful ceramic bowls, perfect for serving or decoration.',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    seller: 'ArtisanCrafts',
    category: 'Home & Garden',
    condition: 'new',
    location: 'Portland, OR'
  },
  {
    id: '4',
    title: 'Nike Air Max 270',
    description: 'Size 10, worn only a few times. Great condition, no scuffs or damage.',
    price: 75.00,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop',
    seller: 'SneakerHead',
    category: 'Shoes',
    condition: 'good',
    location: 'Miami, FL'
  },
  {
    id: '5',
    title: 'Vintage Camera Collection',
    description: 'Collection of 3 vintage film cameras from the 1970s. All functional.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop',
    seller: 'RetroGear',
    category: 'Electronics',
    condition: 'good',
    location: 'Brooklyn, NY'
  },
  {
    id: '6',
    title: 'Organic Cotton Throw Blanket',
    description: 'Soft, cozy throw blanket perfect for couch or bed. Machine washable.',
    price: 32.50,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
    seller: 'CozyHome',
    category: 'Home & Garden',
    condition: 'new',
    location: 'Seattle, WA'
  },
  {
    id: '7',
    title: 'Guitar Amplifier',
    description: 'Fender Blues Junior tube amp. Great sound, some cosmetic wear.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
    seller: 'MusicPro',
    category: 'Musical Instruments',
    condition: 'fair',
    location: 'Nashville, TN'
  },
  {
    id: '8',
    title: 'Designer Handbag',
    description: 'Authentic designer handbag, gently used. Comes with dust bag.',
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop',
    seller: 'LuxuryFinds',
    category: 'Accessories',
    condition: 'like-new',
    location: 'Los Angeles, CA'
  }
]

export default function MarketplaceGrid({ onItemClick }: MarketplaceGridProps) {
  return (
    <div className="marketplace-grid">
      <div className="marketplace-header">
        <h2>CraftyCart Marketplace</h2>
        <p>Discover unique items from verified sellers</p>
      </div>
      
      <div className="items-grid">
        {mockItems.map((item) => (
          <div key={item.id} className="item-card">
            <div className="item-image">
              <img src={item.image} alt={item.title} />
              <div className="item-condition">{item.condition}</div>
            </div>
            
            <div className="item-content">
              <h3 className="item-title">{item.title}</h3>
              <p className="item-description">{item.description}</p>
              
              <div className="item-details">
                <div className="item-price">${item.price.toFixed(2)}</div>
                <div className="item-seller">by {item.seller}</div>
                <div className="item-location">{item.location}</div>
              </div>
              
              <div className="item-actions">
                <button 
                  className="buy-button"
                  onClick={() => onItemClick(item)}
                >
                  Buy
                </button>
                <button className="message-button">
                  Message Seller
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

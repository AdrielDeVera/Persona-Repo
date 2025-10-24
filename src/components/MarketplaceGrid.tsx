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
  purchasedItems: Set<string>
}

const mockItems: MarketplaceItem[] = [
  {
    id: '1',
    title: 'Hand-Thrown Stoneware Mug',
    description: '12oz, satin glaze. Perfect for your morning coffee or evening tea.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    seller: 'Clay&Co',
    category: 'Ceramics',
    condition: 'new',
    location: 'Portland, OR'
  },
  {
    id: '2',
    title: 'Pressed-Flower Resin Coasters (Set of 4)',
    description: 'Wildflower mix preserved in crystal-clear resin. Each coaster is unique.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&h=200&fit=crop',
    seller: 'MeadowMade',
    category: 'Resin Art',
    condition: 'new',
    location: 'Boulder, CO'
  },
  {
    id: '3',
    title: 'Cedar & Citrus Soy Candle',
    description: '40 hr burn time. Hand-poured with natural soy wax and essential oils.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=200&fit=crop',
    seller: 'Hearthlight',
    category: 'Candles',
    condition: 'new',
    location: 'Asheville, NC'
  },
  {
    id: '4',
    title: 'Mini Watercolor Landscape',
    description: '5x7", cold-press paper. Original painting inspired by Pacific Northwest forests.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
    seller: 'Brush & Brook',
    category: 'Artwork',
    condition: 'new',
    location: 'Seattle, WA'
  },
  {
    id: '5',
    title: 'Hand-woven Cotton Tea Towel',
    description: 'Neutral stripe pattern. Soft, absorbent, and perfect for your kitchen.',
    price: 16.00,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=200&fit=crop',
    seller: 'Loomline',
    category: 'Textiles',
    condition: 'new',
    location: 'Madison, WI'
  },
  {
    id: '6',
    title: 'Block-Printed Tote Bag',
    description: 'Eco-friendly inks on organic cotton. Perfect for farmers markets and daily use.',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop',
    seller: 'Ink & Indigo',
    category: 'Accessories',
    condition: 'new',
    location: 'Austin, TX'
  },
  {
    id: '7',
    title: 'Hand-carved Wooden Spoon Set',
    description: 'Set of 3 spoons carved from sustainably sourced maple wood.',
    price: 42.00,
    image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=300&h=200&fit=crop',
    seller: 'WoodCraft Studio',
    category: 'Woodworking',
    condition: 'new',
    location: 'Burlington, VT'
  },
  {
    id: '8',
    title: 'Macrame Plant Hanger',
    description: 'Boho-style plant hanger with wooden beads. Perfect for trailing plants.',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=300&h=200&fit=crop',
    seller: 'Knot & Thread',
    category: 'Macrame',
    condition: 'new',
    location: 'Santa Fe, NM'
  }
]

export default function MarketplaceGrid({ onItemClick, purchasedItems }: MarketplaceGridProps) {
  return (
    <div className="marketplace-grid">
      <div className="marketplace-header">
        <h2>CraftyCart Marketplace</h2>
        <p>Discover handmade goods from verified artisans.</p>
      </div>
      
      <div className="items-grid">
        {mockItems.map((item) => {
          const isPurchased = purchasedItems.has(item.id)
          return (
            <div key={item.id} className={`item-card ${isPurchased ? 'purchased' : ''}`}>
              <div className="item-image">
                <img src={item.image} alt={item.title} />
                {isPurchased && (
                  <div className="purchased-overlay">
                    <div className="purchased-badge">✓ Purchased</div>
                  </div>
                )}
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
                    className={`buy-button ${isPurchased ? 'disabled' : ''}`}
                    onClick={() => onItemClick(item)}
                    disabled={isPurchased}
                  >
                    {isPurchased ? 'Purchased' : 'Buy'}
                  </button>
                  <button className="message-button" disabled>
                    Message Seller
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

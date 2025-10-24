import React, { useState, useEffect } from 'react'

interface ConfigPanelProps {}

export default function ConfigPanel({}: ConfigPanelProps) {
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox')
  const [buyerTemplateId, setBuyerTemplateId] = useState('')
  const [sellerTemplateId, setSellerTemplateId] = useState('')

  useEffect(() => {
    // Load from localStorage
    const savedEnv = localStorage.getItem('persona-environment') as 'sandbox' | 'production'
    const savedBuyerId = localStorage.getItem('persona-buyer-template-id')
    const savedSellerId = localStorage.getItem('persona-seller-template-id')

    if (savedEnv) setEnvironment(savedEnv)
    if (savedBuyerId) setBuyerTemplateId(savedBuyerId)
    if (savedSellerId) setSellerTemplateId(savedSellerId)
  }, [])

  const handleEnvironmentChange = (newEnv: 'sandbox' | 'production') => {
    setEnvironment(newEnv)
    localStorage.setItem('persona-environment', newEnv)
  }

  const handleBuyerTemplateChange = (value: string) => {
    setBuyerTemplateId(value)
    localStorage.setItem('persona-buyer-template-id', value)
  }

  const handleSellerTemplateChange = (value: string) => {
    setSellerTemplateId(value)
    localStorage.setItem('persona-seller-template-id', value)
  }

  return (
    <div className="config-panel">
      <h3>Configuration</h3>
      
      <div className="config-group">
        <label htmlFor="environment">Environment</label>
        <select 
          id="environment"
          value={environment} 
          onChange={(e) => handleEnvironmentChange(e.target.value as 'sandbox' | 'production')}
        >
          <option value="sandbox">Sandbox</option>
          <option value="production">Production</option>
        </select>
      </div>

      <div className="config-group">
        <label htmlFor="buyer-template">Buyer Template ID</label>
        <input
          id="buyer-template"
          type="text"
          value={buyerTemplateId}
          onChange={(e) => handleBuyerTemplateChange(e.target.value)}
          placeholder="itmpl_..."
        />
      </div>

      <div className="config-group">
        <label htmlFor="seller-template">Seller Template ID</label>
        <input
          id="seller-template"
          type="text"
          value={sellerTemplateId}
          onChange={(e) => handleSellerTemplateChange(e.target.value)}
          placeholder="itmpl_..."
        />
      </div>

      <div className="config-note">
        <h4>Important:</h4>
        <ul>
          <li>Allow-list your domain in Persona Dashboard</li>
          <li>Template IDs must start with "itmpl_"</li>
          <li>Changes are saved to localStorage</li>
        </ul>
      </div>
    </div>
  )
}

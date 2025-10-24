import React, { useState, useEffect } from 'react'
import { preloadPersona } from './lib/persona'
import BuyerDemo from './pages/BuyerDemo'
import SellerDemo from './pages/SellerDemo'
import Admin from './pages/Admin'
import ConfigPanel from './components/ConfigPanel'
import LogPanel from './components/LogPanel'
import './styles.css'

type Page = 'buyer' | 'seller' | 'admin'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('buyer')
  const [logs, setLogs] = useState<Array<{ id: string; timestamp: string; name: string; meta: unknown }>>([])

  useEffect(() => {
    preloadPersona()
  }, [])

  const addLog = (name: string, meta: unknown) => {
    const log = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      name,
      meta
    }
    setLogs(prev => [log, ...prev])
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'buyer':
        return <BuyerDemo onLog={addLog} />
      case 'seller':
        return <SellerDemo onLog={addLog} />
      case 'admin':
        return <Admin />
      default:
        return <BuyerDemo onLog={addLog} />
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>CraftyCart KYC Demo</h1>
        <nav className="nav-tabs">
          <button 
            className={currentPage === 'buyer' ? 'active' : ''} 
            onClick={() => setCurrentPage('buyer')}
          >
            Buyer Flow (Modal)
          </button>
          <button 
            className={currentPage === 'seller' ? 'active' : ''} 
            onClick={() => setCurrentPage('seller')}
          >
            Seller Flow (Inline)
          </button>
          <button 
            className={currentPage === 'admin' ? 'active' : ''} 
            onClick={() => setCurrentPage('admin')}
          >
            Admin
          </button>
        </nav>
      </header>

      <div className="app-content">
        <div className="main-content">
          {renderPage()}
        </div>
        
        {currentPage === 'admin' && (
          <div className="sidebar">
          </div>
        )}
      </div>
    </div>
  )
}

export default App

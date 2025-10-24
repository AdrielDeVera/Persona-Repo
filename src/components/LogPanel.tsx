import React, { useState } from 'react'

interface LogPanelProps {
  logs: Array<{
    id: string
    timestamp: string
    name: string
    meta: unknown
  }>
}

export default function LogPanel({ logs }: LogPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const formatMeta = (meta: unknown) => {
    if (meta === null || meta === undefined) return 'null'
    return JSON.stringify(meta, null, 2)
  }

  return (
    <div className="log-panel">
      <div className="log-header">
        <h3>Event Logs</h3>
        <button 
          className="toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <div className="log-content">
          {logs.length === 0 ? (
            <p className="no-logs">No events yet</p>
          ) : (
            <div className="log-list">
              {logs.map((log) => (
                <div key={log.id} className="log-entry">
                  <div className="log-header-entry">
                    <span className="log-name">{log.name}</span>
                    <span className="log-time">{formatTimestamp(log.timestamp)}</span>
                  </div>
                  <pre className="log-meta">{formatMeta(log.meta)}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Card from "../components/Card"
import Button from "../components/Button"
import "../styles/Alerts.css"

function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/alerts")
      const data = await res.json()
      setAlerts(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching alerts:", error)
      setLoading(false)
    }
  }

  const handleResolve = async (alertId) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/resolve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolvedBy: "Admin" }),
      })
      if (res.ok) {
        fetchAlerts()
      }
    } catch (error) {
      console.error("Error resolving alert:", error)
    }
  }

  const activeAlerts = alerts.filter((a) => !a.isResolved)

  return (
    <div className="alerts-page">
      <div className="page-header">
        <h1>Alerts & Notifications</h1>
        <span className="alert-count">{activeAlerts.length} Active</span>
      </div>

      <Card title="Active Alerts">
        <div className="alerts-container">
          {activeAlerts.length > 0 ? (
            activeAlerts.map((alert) => (
              <div key={alert._id} className={`alert-card alert-${alert.severity.toLowerCase()}`}>
                <div className="alert-header">
                  <h3>{alert.message}</h3>
                  <span className={`severity-badge severity-${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                </div>
                <div className="alert-footer">
                  <p className="alert-date">{new Date(alert.createdAt).toLocaleDateString()}</p>
                  <Button size="sm" variant="success" onClick={() => handleResolve(alert._id)}>
                    Resolve
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">No active alerts</p>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Alerts

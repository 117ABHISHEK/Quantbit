"use client"

import { useState, useEffect } from "react"
import Card from "../components/Card"
import "../styles/Dashboard.css"

function Dashboard() {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    healthyCount: 0,
    dueSoonCount: 0,
    overdueCount: 0,
    activeAlerts: 0,
    plannedMaintenance: 0,
    completedMaintenance: 0,
  })

  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [equipRes, alertRes, mainRes] = await Promise.all([
        fetch('/api/equipment'),
        fetch('/api/alerts/unresolved'),
        fetch('/api/maintenance/status/Planned'),
      ])

      const equipment = await equipRes.json()
      const alertsData = await alertRes.json()
      const maintenance = await mainRes.json()

      // compute counts based on maintenanceStatus returned by API
      let healthy = 0, dueSoon = 0, overdue = 0
      equipment.forEach(e => {
        const s = (e.maintenanceStatus || '').toLowerCase()
        if (s === 'ok') healthy += 1
        else if (s === 'due soon' || s === 'duesoon') dueSoon += 1
        else if (s === 'overdue') overdue += 1
      })

      setStats({
        totalEquipment: equipment.length,
        healthyCount: healthy,
        dueSoonCount: dueSoon,
        overdueCount: overdue,
        activeAlerts: alertsData.length,
        plannedMaintenance: maintenance.length,
        completedMaintenance: 0,
      })

      setAlerts(alertsData.slice(0, 5))
      setLoading(false)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setLoading(false)
    }
  }

  const StatCard = ({ label, value, trend }) => (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${trend ? `stat-${trend}` : ''}`}>{value}</div>
      {trend && <div className={`stat-trend trend-${trend}`}>{trend}</div>}
    </div>
  )

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Factory Maintenance Overview</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Healthy Machines" value={stats.healthyCount} trend="ok" />
        <StatCard label="Due Soon" value={stats.dueSoonCount} trend="duesoon" />
        <StatCard label="Overdue" value={stats.overdueCount} trend="overdue" />
        <StatCard label="Total Equipment" value={stats.totalEquipment} />
      </div>

      <div className="dashboard-content">
        <Card title="Recent Alerts" className="alerts-card">
          {alerts.length > 0 ? (
            <div className="alerts-list">
              {alerts.map((alert) => (
                <div key={alert._id} className="alert-item">
                  <div className={`alert-badge alert-${alert.severity.toLowerCase()}`}>{alert.severity}</div>
                  <div className="alert-content">
                    <p className="alert-message">{alert.message}</p>
                    <p className="alert-time">{new Date(alert.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No active alerts</p>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

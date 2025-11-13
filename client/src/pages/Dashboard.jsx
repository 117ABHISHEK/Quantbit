"use client"

import { useState, useEffect } from "react"
import Card from "../components/Card"
import "../styles/Dashboard.css"

function Dashboard() {
  const [stats, setStats] = useState({
    totalEquipment: 0,
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
        fetch("http://localhost:5000/api/equipment"),
        fetch("http://localhost:5000/api/alerts/unresolved"),
        fetch("http://localhost:5000/api/maintenance/status/Planned"),
      ])

      const equipment = await equipRes.json()
      const alertsData = await alertRes.json()
      const maintenance = await mainRes.json()

      setStats({
        totalEquipment: equipment.length,
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
      <div className="stat-value">{value}</div>
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
        <StatCard label="Total Equipment" value={stats.totalEquipment} trend="up" />
        <StatCard
          label="Active Alerts"
          value={stats.activeAlerts}
          trend={stats.activeAlerts > 3 ? "critical" : "normal"}
        />
        <StatCard label="Planned Maintenance" value={stats.plannedMaintenance} />
        <StatCard label="Completed This Month" value={stats.completedMaintenance} trend="up" />
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

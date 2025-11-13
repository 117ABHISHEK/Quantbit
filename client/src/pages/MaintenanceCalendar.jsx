"use client"

import { useState, useEffect } from "react"
import Card from "../components/Card"
import "../styles/MaintenanceCalendar.css"

function MaintenanceCalendar() {
  const [maintenance, setMaintenance] = useState([])
  const [equipment, setEquipment] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)) // Nov 2025
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    fetchMaintenance()
    fetchEquipment()
  }, [])

  const fetchMaintenance = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/maintenance")
      const data = await res.json()
      setMaintenance(data)
    } catch (error) {
      console.error("Error fetching maintenance:", error)
    }
  }

  const fetchEquipment = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/equipment")
      const data = await res.json()
      setEquipment(data)
    } catch (error) {
      console.error("Error fetching equipment:", error)
    }
  }

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const getMaintenanceForDate = (day) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return maintenance.filter((m) => {
      const mainDate = new Date(m.scheduledDate)
      return (
        mainDate.getDate() === day &&
        mainDate.getMonth() === targetDate.getMonth() &&
        mainDate.getFullYear() === targetDate.getFullYear() &&
        (!statusFilter || m.status === statusFilter)
      )
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const maintenanceItems = getMaintenanceForDate(day)
      const isOverdue =
        maintenanceItems.length > 0 &&
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < new Date()

      days.push(
        <div
          key={day}
          className={`calendar-day ${maintenanceItems.length > 0 ? "has-maintenance" : ""} ${isOverdue ? "overdue" : ""}`}
        >
          <div className="day-number">{day}</div>
          {maintenanceItems.length > 0 && (
            <div className="maintenance-indicators">
              {maintenanceItems.slice(0, 2).map((m, idx) => (
                <div key={idx} className={`indicator status-${m.status.toLowerCase()}`} title={m.equipmentId?.name}>
                  {m.equipmentId?.name.substring(0, 3)}
                </div>
              ))}
              {maintenanceItems.length > 2 && <div className="indicator more">+{maintenanceItems.length - 2}</div>}
            </div>
          )}
        </div>,
      )
    }

    return days
  }

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  const upcomingCount = maintenance.filter((m) => {
    const mDate = new Date(m.scheduledDate)
    return mDate >= new Date() && (!statusFilter || m.status === statusFilter)
  }).length

  const overdueCount = maintenance.filter((m) => {
    const mDate = new Date(m.scheduledDate)
    return mDate < new Date() && m.status !== "Completed" && (!statusFilter || m.status === statusFilter)
  }).length

  return (
    <div className="calendar-page">
      <div className="page-header">
        <h1>Maintenance Calendar Dashboard</h1>
      </div>

      <div className="calendar-stats">
        <Card className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Upcoming</div>
            <div className="stat-number">{upcomingCount}</div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Overdue</div>
            <div className="stat-number overdue">{overdueCount}</div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Total Events</div>
            <div className="stat-number">{maintenance.length}</div>
          </div>
        </Card>
      </div>

      <Card title="Calendar View">
        <div className="calendar-container">
          <div className="calendar-header">
            <button className="nav-btn" onClick={previousMonth}>
              ←
            </button>
            <h2 className="month-year">{monthName}</h2>
            <button className="nav-btn" onClick={nextMonth}>
              →
            </button>
          </div>

          <div className="filter-bar">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="status-filter">
              <option value="">All Status</option>
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-grid">{renderCalendar()}</div>
        </div>
      </Card>

      <Card title="Maintenance Events">
        <div className="events-list">
          {maintenance.length > 0 ? (
            maintenance
              .filter((m) => !statusFilter || m.status === statusFilter)
              .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
              .slice(0, 10)
              .map((item) => (
                <div
                  key={item._id}
                  className={`event-item ${new Date(item.scheduledDate) < new Date() && item.status !== "Completed" ? "overdue" : ""}`}
                >
                  <div className="event-date">{new Date(item.scheduledDate).toLocaleDateString()}</div>
                  <div className="event-info">
                    <div className="event-equipment">{item.equipmentId?.name}</div>
                    <div className="event-type">{item.type}</div>
                  </div>
                  <span className={`event-status badge-${item.status.toLowerCase()}`}>{item.status}</span>
                </div>
              ))
          ) : (
            <p className="empty-state">No maintenance events scheduled</p>
          )}
        </div>
      </Card>
    </div>
  )
}

export default MaintenanceCalendar

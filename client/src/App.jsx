"use client"

import { useState, useEffect } from "react"
import Dashboard from "./pages/Dashboard"
import Equipment from "./pages/Equipment"
import Maintenance from "./pages/Maintenance"
import MaintenanceCalendar from "./pages/MaintenanceCalendar"
import Alerts from "./pages/Alerts"
import Sidebar from "./components/Sidebar"
import "./App.css"

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [theme, setTheme] = useState("dark")
  // set initial page from URL path to support direct navigation
  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = window.location.pathname || '/'
    if (p === '/' || p === '/dashboard') return setCurrentPage('dashboard')
    if (p.startsWith('/equipment')) return setCurrentPage('equipment')
    if (p.startsWith('/maintenance')) return setCurrentPage('maintenance')
    if (p.startsWith('/alerts')) return setCurrentPage('alerts')
    // default
    setCurrentPage('dashboard')
  }, [])

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "equipment" && <Equipment />}
        {currentPage === "maintenance" && <Maintenance />}
        {currentPage === "calendar" && <MaintenanceCalendar />}
        {currentPage === "alerts" && <Alerts />}
        {/* Auth removed; keep SPA pages only */}
      </main>
    </div>
  )
}

export default App

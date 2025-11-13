"use client"

import { useState } from "react"
import Dashboard from "./pages/Dashboard"
import Equipment from "./pages/Equipment"
import Maintenance from "./pages/Maintenance"
import Alerts from "./pages/Alerts"
import MachineReadings from "./pages/MachineReadings"
import MaintenanceCalendar from "./pages/MaintenanceCalendar"
import Sidebar from "./components/Sidebar"
import "./App.css"

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [theme, setTheme] = useState("dark")

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "equipment" && <Equipment />}
        {currentPage === "maintenance" && <Maintenance />}
        {currentPage === "machine-readings" && <MachineReadings />}
        {currentPage === "maintenance-calendar" && <MaintenanceCalendar />}
        {currentPage === "alerts" && <Alerts />}
      </main>
    </div>
  )
}

export default App

"use client"
import "./Sidebar.css"

function Sidebar({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "equipment", label: "Equipment", icon: "⚙️" },
    { id: "maintenance", label: "Maintenance", icon: "🔧" },
    { id: "calendar", label: "Calendar", icon: "📅" },
    { id: "alerts", label: "Alerts", icon: "🚨" },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="app-title">Factory Maintenance</h1>
      </div>
      <nav className="nav-menu">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? "active" : ""}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar

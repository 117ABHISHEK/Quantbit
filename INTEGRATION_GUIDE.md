# Integration Guide - Adding Pages to Navigation

This guide shows how to add the new pages to your application's navigation/routing.

## 🗂️ File Locations

All new pages are located in:
- `client/src/pages/MachineReadings.jsx` - Machine readings logging
- `client/src/pages/MaintenanceCalendar.jsx` - Maintenance calendar dashboard

## 🔗 Adding Routes (React Router)

### Update `App.jsx` (or your main routing file)

```jsx
import MachineReadings from './pages/MachineReadings'
import MaintenanceCalendar from './pages/MaintenanceCalendar'
import Maintenance from './pages/Maintenance'
import Equipment from './pages/Equipment'
import Alerts from './pages/Alerts'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/maintenance-calendar" element={<MaintenanceCalendar />} />
        <Route path="/machine-readings" element={<MachineReadings />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
    </BrowserRouter>
  )
}
```

## 🧭 Updating Sidebar Navigation

### Example: `client/src/components/Sidebar.jsx`

```jsx
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <div className="nav-section">
          <h3>Dashboard</h3>
          <Link to="/" className="nav-link">📊 Dashboard</Link>
        </div>

        <div className="nav-section">
          <h3>Equipment</h3>
          <Link to="/equipment" className="nav-link">🏭 Equipment</Link>
        </div>

        <div className="nav-section">
          <h3>Maintenance</h3>
          <Link to="/maintenance" className="nav-link">🔧 Maintenance Schedule</Link>
          <Link to="/maintenance-calendar" className="nav-link">📅 Calendar View</Link>
          <Link to="/machine-readings" className="nav-link">📊 Machine Readings</Link>
        </div>

        <div className="nav-section">
          <h3>Alerts</h3>
          <Link to="/alerts" className="nav-link">🚨 Alerts</Link>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
```

## 🎯 Quick Reference Table

| Feature | Page | Route | Component |
|---------|------|-------|-----------|
| Log Daily Readings | Machine Readings | `/machine-readings` | `MachineReadings.jsx` |
| View Calendar | Maintenance Calendar | `/maintenance-calendar` | `MaintenanceCalendar.jsx` |
| Schedule Maintenance | Maintenance | `/maintenance` | `Maintenance.jsx` (updated) |
| Equipment Management | Equipment | `/equipment` | `Equipment.jsx` |
| View Alerts | Alerts | `/alerts` | `Alerts.jsx` (enhanced) |
| Dashboard | Dashboard | `/` | `Dashboard.jsx` |

## 🎨 Sidebar Styling (Optional)

If you want to style the nav sections:

```css
.sidebar {
  width: 250px;
  background-color: var(--secondary);
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-section h3 {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 12px;
  padding-left: 12px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: var(--primary);
  color: var(--text-light);
}

.nav-link.active {
  background-color: var(--primary);
  color: var(--text-light);
  font-weight: 600;
}
```

## 📱 Mobile Responsive Navigation

```jsx
function Sidebar({ isOpen, setIsOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="sidebar-close" onClick={() => setIsOpen(false)}>
        ✕
      </button>
      
      <nav>
        {/* Nav items as above */}
      </nav>
    </aside>
  )
}
```

## 🔄 Active Link Indicator

### Using React Router's `useLocation`

```jsx
import { Link, useLocation } from 'react-router-dom'

function NavLink({ to, children }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`nav-link ${isActive ? 'active' : ''}`}
    >
      {children}
    </Link>
  )
}

// Usage:
<NavLink to="/machine-readings">📊 Machine Readings</NavLink>
```

## 🎯 Breadcrumb Navigation (Optional)

Add breadcrumbs to show navigation path:

```jsx
function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  const breadcrumbMap = {
    'machine-readings': 'Machine Readings',
    'maintenance-calendar': 'Maintenance Calendar',
    'maintenance': 'Maintenance',
    'equipment': 'Equipment',
    'alerts': 'Alerts'
  }

  return (
    <div className="breadcrumb">
      <Link to="/">Home</Link>
      {pathnames.map((name, index) => (
        <span key={index}>
          <span>/</span>
          <span>{breadcrumbMap[name] || name}</span>
        </span>
      ))}
    </div>
  )
}
```

## 🎨 Breadcrumb Styling

```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

.breadcrumb a {
  color: var(--primary);
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb span {
  color: var(--text-secondary);
}
```

## 📋 Complete App.jsx Example

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Equipment from './pages/Equipment'
import Maintenance from './pages/Maintenance'
import MaintenanceCalendar from './pages/MaintenanceCalendar'
import MachineReadings from './pages/MachineReadings'
import Alerts from './pages/Alerts'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/maintenance-calendar" element={<MaintenanceCalendar />} />
            <Route path="/machine-readings" element={<MachineReadings />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
```

## 🎯 Main Content Layout CSS

```css
.app {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background-color: var(--background);
}

.page-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}
```

## ✅ Checklist

- [ ] Routes added to App.jsx
- [ ] Sidebar updated with new links
- [ ] Icons added (optional but recommended)
- [ ] Active link styling applied
- [ ] Mobile navigation considered
- [ ] All pages are accessible
- [ ] Navigation breadcrumbs working (optional)

## 🎨 Icon Suggestions (Emoji)

```
Dashboard       → 📊
Equipment       → 🏭
Maintenance     → 🔧
Calendar        → 📅
Machine Readings → 📈
Alerts          → 🚨
```

---

**Implementation Note**: These new pages are standalone and work independently. They integrate seamlessly with existing pages through the API.

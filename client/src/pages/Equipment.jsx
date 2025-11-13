"use client"

import { useState, useEffect } from "react"
import Card from "../components/Card"
import Button from "../components/Button"
import "../styles/Equipment.css"

function Equipment() {
  const [equipment, setEquipment] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    category: "Motor",
    serialNumber: "",
    location: "",
    manufacturer: "",
    criticality: "Medium",
    status: "Active",
    maintenanceIntervalDays: 30,
  })

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/equipment")
      const data = await res.json()
      setEquipment(data)
    } catch (error) {
      console.error("Error fetching equipment:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    
    try {
      const res = await fetch("http://localhost:5000/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      
      if (res.ok) {
        const newEquipment = await res.json()
        setSuccess(`✅ Equipment "${formData.name}" created successfully!`)
        fetchEquipment()
        setShowForm(false)
        setFormData({
          name: "",
          category: "Motor",
          serialNumber: "",
          location: "",
          manufacturer: "",
          criticality: "Medium",
          status: "Active",
          maintenanceIntervalDays: 30,
        })
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const errorData = await res.json()
        setError(`❌ Error: ${errorData.message || "Failed to create equipment"}`)
      }
    } catch (error) {
      console.error("Error creating equipment:", error)
      setError(`❌ Connection error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await fetch(`http://localhost:5000/api/equipment/${id}`, {
          method: "DELETE",
        })
        fetchEquipment()
      } catch (error) {
        console.error("Error deleting equipment:", error)
      }
    }
  }

  return (
    <div className="equipment-page">
      <div className="page-header">
        <h1>Equipment Management</h1>
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? "Cancel" : "Add Equipment"}
        </Button>
      </div>

      {showForm && (
        <Card title="Add New Equipment">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <form onSubmit={handleSubmit} className="equipment-form">
            <div className="form-group">
              <label>Equipment Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., CNC Milling Machine"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>Motor</option>
                  <option>Pump</option>
                  <option>Conveyor</option>
                  <option>Press</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Serial Number *</label>
                <input
                  type="text"
                  required
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="e.g., SN-12345"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Building A, Floor 2"
                />
              </div>
              <div className="form-group">
                <label>Manufacturer</label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="e.g., Siemens"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Maintenance Interval (Days)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.maintenanceIntervalDays}
                  onChange={(e) => setFormData({ ...formData, maintenanceIntervalDays: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Criticality</label>
                <select
                  value={formData.criticality}
                  onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <Button type="submit" variant="success" disabled={loading}>
                {loading ? "Creating..." : "Create Equipment"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Equipment List">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <div className="equipment-table">
          <div className="table-header">
            <div className="col-name">Name</div>
            <div className="col-category">Category</div>
            <div className="col-serial">Serial</div>
            <div className="col-location">Location</div>
            <div className="col-next-due">Next Due</div>
            <div className="col-status">Status</div>
            <div className="col-criticality">Priority</div>
            <div className="col-actions">Actions</div>
          </div>
          {equipment.length === 0 ? (
            <div className="empty-state">No equipment added yet. Click "Add Equipment" to get started.</div>
          ) : (
            equipment.map((item) => {
              const nextDue = item.nextMaintenanceDue ? new Date(item.nextMaintenanceDue) : null
              const today = new Date()
              const isOverdue = nextDue && nextDue < today
              
              return (
                <div key={item._id} className={`table-row ${isOverdue ? "overdue" : ""}`}>
                  <div className="col-name">{item.name}</div>
                  <div className="col-category">{item.category}</div>
                  <div className="col-serial">{item.serialNumber}</div>
                  <div className="col-location">{item.location || "-"}</div>
                  <div className="col-next-due">
                    {nextDue ? (
                      <span className={isOverdue ? "overdue-badge" : ""}>
                        {isOverdue ? "🔴 " : ""}
                        {nextDue.toLocaleDateString()}
                      </span>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div className={`col-status status-${item.status.toLowerCase()}`}>{item.status}</div>
                  <div className={`col-criticality critical-${item.criticality.toLowerCase()}`}>{item.criticality}</div>
                  <div className="col-actions action-buttons">
                    <Button size="sm" variant="primary">
                      📈 Read
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleDelete(item._id)}>
                      🗑️
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Card>
    </div>
  )
}

export default Equipment

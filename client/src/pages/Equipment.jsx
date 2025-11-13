"use client"

import { useState, useEffect } from "react"
import Card from "../components/Card"
import Button from "../components/Button"
import "../styles/Equipment.css"

function Equipment() {
  const [equipment, setEquipment] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    category: "Motor",
    serialNumber: "",
    location: "",
    manufacturer: "",
    criticality: "Medium",
    status: "Active",
  })

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      const res = await fetch("/api/equipment")
      const data = await res.json()
      setEquipment(data)
    } catch (error) {
      console.error("Error fetching equipment:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        await fetchEquipment()
        setShowForm(false)
        setFormData({
          name: "",
          category: "Motor",
          serialNumber: "",
          location: "",
          manufacturer: "",
          criticality: "Medium",
          status: "Active",
        })
      } else {
        const err = await res.json().catch(() => ({}))
        setFormError(err.message || err.error || 'Failed to create equipment')
      }
    } catch (error) {
      console.error("Error creating equipment:", error)
      setFormError(error.message || 'Network error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await fetch(`/api/equipment/${id}`, {
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
          <form onSubmit={handleSubmit} className="equipment-form">
            <div className="form-group">
              <label>Equipment Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <label>Serial Number</label>
                <input
                  type="text"
                  required
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
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
              <Button type="submit" variant="success" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Equipment'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
            {formError && <div className="form-error" style={{ color: 'var(--danger)', marginTop: 8 }}>{formError}</div>}
          </form>
        </Card>
      )}

      <Card title="Equipment List">
        <div className="equipment-table">
          <div className="table-header">
            <div className="col-name">Name</div>
            <div className="col-category">Category</div>
            <div className="col-serial">Serial Number</div>
            <div className="col-status">Status</div>
            <div className="col-criticality">Criticality</div>
            <div className="col-actions">Actions</div>
          </div>
          {equipment.map((item) => (
            <div key={item._id} className="table-row">
              <div className="col-name">{item.name}</div>
              <div className="col-category">{item.category}</div>
              <div className="col-serial">{item.serialNumber}</div>
              <div className={`col-status status-${item.status.toLowerCase()}`}>{item.status}</div>
              <div className={`col-criticality critical-${item.criticality.toLowerCase()}`}>{item.criticality}</div>
              <div className="col-actions">
                <Button size="sm" variant="danger" onClick={() => handleDelete(item._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Equipment

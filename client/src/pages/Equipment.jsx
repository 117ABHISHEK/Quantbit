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
  const [showLog, setShowLog] = useState(false)
  const [selectedForLog, setSelectedForLog] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "Motor",
    serialNumber: "",
    location: "",
    manufacturer: "",
    criticality: "Medium",
    status: "Active",
  })
  const [editingId, setEditingId] = useState(null)

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
    // client-side max length validation
    if (formData.name.length > 50) return setFormError('Equipment name must be 50 characters or fewer')
    if (formData.serialNumber.length > 30) return setFormError('Serial number must be 30 characters or fewer')
    if (formData.location.length > 100) return setFormError('Location must be 100 characters or fewer')
    setIsSubmitting(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/equipment/${editingId}` : '/api/equipment'
      const res = await fetch(url, {
        method,
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
        setEditingId(null)
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
                maxLength={50}
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
                  maxLength={30}
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
                  maxLength={100}
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
            <div className="col-next">Next Maintenance</div>
            <div className="col-criticality">Criticality</div>
            <div className="col-actions">Actions</div>
          </div>
          {equipment.map((item) => (
            <div key={item._id} className="table-row">
              <div className="col-name">{item.name}</div>
              <div className="col-category">{item.category}</div>
              <div className="col-serial">{item.serialNumber}</div>
              <div className="col-status">
                <span className={`status-badge status-${(item.maintenanceStatus||'unknown').toLowerCase().replace(/\s+/g,'')}`}>
                  {item.maintenanceStatus || item.status}
                </span>
              </div>
              <div className="col-next">{item.nextMaintenanceDue ? new Date(item.nextMaintenanceDue).toLocaleDateString() : '—'}</div>
              <div className={`col-criticality critical-${item.criticality?.toLowerCase()}`}>{item.criticality}</div>
              <div className="col-actions">
                <Button size="sm" variant="primary" onClick={() => { setSelectedForLog(item); setShowLog(true) }}>
                  Log Reading
                </Button>
                <Button size="sm" variant="secondary" onClick={() => {
                  // open form in edit mode
                  setEditingId(item._id)
                  setFormData({
                    name: item.name || '',
                    category: item.category || 'Motor',
                    serialNumber: item.serialNumber || '',
                    location: item.location || '',
                    manufacturer: item.manufacturer || '',
                    criticality: item.criticality || 'Medium',
                    status: item.status || 'Active',
                  })
                  setShowForm(true)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(item._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Log Reading Modal */}
      {showLog && selectedForLog && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Log Reading — {selectedForLog.name}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault()
              const form = e.target
              const payload = {
                equipmentId: selectedForLog._id,
                operatingHours: Number(form.operatingHours.value) || 0,
                temperature: Number(form.temperature.value) || undefined,
                pressure: Number(form.pressure.value) || undefined,
                vibration: Number(form.vibration.value) || undefined,
                status: form.status.value,
                notes: form.notes.value,
              }
              try {
                const res = await fetch('/api/machine-readings', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                })
                if (res.ok) {
                  setShowLog(false)
                  setSelectedForLog(null)
                  fetchEquipment()
                } else {
                  const err = await res.json().catch(() => ({}))
                  alert(err.message || 'Failed to save reading')
                }
              } catch (err) {
                console.error(err)
                alert('Network error')
              }
            }}>
              <div className="form-row">
                <div className="form-group"><label>Operating Hours</label><input name="operatingHours" type="number" defaultValue={selectedForLog.operatingHours||0} required /></div>
                <div className="form-group"><label>Temperature</label><input name="temperature" type="number" step="0.1" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Pressure</label><input name="pressure" type="number" step="0.1" /></div>
                <div className="form-group"><label>Vibration</label><input name="vibration" type="number" step="0.1" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Status</label>
                  <select name="status" defaultValue="Normal"><option>Normal</option><option>Warning</option><option>Critical</option></select>
                </div>
              </div>
              <div className="form-group"><label>Notes</label><textarea name="notes" /></div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button type="button" variant="secondary" onClick={() => { setShowLog(false); setSelectedForLog(null) }}>Cancel</Button>
                <Button type="submit" variant="primary">Save Reading</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Equipment

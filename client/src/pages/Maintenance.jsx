"use client"

import { useState, useEffect } from "react"
import Card from "../components/Card"
import Button from "../components/Button"
import "../styles/Maintenance.css"

function Maintenance() {
  const [maintenance, setMaintenance] = useState([])
  const [equipment, setEquipment] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    equipmentId: "",
    type: "Preventive",
    status: "Planned",
    scheduledDate: "",
    technician: "",
    description: "",
    estimatedHours: 0,
    partsUsed: [],
  })

  const [partRow, setPartRow] = useState({ partName: '', quantity: 1, cost: '' })

  useEffect(() => {
    fetchMaintenance()
    fetchEquipment()
  }, [])

  const fetchMaintenance = async () => {
    try {
        const res = await fetch("/api/maintenance")
      const data = await res.json()
      setMaintenance(data)
    } catch (error) {
      console.error("Error fetching maintenance:", error)
    }
  }

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
    try {
        const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        fetchMaintenance()
        setShowForm(false)
        setFormData({
          equipmentId: "",
          type: "Preventive",
          status: "Planned",
          scheduledDate: "",
          technician: "",
          description: "",
          estimatedHours: 0,
        })
      }
    } catch (error) {
      console.error("Error creating maintenance:", error)
    }
  }

  return (
    <div className="maintenance-page">
      <div className="page-header">
        <h1>Maintenance Management</h1>
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? "Cancel" : "Schedule Maintenance"}
        </Button>
      </div>

      {showForm && (
        <Card title="Schedule New Maintenance">
          <form onSubmit={handleSubmit} className="maintenance-form">
            <div className="form-group">
              <label>Equipment</label>
              <select
                required
                value={formData.equipmentId}
                onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
              >
                <option value="">Select Equipment</option>
                {equipment.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <option>Preventive</option>
                  <option>Corrective</option>
                  <option>Inspection</option>
                </select>
              </div>
              <div className="form-group">
                <label>Scheduled Date</label>
                <input
                  type="date"
                  required
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions">
              <Button type="submit" variant="success">
                Schedule
              </Button>
            </div>
            <div style={{ marginTop: 12 }}>
              <h4>Parts Used (optional)</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Part Name</label>
                  <input value={partRow.partName} onChange={(e) => setPartRow({...partRow, partName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" value={partRow.quantity} min={1} onChange={(e) => setPartRow({...partRow, quantity: Number(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label>Cost</label>
                  <input type="number" step="0.01" value={partRow.cost} onChange={(e) => setPartRow({...partRow, cost: e.target.value})} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button type="button" variant="primary" onClick={() => {
                    if (!partRow.partName) return alert('Enter part name')
                    setFormData({...formData, partsUsed: [...(formData.partsUsed||[]), {...partRow, replacedDate: new Date().toISOString()}]})
                    setPartRow({ partName: '', quantity: 1, cost: '' })
                  }}>Add Part</Button>
                </div>
              </div>
              {formData.partsUsed && formData.partsUsed.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <strong>Parts to submit:</strong>
                  <ul>
                    {formData.partsUsed.map((p, idx) => (
                      <li key={idx}>{p.partName} x{p.quantity} {p.cost ? `@ $${p.cost}` : ''} <button type="button" onClick={() => {
                        const next = formData.partsUsed.slice(); next.splice(idx,1); setFormData({...formData, partsUsed: next})
                      }}>Remove</button></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </form>
        </Card>
      )}

      <Card title="Maintenance Schedule">
        <div className="maintenance-list">
          {maintenance.map((item) => (
            <div key={item._id} className="maintenance-item">
              <div className="item-header">
                <h3>{item.equipmentId?.name}</h3>
                <span className={`badge-status badge-${item.status.toLowerCase()}`}>{item.status}</span>
              </div>
              <div className="item-details">
                <p>Type: {item.type}</p>
                <p>Scheduled: {new Date(item.scheduledDate).toLocaleDateString()}</p>
                {item.partsUsed && item.partsUsed.length > 0 && (
                  <div>
                    <strong>Parts Replaced:</strong>
                    <ul>
                      {item.partsUsed.map((p, i) => (
                        <li key={i}>{p.partName} x{p.quantity} {p.cost ? `@ $${p.cost}` : ''} ({p.replacedDate ? new Date(p.replacedDate).toLocaleDateString() : '-'})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Maintenance

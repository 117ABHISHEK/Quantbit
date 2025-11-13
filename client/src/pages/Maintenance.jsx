"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "../styles/Maintenance.css"

function Maintenance() {
  const [maintenance, setMaintenance] = useState([])
  const [equipment, setEquipment] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [partsInput, setPartsInput] = useState({ partName: "", quantity: 1, cost: 0 })
  const [formData, setFormData] = useState({
    equipmentId: "",
    type: "Preventive",
    status: "Planned",
    scheduledDate: null,
    completionDate: null,
    technician: "",
    description: "",
    estimatedHours: 0,
    actualHours: 0,
    cost: 0,
    partsUsed: [],
  })

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

  const addPart = () => {
    if (partsInput.partName) {
      setFormData({
        ...formData,
        partsUsed: [...formData.partsUsed, { ...partsInput }],
      })
      setPartsInput({ partName: "", quantity: 1, cost: 0 })
    }
  }

  const removePart = (index) => {
    setFormData({
      ...formData,
      partsUsed: formData.partsUsed.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        scheduledDate: formData.scheduledDate ? formData.scheduledDate.toISOString() : null,
        completionDate: formData.completionDate ? formData.completionDate.toISOString() : null,
      }
      const res = await fetch("http://localhost:5000/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        fetchMaintenance()
        setShowForm(false)
        setFormData({
          equipmentId: "",
          type: "Preventive",
          status: "Planned",
          scheduledDate: null,
          completionDate: null,
          technician: "",
          description: "",
          estimatedHours: 0,
          actualHours: 0,
          cost: 0,
          partsUsed: [],
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
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
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
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option>Planned</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Scheduled Date</label>
                  <DatePicker
                    selected={formData.scheduledDate}
                    onChange={(date) => setFormData({ ...formData, scheduledDate: date })}
                    required
                    dateFormat="yyyy-MM-dd"
                    className="react-datepicker-input"
                    placeholderText="Select date"
                  />
                </div>
                <div className="form-group">
                  <label>Completion Date</label>
                  <DatePicker
                    selected={formData.completionDate}
                    onChange={(date) => setFormData({ ...formData, completionDate: date })}
                    dateFormat="yyyy-MM-dd"
                    className="react-datepicker-input"
                    placeholderText="Select date"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Technician</label>
                  <input
                    type="text"
                    value={formData.technician}
                    onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Estimated Hours</label>
                  <input
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Cost ($)</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                />
              </div>

              <div className="parts-section">
                <h3>Spare Parts Used</h3>
                <div className="parts-input-group">
                  <input
                    type="text"
                    placeholder="Part Name"
                    value={partsInput.partName}
                    onChange={(e) => setPartsInput({ ...partsInput, partName: e.target.value })}
                    className="parts-input"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    min="1"
                    value={partsInput.quantity}
                    onChange={(e) => setPartsInput({ ...partsInput, quantity: parseInt(e.target.value) })}
                    className="parts-input-small"
                  />
                  <input
                    type="number"
                    placeholder="Cost ($)"
                    value={partsInput.cost}
                    onChange={(e) => setPartsInput({ ...partsInput, cost: parseFloat(e.target.value) })}
                    className="parts-input-small"
                  />
                  <Button type="button" variant="secondary" onClick={addPart} size="sm">
                    Add
                  </Button>
                </div>

                {formData.partsUsed.length > 0 && (
                  <div className="parts-list">
                    {formData.partsUsed.map((part, idx) => (
                      <div key={idx} className="part-item">
                        <span className="part-name">{part.partName}</span>
                        <span className="part-qty">Qty: {part.quantity}</span>
                        <span className="part-cost">${part.cost}</span>
                        <button type="button" onClick={() => removePart(idx)} className="part-remove">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <Button type="submit" variant="success">
                  Schedule
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Schedule</CardTitle>
        </CardHeader>
        <CardContent>
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
                  {item.completionDate && <p>Completed: {new Date(item.completionDate).toLocaleDateString()}</p>}
                  {item.technician && <p>Technician: {item.technician}</p>}
                  {item.partsUsed && item.partsUsed.length > 0 && (
                    <div className="parts-used">
                      <p>Parts Used:</p>
                      <ul>
                        {item.partsUsed.map((part, idx) => (
                          <li key={idx}>
                            {part.partName} (Qty: {part.quantity}, Cost: ${part.cost})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="item-actions">
                  <a
                    href={`http://localhost:5000/api/reports/${item._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="report-link"
                  >
                    📄 PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Maintenance
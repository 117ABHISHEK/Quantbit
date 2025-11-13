"use client"

import { useState, useEffect } from "react"
import Card from "../components/Card"
import Button from "../components/Button"
import "../styles/MachineReadings.css"

function MachineReadings() {
  const [readings, setReadings] = useState([])
  const [equipment, setEquipment] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState("")
  const [formData, setFormData] = useState({
    equipmentId: "",
    operatingHours: 0,
    temperature: 0,
    pressure: 0,
    vibration: 0,
    status: "Normal",
    notes: "",
  })

  useEffect(() => {
    fetchReadings()
    fetchEquipment()
  }, [])

  const fetchReadings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/machine-readings")
      const data = await res.json()
      setReadings(data.readings || [])
    } catch (error) {
      console.error("Error fetching readings:", error)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:5000/api/machine-readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        fetchReadings()
        setShowForm(false)
        setFormData({
          equipmentId: "",
          operatingHours: 0,
          temperature: 0,
          pressure: 0,
          vibration: 0,
          status: "Normal",
          notes: "",
        })
      }
    } catch (error) {
      console.error("Error creating reading:", error)
    }
  }

  const filterReadings = selectedEquipment
    ? readings.filter((r) => r.equipmentId._id === selectedEquipment)
    : readings

  return (
    <div className="readings-page">
      <div className="page-header">
        <h1>Machine Readings Log</h1>
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? "Cancel" : "Log Reading"}
        </Button>
      </div>

      {showForm && (
        <Card title="Log Daily Machine Reading">
          <form onSubmit={handleSubmit} className="readings-form">
            <div className="form-group">
              <label>Equipment *</label>
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
                <label>Operating Hours *</label>
                <input
                  type="number"
                  required
                  value={formData.operatingHours}
                  onChange={(e) => setFormData({ ...formData, operatingHours: parseFloat(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option>Normal</option>
                  <option>Warning</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Temperature (°C)</label>
                <input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Pressure (PSI)</label>
                <input
                  type="number"
                  value={formData.pressure}
                  onChange={(e) => setFormData({ ...formData, pressure: parseFloat(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Vibration (mm/s)</label>
                <input
                  type="number"
                  value={formData.vibration}
                  onChange={(e) => setFormData({ ...formData, vibration: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <Button type="submit" variant="success">
                Save Reading
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Readings History">
        <div className="filter-section">
          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="filter-select"
          >
            <option value="">All Equipment</option>
            {equipment.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="readings-list">
          {filterReadings.length > 0 ? (
            <table className="readings-table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Date</th>
                  <th>Hours</th>
                  <th>Temp (°C)</th>
                  <th>Pressure (PSI)</th>
                  <th>Vibration (mm/s)</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {filterReadings.map((reading) => (
                  <tr key={reading._id}>
                    <td>{reading.equipmentId.name}</td>
                    <td>{new Date(reading.readingDate).toLocaleDateString()}</td>
                    <td>{reading.operatingHours}</td>
                    <td>{reading.temperature || "—"}</td>
                    <td>{reading.pressure || "—"}</td>
                    <td>{reading.vibration || "—"}</td>
                    <td>
                      <span className={`status-badge status-${reading.status.toLowerCase()}`}>
                        {reading.status}
                      </span>
                    </td>
                    <td>{reading.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-state">No readings recorded</p>
          )}
        </div>
      </Card>
    </div>
  )
}

export default MachineReadings

"use client"

import { useEffect, useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import '../styles/Dashboard.css'

export default function Reports(){
  const [equipment, setEquipment] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [selectedEquipment, setSelectedEquipment] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    fetch('/api/equipment').then(r=>r.json()).then(setEquipment).catch(console.error)
  },[])

  const generate = async () => {
    setLoading(true)
    try{
      const params = new URLSearchParams()
      if (from) params.append('from', from)
      if (to) params.append('to', to)
      if (selectedEquipment) params.append('equipmentId', selectedEquipment)

      const url = `/api/reports/pdf?${params.toString()}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to generate report')
      const blob = await res.blob()
      const link = document.createElement('a')
      const filename = `maintenance-report-${new Date().toISOString().slice(0,10)}.pdf`
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
    }catch(err){
      console.error(err)
      alert(err.message || 'Failed to generate report')
    }finally{ setLoading(false) }
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports</h1>
      </div>
      <Card title="Generate Maintenance Report">
        <div style={{display:'grid',gap:12}}>
          <div>
            <label>From</label>
            <input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
          </div>
          <div>
            <label>To</label>
            <input type="date" value={to} onChange={e=>setTo(e.target.value)} />
          </div>
          <div>
            <label>Equipment (optional)</label>
            <select value={selectedEquipment} onChange={e=>setSelectedEquipment(e.target.value)}>
              <option value="">All Equipment</option>
              {equipment.map(eq=> <option key={eq._id} value={eq._id}>{eq.name}</option>)}
            </select>
          </div>
          <div style={{display:'flex',gap:8}}>
            <Button onClick={generate} variant="primary" disabled={loading}>{loading ? 'Generating...' : 'Generate PDF'}</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

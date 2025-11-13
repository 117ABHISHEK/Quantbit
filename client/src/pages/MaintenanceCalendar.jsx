"use client"

import { useEffect, useState } from 'react'
import Card from '../components/Card'
import '../styles/Maintenance.css'

export default function MaintenanceCalendar(){
  const [eventsByDate, setEventsByDate] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetch('/api/maintenance').then(r=>r.json()).then(data=>{
      const grouped = {}
      data.forEach(m => {
        const d = new Date(m.scheduledDate).toISOString().slice(0,10)
        if (!grouped[d]) grouped[d]=[]
        grouped[d].push(m)
      })
      setEventsByDate(grouped)
      setLoading(false)
    }).catch(err=>{ console.error(err); setLoading(false) })
  },[])

  const dates = Object.keys(eventsByDate).sort()

  return (
    <div className="maintenance-calendar">
      <div className="page-header">
        <h1>Maintenance Calendar</h1>
      </div>
      <div style={{display:'flex',gap:16}}>
        <div style={{flex:1}}>
          <Card title="Upcoming Dates">
            {loading ? <p>Loading...</p> : (
              dates.length ? (
                <ul>
                  {dates.map(d => (
                    <li key={d} style={{marginBottom:12}}>
                      <strong>{new Date(d).toLocaleDateString()}</strong>
                      <ul>
                        {eventsByDate[d].map(ev => (
                          <li key={ev._id}>{ev.type} — {ev.equipmentId?.name || 'Unknown'} — {ev.status}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : <p>No scheduled maintenance</p>
            )}
          </Card>
        </div>
        <div style={{width:360}}>
          <Card title="Legend">
            <p><strong>Planned</strong> — Scheduled work</p>
            <p><strong>In Progress</strong> — Currently being worked on</p>
            <p><strong>Completed</strong> — Finished maintenance</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

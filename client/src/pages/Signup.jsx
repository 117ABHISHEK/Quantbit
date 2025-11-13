"use client"

import { useState } from "react"
import Card from "../components/Card"
import Button from "../components/Button"

export default function Signup({ onSignup }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("Technician")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const submit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, phone, location })
      })
      const data = await res.json()
      if (!res.ok) setError(data.message || 'Registration failed')
      else {
        setSuccess('Account created — redirecting...')
        // if parent passed a redirect handler, call it to go to dashboard
        if (onSignup) onSignup()
      }
    } catch (err) {
      console.error(err)
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '24px auto' }}>
      <Card title="Create Account">
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Phone (optional)</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option>Technician</option>
                <option>Manager</option>
                <option>Admin</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Factory Location / Department (optional)</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</Button>
          </div>
          {error && <div style={{ color: 'var(--danger)', marginTop: 8 }}>{error}</div>}
          {success && <div style={{ color: 'var(--success)', marginTop: 8 }}>{success}</div>}
        </form>
      </Card>
    </div>
  )
}

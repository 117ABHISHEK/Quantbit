"use client"

import { useState } from "react"
import Card from "../components/Card"
import Button from "../components/Button"

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // If already logged in, redirect to dashboard
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user')
    if (stored) {
      if (onLogin) onLogin()
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Login failed')
      } else {
        if (onLogin) onLogin(data)
        // naive: store in localStorage for now
        localStorage.setItem('user', JSON.stringify(data))
        window.location.reload()
      }
    } catch (err) {
      console.error(err)
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 540, margin: '24px auto' }}>
      <Card title="Login">
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
          </div>
          {error && <div style={{ color: 'var(--danger)', marginTop: 8 }}>{error}</div>}
        </form>
      </Card>
    </div>
  )
}

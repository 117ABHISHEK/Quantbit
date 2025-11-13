const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

// Routes
const path = require("path")
const fs = require("fs")
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
connectDB()

// Routes
// route mounting handled safely below
function safeRequireRoute(routePath, mountPath) {
  const fullPath = path.join(__dirname, routePath)
  if (fs.existsSync(fullPath + ".js") || fs.existsSync(fullPath)) {
    try {
      const r = require(fullPath)
      app.use(mountPath, r)
      console.log(`Mounted route ${mountPath} -> ${routePath}`)
    } catch (err) {
      console.error(`Error loading route ${routePath}:`, err)
      // mount a basic stub so the server doesn't crash
      const stub = express.Router()
      stub.use((req, res) => res.status(500).json({ error: "Route failed to load" }))
      app.use(mountPath, stub)
    }
  } else {
    console.warn(`Route file not found: ${routePath} — mounting stub at ${mountPath}`)
    const stub = express.Router()
    stub.use((req, res) => res.status(404).json({ error: "Not implemented" }))
    app.use(mountPath, stub)
  }
}
safeRequireRoute("./routes/equipment", "/api/equipment")
safeRequireRoute("./routes/maintenance", "/api/maintenance")
safeRequireRoute("./routes/alerts", "/api/alerts")
safeRequireRoute("./routes/machineReadings", "/api/machine-readings")
safeRequireRoute("./routes/reports", "/api/reports")

// Serve client static files and SPA fallback
const clientDist = path.join(__dirname, '..', 'client')
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get('*', (req, res, next) => {
    // skip API routes
    if (req.path.startsWith('/api')) return next()
    const index = path.join(clientDist, 'index.html')
    if (fs.existsSync(index)) return res.sendFile(index)
    return res.status(404).send('Not Found')
  })
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

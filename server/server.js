const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

// Routes
const equipmentRoutes = require("./routes/equipment")
const maintenanceRoutes = require("./routes/maintenance")
const alertRoutes = require("./routes/alerts")
const machineReadingsRoutes = require("./routes/machineReadings")
const reportRoutes = require("./routes/reports")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
connectDB()

// Routes
app.use("/api/equipment", equipmentRoutes)
app.use("/api/maintenance", maintenanceRoutes)
app.use("/api/alerts", alertRoutes)
app.use("/api/machine-readings", machineReadingsRoutes)
app.use("/api/reports", reportRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

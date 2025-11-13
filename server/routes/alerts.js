const express = require("express")
const Alert = require("../models/Alert")
const Equipment = require("../models/Equipment")

const router = express.Router()

// Helper: Check and create overdue alerts
const checkAndCreateOverdueAlerts = async () => {
  try {
    const now = new Date()
    const equipmentList = await Equipment.find({ status: "Active" })
    
    for (const equipment of equipmentList) {
      if (equipment.nextMaintenanceDue && equipment.nextMaintenanceDue < now) {
        // Check if an overdue alert already exists
        const existingAlert = await Alert.findOne({
          equipmentId: equipment._id,
          type: "Maintenance Due",
          isResolved: false,
        })
        
        if (!existingAlert) {
          const daysOverdue = Math.floor((now - equipment.nextMaintenanceDue) / (1000 * 60 * 60 * 24))
          const severity = daysOverdue > 14 ? "Critical" : daysOverdue > 7 ? "High" : "Medium"
          
          const alert = new Alert({
            equipmentId: equipment._id,
            type: "Maintenance Due",
            severity,
            message: `${equipment.name} is overdue for maintenance (${daysOverdue} days overdue)`,
          })
          await alert.save()
        }
      }
    }
  } catch (error) {
    console.error("Error checking overdue maintenance:", error)
  }
}

// GET all alerts
router.get("/", async (req, res) => {
  try {
    // Check for overdue alerts first
    await checkAndCreateOverdueAlerts()
    const alerts = await Alert.find().populate("equipmentId")
    res.json(alerts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET unresolved alerts
router.get("/unresolved", async (req, res) => {
  try {
    // Check for overdue alerts first
    await checkAndCreateOverdueAlerts()
    const alerts = await Alert.find({ isResolved: false }).populate("equipmentId")
    res.json(alerts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET overdue equipment only
router.get("/overdue/equipment", async (req, res) => {
  try {
    const now = new Date()
    const overdueEquipment = await Equipment.find({
      status: "Active",
      nextMaintenanceDue: { $lt: now },
    })
    res.json(overdueEquipment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST create alert
router.post("/", async (req, res) => {
  const alert = new Alert(req.body)
  try {
    const savedAlert = await alert.save()
    res.status(201).json(savedAlert)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// PUT resolve alert
router.put("/:id/resolve", async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isResolved: true, resolvedDate: new Date(), resolvedBy: req.body.resolvedBy },
      { new: true },
    )
    res.json(alert)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router

const express = require("express")
const MachineReading = require("../models/MachineReading")
const Alert = require("../models/Alert")

const router = express.Router()

// GET all readings for an equipment
router.get("/equipment/:equipmentId", async (req, res) => {
  try {
    const readings = await MachineReading.find({ equipmentId: req.params.equipmentId })
      .sort({ readingDate: -1 })
      .limit(50)
    res.json(readings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET latest reading for an equipment
router.get("/equipment/:equipmentId/latest", async (req, res) => {
  try {
    const reading = await MachineReading.findOne({ equipmentId: req.params.equipmentId })
      .sort({ readingDate: -1 })
    res.json(reading)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST create reading
router.post("/", async (req, res) => {
  const reading = new MachineReading(req.body)
  try {
    const savedReading = await reading.save()
    
    // Auto-create alert if status is Warning or Critical
    if (savedReading.status !== "Normal") {
      const alert = new Alert({
        equipmentId: savedReading.equipmentId,
        type: "Anomaly",
        severity: savedReading.status === "Critical" ? "Critical" : "Medium",
        message: `Machine reading anomaly detected: ${savedReading.status}`,
      })
      await alert.save()
    }
    
    res.status(201).json(savedReading)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// GET all readings with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit
    
    const readings = await MachineReading.find()
      .populate("equipmentId")
      .sort({ readingDate: -1 })
      .skip(skip)
      .limit(limit)
    
    const total = await MachineReading.countDocuments()
    res.json({ readings, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router

const express = require("express")
const MachineReading = require("../models/MachineReading")

const router = express.Router()

// GET all readings (optionally filter by equipmentId)
router.get("/", async (req, res) => {
  try {
    const { equipmentId } = req.query
    const query = {}
    if (equipmentId) query.equipmentId = equipmentId
    const readings = await MachineReading.find(query).sort({ readingDate: -1 })
    res.json(readings)
  } catch (error) {
    console.error("Error fetching readings:", error)
    res.status(500).json({ message: "Failed to fetch readings" })
  }
})

// GET single reading
router.get("/:id", async (req, res) => {
  try {
    const reading = await MachineReading.findById(req.params.id)
    if (!reading) return res.status(404).json({ message: "Reading not found" })
    res.json(reading)
  } catch (error) {
    console.error("Error fetching reading:", error)
    res.status(500).json({ message: "Failed to fetch reading" })
  }
})

// POST create a reading
router.post("/", async (req, res) => {
  try {
    const payload = req.body
    const reading = new MachineReading(payload)
    const saved = await reading.save()
    res.status(201).json(saved)
  } catch (error) {
    console.error("Error creating reading:", error)
    res.status(400).json({ message: error.message || "Invalid reading data" })
  }
})

module.exports = router

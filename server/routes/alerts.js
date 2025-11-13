const express = require("express")
const Alert = require("../models/Alert")

const router = express.Router()

// GET all alerts
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find().populate("equipmentId")
    res.json(alerts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET unresolved alerts
router.get("/unresolved", async (req, res) => {
  try {
    const alerts = await Alert.find({ isResolved: false }).populate("equipmentId")
    res.json(alerts)
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

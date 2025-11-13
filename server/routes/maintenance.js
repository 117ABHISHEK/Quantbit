const express = require("express")
const Maintenance = require("../models/Maintenance")
const Equipment = require("../models/Equipment")

const router = express.Router()

// GET all maintenance records
router.get("/", async (req, res) => {
  try {
    const maintenance = await Maintenance.find().populate("equipmentId")
    res.json(maintenance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET maintenance by status
router.get("/status/:status", async (req, res) => {
  try {
    const maintenance = await Maintenance.find({ status: req.params.status }).populate("equipmentId")
    res.json(maintenance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST create maintenance record
router.post("/", async (req, res) => {
  const maintenance = new Maintenance(req.body)
  try {
    const savedMaintenance = await maintenance.save()
    res.status(201).json(savedMaintenance)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// PUT update maintenance
router.put("/:id", async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(maintenance)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE maintenance
router.delete("/:id", async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id)
    res.json({ message: "Maintenance record deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router

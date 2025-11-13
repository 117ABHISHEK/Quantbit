const express = require("express")
const Equipment = require("../models/Equipment")

const router = express.Router()

// GET all equipment
router.get("/", async (req, res) => {
  try {
    const equipment = await Equipment.find()
    res.json(equipment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET single equipment
router.get("/:id", async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
    if (!equipment) return res.status(404).json({ message: "Equipment not found" })
    res.json(equipment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST create equipment
router.post("/", async (req, res) => {
  const equipment = new Equipment(req.body)
  try {
    const savedEquipment = await equipment.save()
    res.status(201).json(savedEquipment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// PUT update equipment
router.put("/:id", async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(equipment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE equipment
router.delete("/:id", async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id)
    res.json({ message: "Equipment deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router

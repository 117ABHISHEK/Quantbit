const express = require("express")
const Equipment = require("../models/Equipment")

const router = express.Router()

const { differenceInDays, parseISO, isValid } = require('date-fns')

// Helper to compute maintenance status
function computeStatus(eq) {
  const now = new Date()
  let next = eq.nextMaintenanceDue ? new Date(eq.nextMaintenanceDue) : null
  if (!next && eq.lastMaintenanceDate) {
    next = new Date(eq.lastMaintenanceDate)
    next.setDate(next.getDate() + (eq.maintenanceIntervalDays || 30))
  }
  if (!next && eq.installationDate) {
    next = new Date(eq.installationDate)
    next.setDate(next.getDate() + (eq.maintenanceIntervalDays || 30))
  }

  if (!next) return { status: 'Unknown', daysUntil: null }

  const daysUntil = Math.ceil((next - now) / (1000 * 60 * 60 * 24))
  if (daysUntil < 0) return { status: 'Overdue', daysUntil }
  if (daysUntil <= 7) return { status: 'Due Soon', daysUntil }
  return { status: 'OK', daysUntil }
}

// GET all equipment (with computed maintenance status)
router.get('/', async (req, res) => {
  try {
    const equipment = await Equipment.find().lean()
    const mapped = equipment.map(eq => {
      const { status, daysUntil } = computeStatus(eq)
      return {
        ...eq,
        maintenanceStatus: status,
        daysUntilNextMaintenance: daysUntil,
        nextMaintenanceDue: eq.nextMaintenanceDue || null,
      }
    })
    res.json(mapped)
  } catch (error) {
    console.error('Error fetching equipment:', error)
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
  try {
    const payload = { ...req.body }
    // coerce maintenanceIntervalDays
    payload.maintenanceIntervalDays = Number(payload.maintenanceIntervalDays) || 30

    // compute nextMaintenanceDue if possible
    let next = null
    if (payload.lastMaintenanceDate) {
      next = new Date(payload.lastMaintenanceDate)
      next.setDate(next.getDate() + payload.maintenanceIntervalDays)
    } else if (payload.installationDate) {
      next = new Date(payload.installationDate)
      next.setDate(next.getDate() + payload.maintenanceIntervalDays)
    } else {
      next = new Date()
      next.setDate(next.getDate() + payload.maintenanceIntervalDays)
    }
    payload.nextMaintenanceDue = next

    const equipment = new Equipment(payload)
    const savedEquipment = await equipment.save()
    res.status(201).json(savedEquipment)
  } catch (error) {
    console.error('Error creating equipment:', error)
    if (error && error.code === 11000) {
      // duplicate key (e.g., serialNumber unique constraint)
      return res.status(409).json({ message: 'Duplicate value: serial number must be unique' })
    }
    res.status(400).json({ message: error.message })
  }
})

// PUT update equipment
router.put("/:id", async (req, res) => {
  try {
    const payload = { ...req.body }
    if (payload.maintenanceIntervalDays) payload.maintenanceIntervalDays = Number(payload.maintenanceIntervalDays)

    // if lastMaintenanceDate or maintenanceIntervalDays changed, recompute nextMaintenanceDue
    const eqBefore = await Equipment.findById(req.params.id)
    if (!eqBefore) return res.status(404).json({ message: 'Equipment not found' })

    let next = eqBefore.nextMaintenanceDue ? new Date(eqBefore.nextMaintenanceDue) : null
    const interval = payload.maintenanceIntervalDays || eqBefore.maintenanceIntervalDays || 30

    if (payload.lastMaintenanceDate) {
      next = new Date(payload.lastMaintenanceDate)
      next.setDate(next.getDate() + interval)
      payload.nextMaintenanceDue = next
    } else if (payload.installationDate && !eqBefore.lastMaintenanceDate) {
      next = new Date(payload.installationDate)
      next.setDate(next.getDate() + interval)
      payload.nextMaintenanceDue = next
    }

    const equipment = await Equipment.findByIdAndUpdate(req.params.id, payload, { new: true })
    res.json(equipment)
  } catch (error) {
    console.error('Error updating equipment:', error)
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

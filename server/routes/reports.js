const express = require("express")
const PDFDocument = require("pdfkit")
const Maintenance = require("../models/Maintenance")
const Equipment = require("../models/Equipment")

const router = express.Router()

// Generate PDF report for a maintenance record
router.get("/:maintenanceId", async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.maintenanceId).populate("equipmentId")

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance record not found" })
    }

    const doc = new PDFDocument({ bufferPages: true, margin: 40 })
    const filename = `maintenance-report-${maintenance._id}.pdf`

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)

    doc.pipe(res)

    // Header
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("Maintenance Report", { align: "center" })

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: "center" })

    doc.moveDown()

    // Equipment Section
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Equipment Information")

    doc
      .fontSize(11)
      .font("Helvetica")
      .text(`Name: ${maintenance.equipmentId.name}`)
      .text(`Category: ${maintenance.equipmentId.category}`)
      .text(`Serial Number: ${maintenance.equipmentId.serialNumber}`)
      .text(`Location: ${maintenance.equipmentId.location || "N/A"}`)

    doc.moveDown()

    // Maintenance Details
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Maintenance Details")

    doc
      .fontSize(11)
      .font("Helvetica")
      .text(`Type: ${maintenance.type}`)
      .text(`Status: ${maintenance.status}`)
      .text(`Scheduled Date: ${new Date(maintenance.scheduledDate).toLocaleDateString()}`)

    if (maintenance.completionDate) {
      doc.text(`Completion Date: ${new Date(maintenance.completionDate).toLocaleDateString()}`)
    }

    doc
      .text(`Technician: ${maintenance.technician || "N/A"}`)
      .text(`Description: ${maintenance.description || "N/A"}`)
      .text(`Estimated Hours: ${maintenance.estimatedHours || "N/A"}`)

    if (maintenance.actualHours) {
      doc.text(`Actual Hours: ${maintenance.actualHours}`)
    }

    if (maintenance.cost) {
      doc.text(`Cost: $${maintenance.cost}`)
    }

    // Spare Parts Section
    if (maintenance.partsUsed && maintenance.partsUsed.length > 0) {
      doc.moveDown()

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Spare Parts Used")

      doc.fontSize(11).font("Helvetica")

      const tableTop = doc.y + 10
      const col1 = 50
      const col2 = 250
      const col3 = 350
      const col4 = 450

      // Table header
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Part Name", col1, tableTop)
        .text("Quantity", col2, tableTop)
        .text("Cost", col3, tableTop)
        .text("Date", col4, tableTop)

      doc.moveTo(col1, tableTop + 15).lineTo(500, tableTop + 15).stroke()

      let yPos = tableTop + 25

      // Table rows
      maintenance.partsUsed.forEach((part) => {
        doc
          .fontSize(10)
          .font("Helvetica")
          .text(part.partName, col1, yPos)
          .text(part.quantity.toString(), col2, yPos)
          .text(`$${part.cost}`, col3, yPos)
          .text(new Date(part.replacedDate).toLocaleDateString(), col4, yPos)

        yPos += 20
      })
    }

    // Notes
    if (maintenance.notes) {
      doc.moveDown()

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Notes")

      doc
        .fontSize(11)
        .font("Helvetica")
        .text(maintenance.notes)
    }

    // Footer
    doc.moveDown()
    doc
      .fontSize(9)
      .font("Helvetica")
      .text("---", { align: "center" })
      .text("This is an automatically generated maintenance report.", { align: "center" })

    doc.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Generate summary report for all maintenance
router.get("/summary/all", async (req, res) => {
  try {
    const maintenance = await Maintenance.find().populate("equipmentId")
    const equipment = await Equipment.find()

    const doc = new PDFDocument({ bufferPages: true, margin: 40 })
    const filename = `maintenance-summary-${new Date().getTime()}.pdf`

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)

    doc.pipe(res)

    // Header
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("Maintenance Summary Report", { align: "center" })

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: "center" })

    doc.moveDown()

    // Statistics
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Statistics")

    const completedCount = maintenance.filter((m) => m.status === "Completed").length
    const plannedCount = maintenance.filter((m) => m.status === "Planned").length
    const inProgressCount = maintenance.filter((m) => m.status === "In Progress").length

    doc
      .fontSize(11)
      .font("Helvetica")
      .text(`Total Maintenance Records: ${maintenance.length}`)
      .text(`Completed: ${completedCount}`)
      .text(`Planned: ${plannedCount}`)
      .text(`In Progress: ${inProgressCount}`)

    const totalCost = maintenance.reduce((sum, m) => sum + (m.cost || 0), 0)
    doc.text(`Total Cost: $${totalCost.toFixed(2)}`)

    doc.moveDown()

    // Equipment Status
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Equipment Status")

    doc.fontSize(11).font("Helvetica")

    equipment.forEach((eq) => {
      const eqMaintenance = maintenance.filter((m) => m.equipmentId._id.toString() === eq._id.toString())
      const lastMaintenance = eqMaintenance.length > 0 ? eqMaintenance[eqMaintenance.length - 1] : null

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text(eq.name)

      doc
        .fontSize(9)
        .font("Helvetica")
        .text(
          `Status: ${eq.status} | Operating Hours: ${eq.operatingHours} | Next Maintenance: ${eq.nextMaintenanceDue ? new Date(eq.nextMaintenanceDue).toLocaleDateString() : "N/A"}`,
        )
        .text(
          `Last Maintenance: ${lastMaintenance ? new Date(lastMaintenance.scheduledDate).toLocaleDateString() : "Never"}`,
        )

      doc.moveDown(0.5)
    })

    // Footer
    doc.moveDown()
    doc
      .fontSize(9)
      .font("Helvetica")
      .text("---", { align: "center" })
      .text("This is an automatically generated maintenance summary report.", { align: "center" })

    doc.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router

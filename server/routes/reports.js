const express = require("express")
const PDFDocument = require("pdfkit")
const Equipment = require("../models/Equipment")
const Maintenance = require("../models/Maintenance")
const MachineReading = require("../models/MachineReading")
const { format, parseISO } = require("date-fns")

const router = express.Router()

// GET /pdf - generate maintenance report PDF
router.get("/pdf", async (req, res) => {
  try {
    // support optional date range query: ?from=YYYY-MM-DD&to=YYYY-MM-DD
    const { from, to } = req.query
    const fromDate = from ? new Date(from) : null
    const toDate = to ? new Date(to) : null

    const equipments = await Equipment.find().lean()
    // fetch maintenance in range if provided
    const maintQuery = {}
    if (fromDate || toDate) {
      maintQuery.scheduledDate = {}
      if (fromDate) maintQuery.scheduledDate.$gte = fromDate
      if (toDate) maintQuery.scheduledDate.$lte = toDate
    }
    const maints = await Maintenance.find(maintQuery).lean()
    const readings = await MachineReading.find( fromDate || toDate ? { readingDate: { ...(fromDate ? { $gte: fromDate } : {}), ...(toDate ? { $lte: toDate } : {}) } } : {} ).lean()

    const doc = new PDFDocument({ size: 'LETTER', margins: { top: 50, bottom: 50, left: 50, right: 50 } })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=maintenance-report.pdf')

    doc.pipe(res)

    doc.fontSize(20).font('Helvetica-Bold').text('Factory Maintenance Report', { align: 'center' })
    doc.moveDown()
    doc.fontSize(10).font('Helvetica').text(`Generated: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}`, { align: 'center' })
    doc.moveDown(2)

    doc.fontSize(14).font('Helvetica-Bold').text('Equipment Summary')
    doc.moveDown()

    const tableTop = doc.y
    const colWidths = { name: 150, category: 100, nextMaintenance: 120, status: 80 }

    doc.fontSize(10).font('Helvetica-Bold')
    let xPos = 50
    doc.text('Name', xPos, tableTop, { width: colWidths.name, continued: false })
    xPos += colWidths.name
    doc.text('Category', xPos, tableTop, { width: colWidths.category, continued: false })
    xPos += colWidths.category
    doc.text('Next Maintenance', xPos, tableTop, { width: colWidths.nextMaintenance, continued: false })
    xPos += colWidths.nextMaintenance
    doc.text('Status', xPos, tableTop, { width: colWidths.status, continued: false })

    doc.moveDown()
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown(0.5)

    doc.font('Helvetica')

    for (const eq of equipments) {
      const yPos = doc.y
      if (yPos > 700) doc.addPage()

      xPos = 50
      doc.text(eq.name || '-', xPos, yPos, { width: colWidths.name })
      xPos += colWidths.name
      doc.text(eq.category || '-', xPos, yPos, { width: colWidths.category })
      xPos += colWidths.category

      const nextMaint = eq.nextMaintenanceDue ? format(new Date(eq.nextMaintenanceDue), 'MMM dd, yyyy') : (eq.nextMaintenance ? format(new Date(eq.nextMaintenance), 'MMM dd, yyyy') : 'Not scheduled')
      doc.text(nextMaint, xPos, yPos, { width: colWidths.nextMaintenance })
      xPos += colWidths.nextMaintenance
      doc.text(eq.status || '-', xPos, yPos, { width: colWidths.status })

      doc.moveDown(0.8)
    }

    doc.moveDown(2)
    doc.fontSize(12).font('Helvetica-Bold').text('Maintenance History (latest)')
    doc.moveDown(0.5)
    doc.fontSize(10).font('Helvetica')
    const recent = maints.slice().sort((a,b) => new Date(b.scheduledDate) - new Date(a.scheduledDate)).slice(0, 200)
    for (const m of recent) {
      const yPos = doc.y
      if (yPos > 700) doc.addPage()
      const equipmentName = (equipments.find(e => e._id.toString() === (m.equipmentId && m.equipmentId.toString ? m.equipmentId.toString() : m.equipmentId)) || {}).name || 'Unknown'
      doc.font('Helvetica-Bold').text(`${m.scheduledDate ? format(new Date(m.scheduledDate), 'MMM dd, yyyy') : '-'} — ${equipmentName}`, { continued: false })
      doc.font('Helvetica').text(`
Type: ${m.type} — Status: ${m.status}
Technician: ${m.technician || '-'}
Description: ${m.description || '-'}
`) 
      if (Array.isArray(m.partsUsed) && m.partsUsed.length) {
        doc.text('Parts Used:', { underline: true })
        m.partsUsed.forEach(p => {
          doc.text(` - ${p.partName} x${p.quantity || 1} @ ${p.cost ? '$' + p.cost : 'N/A'} (${p.replacedDate ? format(new Date(p.replacedDate), 'MMM dd, yyyy') : '-'})`)
        })
      }
      doc.moveDown(0.4)
    }

    doc.addPage()
    doc.fontSize(12).font('Helvetica-Bold').text('Machine Readings (latest)')
    doc.moveDown(0.5)
    doc.fontSize(10).font('Helvetica')
    const recentReadings = readings.slice().sort((a,b) => new Date(b.readingDate) - new Date(a.readingDate)).slice(0, 200)
    for (const r of recentReadings) {
      const yPos = doc.y
      if (yPos > 700) doc.addPage()
      const equipmentName = (equipments.find(e => e._id.toString() === (r.equipmentId && r.equipmentId.toString ? r.equipmentId.toString() : r.equipmentId)) || {}).name || 'Unknown'
      doc.text(`${r.readingDate ? format(new Date(r.readingDate), 'MMM dd, yyyy HH:mm') : '-'} — ${equipmentName}`)
      doc.text(`  Hours: ${r.operatingHours || '-'} — Temp: ${r.temperature ?? '-'} — Pressure: ${r.pressure ?? '-'} — Vibration: ${r.vibration ?? '-'}`)
      doc.moveDown(0.2)
    }

    doc.end()
  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(500).json({ error: 'Failed to generate PDF report' })
  }
})

module.exports = router

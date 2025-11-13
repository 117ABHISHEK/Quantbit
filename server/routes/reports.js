const express = require("express")
const PDFDocument = require("pdfkit")
const Equipment = require("../models/Equipment")
const Maintenance = require("../models/Maintenance")
const { format, parseISO } = require("date-fns")

const router = express.Router()

// GET /pdf - generate maintenance report PDF
router.get("/pdf", async (req, res) => {
  try {
    const equipments = await Equipment.find().lean()
    const maints = await Maintenance.find().lean()

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

      const nextMaint = eq.nextMaintenance ? format(new Date(eq.nextMaintenance), 'MMM dd, yyyy') : 'Not scheduled'
      doc.text(nextMaint, xPos, yPos, { width: colWidths.nextMaintenance })
      xPos += colWidths.nextMaintenance
      doc.text(eq.status || '-', xPos, yPos, { width: colWidths.status })

      doc.moveDown(0.8)
    }

    doc.moveDown(2)
    doc.fontSize(12).font('Helvetica-Bold').text('Maintenance History (latest)')
    doc.moveDown(0.5)
    doc.fontSize(10).font('Helvetica')

    const recent = maints.slice().sort((a,b) => new Date(b.scheduledDate) - new Date(a.scheduledDate)).slice(0, 50)
    for (const m of recent) {
      const yPos = doc.y
      if (yPos > 700) doc.addPage()
      doc.text(`${m.scheduledDate ? format(new Date(m.scheduledDate), 'MMM dd, yyyy') : '-'} — ${m.type} — ${m.description || ''}`)
      doc.moveDown(0.4)
    }

    doc.end()
  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(500).json({ error: 'Failed to generate PDF report' })
  }
})

module.exports = router

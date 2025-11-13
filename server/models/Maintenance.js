const mongoose = require("mongoose")

const maintenanceSchema = new mongoose.Schema(
  {
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment", required: true },
    type: { type: String, enum: ["Preventive", "Corrective", "Inspection"], required: true },
    status: { type: String, enum: ["Planned", "In Progress", "Completed", "Cancelled"], default: "Planned" },
    scheduledDate: { type: Date, required: true },
    completionDate: Date,
    technician: String,
    description: String,
    estimatedHours: Number,
    actualHours: Number,
    cost: Number,
    notes: String,
    partsUsed: [
      {
        partName: String,
        quantity: Number,
        cost: Number,
        replacedDate: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
)

// Post-save hook to update equipment's nextMaintenanceDue
maintenanceSchema.post("save", async function (doc) {
  if (doc.status === "Completed" && doc.completionDate) {
    try {
      const Equipment = mongoose.model("Equipment")
      const equipment = await Equipment.findById(doc.equipmentId)
      if (equipment) {
        equipment.lastMaintenanceDate = doc.completionDate
        // Calculate next due date based on interval
        const nextDue = new Date(doc.completionDate)
        nextDue.setDate(nextDue.getDate() + (equipment.maintenanceIntervalDays || 30))
        equipment.nextMaintenanceDue = nextDue
        await equipment.save()
      }
    } catch (error) {
      console.error("Error updating equipment nextMaintenanceDue:", error)
    }
  }
})

module.exports = mongoose.model("Maintenance", maintenanceSchema)

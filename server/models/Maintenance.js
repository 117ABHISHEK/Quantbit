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
      },
    ],
  },
  { timestamps: true },
)

module.exports = mongoose.model("Maintenance", maintenanceSchema)

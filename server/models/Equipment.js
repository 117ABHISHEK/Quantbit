const mongoose = require("mongoose")

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, enum: ["Motor", "Pump", "Conveyor", "Press", "Other"] },
    serialNumber: { type: String, unique: true, required: true },
    location: String,
    manufacturer: String,
    installationDate: Date,
    status: { type: String, enum: ["Active", "Inactive", "Maintenance", "Broken"], default: "Active" },
    operatingHours: { type: Number, default: 0 },
    criticality: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    notes: String,
    maintenanceIntervalDays: { type: Number, default: 30 },
    lastMaintenanceDate: Date,
    nextMaintenanceDue: Date,
  },
  { timestamps: true },
)

module.exports = mongoose.model("Equipment", equipmentSchema)

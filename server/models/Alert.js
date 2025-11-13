const mongoose = require("mongoose")

const alertSchema = new mongoose.Schema(
  {
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment", required: true },
    type: { type: String, enum: ["Maintenance Due", "High Hours", "Anomaly", "Manual"], required: true },
    severity: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    message: { type: String, required: true },
    isResolved: { type: Boolean, default: false },
    resolvedDate: Date,
    resolvedBy: String,
  },
  { timestamps: true },
)

module.exports = mongoose.model("Alert", alertSchema)

const mongoose = require("mongoose")

const machineReadingSchema = new mongoose.Schema(
  {
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment", required: true },
    readingDate: { type: Date, default: Date.now },
    operatingHours: { type: Number, required: true },
    temperature: Number,
    pressure: Number,
    vibration: Number,
    status: { type: String, enum: ["Normal", "Warning", "Critical"], default: "Normal" },
    notes: String,
  },
  { timestamps: true },
)

// Post-save hook to update equipment's operatingHours
machineReadingSchema.post("save", async function (doc) {
  try {
    const Equipment = mongoose.model("Equipment")
    const equipment = await Equipment.findById(doc.equipmentId)
    if (equipment) {
      equipment.operatingHours = doc.operatingHours
      await equipment.save()
    }
  } catch (error) {
    console.error("Error updating equipment operatingHours:", error)
  }
})

module.exports = mongoose.model("MachineReading", machineReadingSchema)

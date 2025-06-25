import mongoose from "mongoose";

const maintenanceLogSchema = new mongoose.Schema({
  machine_id: { type: mongoose.Schema.Types.ObjectId, ref: "Machine" },
  maintenance_type: { type: String, required: true },
  cost: Number,
  downtime_hours: Number,
  remarks: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MaintenanceLog", maintenanceLogSchema);

import mongoose from "mongoose";

const machineSchema = new mongoose.Schema({
  machine_name: { type: String, required: true },
  model: String,
  capacity: Number,
  maintenance_date: Date,
  operator_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Machine", machineSchema);

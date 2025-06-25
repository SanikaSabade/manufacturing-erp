import mongoose from "mongoose";

const qualityCheckSchema = new mongoose.Schema({
  work_order_id: { type: mongoose.Schema.Types.ObjectId, ref: "WorkOrder" },
  inspected_by: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  qc_result: { type: String, required: true },
  remarks: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("QualityCheck", qualityCheckSchema);

import mongoose from "mongoose";

const auditTrailSchema = new mongoose.Schema({
  module: { type: String, required: true },
  action_type: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("AuditTrail", auditTrailSchema);

import mongoose from "mongoose";

const workOrderSchema = new mongoose.Schema({
  machine_id: { type: mongoose.Schema.Types.ObjectId, ref: "Machine", required: true },
  shift: { 
    type: String, 
    required: true,
    enum: ["Morning", "Evening", "Night"] 
  },
  planned_start_date: { type: Date, required: true },
  planned_end_date: { type: Date, required: true },
  actual_start_date: { type: Date },
  actual_end_date: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("WorkOrder", workOrderSchema);

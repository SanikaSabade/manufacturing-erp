import mongoose from "mongoose";

const workOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
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

workOrderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("WorkOrder").countDocuments();
    this.orderNumber = `WO-${String(count + 1).padStart(3, "3")}`;
  }
  next();
});

export default mongoose.model("WorkOrder", workOrderSchema);

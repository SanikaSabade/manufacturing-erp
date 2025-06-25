import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  orderDate: Date,
  status: { type: String, enum: ["Ordered", "Received", "Cancelled"] },
  items: [
    {
      material: { type: mongoose.Schema.Types.ObjectId, ref: "Material" },
      quantity: Number,
      cost: Number,
    },
  ],
  delivery_date: Date,
  payment_status: {
    type: String,
    enum: ["Pending", "Paid", "Overdue"],
    default: "Pending",
  },
  total_amount: { type: Number, required: true },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Urgent"],
    default: "Medium",
  },
  linked_documents: [{ type: String }], 
  expected_delivery: Date,
  approval_status: {
    type: String,
    enum: ["Draft", "Pending", "Approved", "Rejected"],
    default: "Draft",
  },
  last_updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PurchaseOrder", purchaseOrderSchema);

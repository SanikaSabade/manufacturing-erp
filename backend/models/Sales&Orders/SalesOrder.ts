import mongoose from "mongoose";

const salesOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
  },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  date: Date,
  delivery_date: Date,
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Delivered"],
    required: true,
  },
  payment_status: {
    type: String,
    enum: ["Pending", "Paid", "Overdue"],
    default: "Pending",
  },
  total_amount: {
    type: Number,
    required: true,
  },
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
  items: [
    {
      material: { type: mongoose.Schema.Types.ObjectId, ref: "Material" },
      quantity: Number,
      price: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SalesOrder", salesOrderSchema);

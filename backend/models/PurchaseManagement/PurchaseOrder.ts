import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  orderDate: Date,
  status: { type: String, enum: ["Ordered", "Received", "Cancelled"] },
  items: [
    {
      material: { type: mongoose.Schema.Types.ObjectId, ref: "Material" },
      quantity: Number,
      cost: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("PurchaseOrder", purchaseOrderSchema);

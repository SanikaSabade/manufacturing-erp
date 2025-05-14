import mongoose from "mongoose";

const grnSchema = new mongoose.Schema({
  purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder" },
  receivedDate: Date,
  receivedItems: [
    {
      material: { type: mongoose.Schema.Types.ObjectId, ref: "Material" },
      quantity: Number,
      inspected: Boolean
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("GRN", grnSchema);

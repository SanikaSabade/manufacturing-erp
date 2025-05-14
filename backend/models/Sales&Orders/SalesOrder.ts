import mongoose from "mongoose";

const salesOrderSchema = new mongoose.Schema({
  orderNumber: String,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  date: Date,
  status: { type: String, enum: ["Pending", "Confirmed", "Shipped", "Delivered"] },
  items: [
    {
      material: { type: mongoose.Schema.Types.ObjectId, ref: "Material" },
      quantity: Number,
      price: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("SalesOrder", salesOrderSchema);

import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  salesOrder: { type: mongoose.Schema.Types.ObjectId, ref: "SalesOrder" },
  issueDate: Date,
  paymentStatus: { type: String, enum: ["Unpaid", "Paid", "Overdue"] },
  pdfUrl: String,
  createdAt: { type: Date, default: Date.now }
});

export default  mongoose.model("Invoice", invoiceSchema);

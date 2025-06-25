import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  salesOrder: { type: mongoose.Schema.Types.ObjectId, ref: "SalesOrder" },
  issueDate: Date,
  paymentStatus: { type: String, enum: ["Unpaid", "Paid", "Overdue"] },
  pdfUrl: String,
  total_amount: { type: Number, required: true },
  tax_details: {
    gst_rate: Number,
    cgst: Number,
    sgst: Number,
    igst: Number,
    other_taxes: Number,
  },
  discounts: {
    type: Number,
    default: 0,
  },
  terms_conditions: String,
  received_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Invoice", invoiceSchema);

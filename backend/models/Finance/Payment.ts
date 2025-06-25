import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Incoming", "Outgoing"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reference_number: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    mode: {
      type: String, 
    },
    notes: {
      type: String,
    },
    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", 
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);

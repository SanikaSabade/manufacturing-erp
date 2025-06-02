import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Incoming", "Outgoing"],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    reference: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    },
    mode: {
      type: String 
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);

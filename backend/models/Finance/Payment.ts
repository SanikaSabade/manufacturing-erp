import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  type: { type: String, enum: ["Incoming", "Outgoing"] },
  amount: Number,
  reference: String,
  date: Date,
  mode: String,
  notes: String
});

export default mongoose.model("Payment", paymentSchema);

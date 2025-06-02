import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    paidBy: { type: String, required: true }, 
    date: { type: Date, default: Date.now },
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);

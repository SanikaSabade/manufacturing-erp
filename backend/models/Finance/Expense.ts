import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  amount: Number,
  paidBy: String,
  date: Date,
  notes: String
});

export default mongoose.model("Expense", expenseSchema);

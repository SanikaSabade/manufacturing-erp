import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    paidBy: { type: String, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String },
    expense_type: { type: String, required: false }, 
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    recurring_flag: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);

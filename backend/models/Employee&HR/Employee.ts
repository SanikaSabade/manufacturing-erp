import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  role: String,
  salary: Number,
  joinDate: Date,
  status: { type: String, enum: ["Active", "Inactive"] },
  end_date: Date,
  skill_set: [String], 
  shift: String,
  supervisor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Employee", employeeSchema);

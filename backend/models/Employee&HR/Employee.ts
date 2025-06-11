import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  role: String,
  salary: Number,
  joinDate: Date,
  status: { type: String, enum: ["Active", "Inactive"] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Employee", employeeSchema);

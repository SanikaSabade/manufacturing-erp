import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  phone: String,
  salary: Number,
  joinDate: Date,
  status: { type: String, enum: ["Active", "Inactive"] },
  end_date: Date,
  skill_set: [String],
  shift: String,
  supervisor_id: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Employee", employeeSchema);

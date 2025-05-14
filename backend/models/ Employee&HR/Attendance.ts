import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  date: Date,
  checkIn: Date,
  checkOut: Date,
  status: { type: String, enum: ["Present", "Absent", "Leave"] }
});

export default mongoose.model("Attendance", attendanceSchema);

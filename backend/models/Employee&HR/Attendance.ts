import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Employee", 
      required: true 
    },
    date: { type: Date, required: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    status: { 
      type: String, 
      enum: ["Present", "Absent", "Leave"], 
      required: true 
    },
    working_hours: { type: Number, default: 0 },    
    overtime_hours: { type: Number, default: 0 },  
    remarks: { type: String },                      
    shift: { type: String }                        
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);

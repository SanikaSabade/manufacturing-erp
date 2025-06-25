import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  message: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  read_flag: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);

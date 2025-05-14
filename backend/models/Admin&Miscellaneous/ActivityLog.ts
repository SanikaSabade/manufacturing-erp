import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    activity: String,
    timestamp: { type: Date, default: Date.now },
    ip_address: String
  });
  
  export default  mongoose.model('ActivityLog', activityLogSchema);
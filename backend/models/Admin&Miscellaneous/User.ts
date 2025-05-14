import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password_hash: String,
  role: { type: String, enum: ['admin', 'manager', 'operator'] },
  last_login: Date,
  status: { type: String, enum: ['active', 'inactive'] }
});

export default mongoose.model('User', userSchema);

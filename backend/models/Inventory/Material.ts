import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  material_name: String,
  material_code: String,
  category: { type: String, enum: ['Raw', 'Finished', 'Semi-finished'] },
  unit: String,
  quantity_available: Number,
  reorder_level: Number,
  location: String,
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Material', materialSchema);

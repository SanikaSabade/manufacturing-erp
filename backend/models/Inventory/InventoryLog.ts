import mongoose from "mongoose";

const inventoryLogSchema = new mongoose.Schema({
    material_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
    change_type: { type: String, enum: ['add', 'remove', 'adjust', 'transfer'] },
    quantity_changed: Number,
    reason: String,
    date: Date,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });
  
export default  mongoose.model('InventoryLog', inventoryLogSchema);
  
import mongoose from "mongoose";

const bomSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  components: [
    {
      material: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
      quantity: { type: Number, required: true },
      unit: { type: String }
    }
  ],
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  date_created: { type: Date, default: Date.now }
});

export default mongoose.model("BOM", bomSchema);

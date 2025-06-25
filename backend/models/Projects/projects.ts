import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  start_date: Date,
  deadline: Date,
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  budget: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Project", projectSchema);

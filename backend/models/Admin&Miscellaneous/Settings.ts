import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  currency: String,
  taxPercentage: Number,
  fiscalYearStart: Date,
  fiscalYearEnd: Date
});

export default mongoose.model("Settings", settingsSchema);

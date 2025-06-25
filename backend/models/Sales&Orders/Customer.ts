import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  gstNumber: String,
  address: String,
  contact_person: String,
  billing_address: String,
  credit_limit: { type: Number, default: 0 },
  payment_terms: { type: String, default: "" },
  bank_details: { type: String, default: "" },
  pan_number: { type: String, default: "" },
  documents: [{ type: String }], 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Customer", customerSchema);

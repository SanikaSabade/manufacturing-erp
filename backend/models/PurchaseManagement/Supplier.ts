import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  gstNumber: String,
  contact_person: String,
  billing_address: String,
  credit_limit: { type: Number, default: 0 },
  payment_terms: { type: String, default: "" },
  bank_details: { type: String, default: "" },
  pan_number: { type: String, default: "" },
  documents: [{ type: String }], 
});

export default mongoose.model("Supplier", supplierSchema);

// src/pages/AddSupplierForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

const AddSupplierForm: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gstNumber: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/suppliers", form);
      navigate("/dashboard/purchase/suppliers");
    } catch (error) {
      console.error("Failed to add supplier:", error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add New Supplier</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "email", "phone", "address", "gstNumber"].map((field) => (
          <div key={field}>
            <label className="block mb-1 font-medium capitalize">{field}</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={(form as any)[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Supplier
        </button>
      </form>
    </div>
  );
};

export default AddSupplierForm;

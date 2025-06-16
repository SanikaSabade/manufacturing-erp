import React, { useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const MaterialForm: React.FC = () => {
  const [form, setForm] = useState({
    material_name: "",
    material_code: "",
    category: "Raw",
    unit: "",
    quantity_available: "",
    reorder_level: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/materials`, form);
      navigate("/dashboard/inventory/material");
    } catch (error) {
      console.error("Failed to add material:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Material</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 bg-gray-50 p-6 rounded shadow">
        <input
          name="material_name"
          value={form.material_name}
          onChange={handleChange}
          type="text"
          placeholder="Material Name"
          required
          className="border p-2 rounded"
        />
        <input
          name="material_code"
          value={form.material_code}
          onChange={handleChange}
          type="text"
          placeholder="Material Code"
          required
          className="border p-2 rounded"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="Raw">Raw</option>
          <option value="Semi-finished">Semi-finished</option>
          <option value="Finished">Finished</option>
        </select>
        <input
          name="unit"
          value={form.unit}
          onChange={handleChange}
          type="text"
          placeholder="Unit (e.g., kg, pcs)"
          required
          className="border p-2 rounded"
        />
        <input
          name="quantity_available"
          value={form.quantity_available}
          onChange={handleChange}
          type="number"
          placeholder="Quantity Available"
          required
          className="border p-2 rounded"
        />
        <input
          name="reorder_level"
          value={form.reorder_level}
          onChange={handleChange}
          type="number"
          placeholder="Reorder Level"
          required
          className="border p-2 rounded"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          type="text"
          placeholder="Storage Location"
          required
          className="border p-2 rounded"
        />
<div className="flex gap-2 justify-center">
        <button
          type="submit"
          className=" p-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Material"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/dashboard/inventory/material")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
          Cancel
        </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialForm;

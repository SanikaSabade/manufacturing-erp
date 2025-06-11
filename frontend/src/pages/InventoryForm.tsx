import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

interface Material {
  _id: string;
  material_name: string;
}

interface User {
  _id: string;
  name: string;
}

const InventoryForm: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    material_id: "",
    change_type: "add",
    quantity_changed: "",
    reason: "",
    date: "",
    user_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialRes, userRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}api/materials`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}api/users`),
        ]);
        setMaterials(materialRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error("Failed to load materials or users", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/inventory-logs`, formData);
      navigate("/dashboard/inventory");
    } catch (error) {
      console.error("Error adding inventory log:", error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Inventory Log</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-6 rounded shadow">
        <select
          value={formData.material_id}
          onChange={(e) => setFormData({ ...formData, material_id: e.target.value })}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Material</option>
          {materials.map((mat) => (
            <option key={mat._id} value={mat._id}>
              {mat.material_name}
            </option>
          ))}
        </select>

        <select
          value={formData.change_type}
          onChange={(e) => setFormData({ ...formData, change_type: e.target.value })}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="add">Add</option>
          <option value="remove">Remove</option>
          <option value="adjust">Adjust</option>
          <option value="transfer">Transfer</option>
        </select>

        <input
          type="number"
          placeholder="Quantity Changed"
          value={formData.quantity_changed}
          onChange={(e) => setFormData({ ...formData, quantity_changed: e.target.value })}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="text"
          placeholder="Reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <select
          value={formData.user_id}
          onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2 justify-center">
          
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Add Log
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/inventory")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryForm;

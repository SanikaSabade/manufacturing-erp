import React, { useEffect, useState } from "react";
import axios from '../../utils/axios';
import { useNavigate } from "react-router-dom";

interface Material {
  _id: string;
  material_name: string;
  material_code: string;
  category: "Raw" | "Finished" | "Semi-finished";
  unit: string;
  quantity_available: number;
  reorder_level: number;
  location: string;
  created_at: string;
}

const Materials: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMaterial, setEditMaterial] = useState<Material | null>(null);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get<Material[]>(`${import.meta.env.VITE_BACKEND_URL}api/materials`);
      setMaterials(res.data);
    } catch (err) {
      console.error("Failed to fetch materials:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (material: Material) => {
    setEditMaterial({ ...material });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this material?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/materials/${id}`);
      fetchMaterials();
    } catch (error) {
      console.error("Failed to delete material:", error);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editMaterial) return;
    const { name, value } = e.target;
    const updated = {
      ...editMaterial,
      [name]: name === "quantity_available" || name === "reorder_level" ? Number(value) : value,
    };
    setEditMaterial(updated);
  };

  const handleUpdate = async () => {
    if (!editMaterial) return;
    setUpdating(true);
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/materials/${editMaterial._id}`, editMaterial);
      setEditMaterial(null);
      fetchMaterials();
    } catch (error) {
      console.error("Failed to update material:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6">Loading materials...</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Materials</h2>
        <button
          onClick={() => navigate("/dashboard/material/add")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Material
        </button>
      </div>

      {editMaterial && (
        <div className="mb-6 p-4 border rounded shadow bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="material_name"
            value={editMaterial.material_name}
            onChange={handleEditChange}
            className="border p-2 rounded"
            placeholder="Material Name"
          />
          <input
            type="text"
            name="material_code"
            value={editMaterial.material_code}
            onChange={handleEditChange}
            className="border p-2 rounded"
            placeholder="Material Code"
          />
          <select
            name="category"
            value={editMaterial.category}
            onChange={handleEditChange}
            className="border p-2 rounded"
          >
            <option value="Raw">Raw</option>
            <option value="Semi-finished">Semi-finished</option>
            <option value="Finished">Finished</option>
          </select>
          <input
            type="text"
            name="unit"
            value={editMaterial.unit}
            onChange={handleEditChange}
            className="border p-2 rounded"
            placeholder="Unit"
          />
          <input
            type="number"
            name="quantity_available"
            value={editMaterial.quantity_available}
            onChange={handleEditChange}
            className="border p-2 rounded"
            placeholder="Quantity Available"
          />
          <input
            type="number"
            name="reorder_level"
            value={editMaterial.reorder_level}
            onChange={handleEditChange}
            className="border p-2 rounded"
            placeholder="Reorder Level"
          />
          <input
            type="text"
            name="location"
            value={editMaterial.location}
            onChange={handleEditChange}
            className="border p-2 rounded"
            placeholder="Location"
          />
          <div className="col-span-full flex gap-4 justify-start mt-2">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={updating}
            >
              {updating ? "Updating..." : "Update"}
            </button>
            <button
              onClick={() => setEditMaterial(null)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Unit</th>
              <th className="px-4 py-2 border">Available</th>
              <th className="px-4 py-2 border">Reorder Level</th>
              <th className="px-4 py-2 border">Location</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 border">{material.material_name}</td>
                <td className="px-4 py-2 border">{material.material_code}</td>
                <td className="px-4 py-2 border">{material.category}</td>
                <td className="px-4 py-2 border">{material.unit}</td>
                <td className="px-4 py-2 border">{material.quantity_available}</td>
                <td className="px-4 py-2 border">{material.reorder_level}</td>
                <td className="px-4 py-2 border">{material.location}</td>
                <td className="px-4 py-2 border">{new Date(material.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2 ">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(material)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(material._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                    Delete
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Materials;

import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";

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

  const getCategoryBadge = (category: string) => {
    const categoryClasses = {
      Raw: "bg-blue-100 text-blue-800 border-blue-200",
      "Semi-finished": "bg-yellow-100 text-yellow-800 border-yellow-200",
      Finished: "bg-green-100 text-green-800 border-green-200",
    };

    return (
      <span
        className={`px-1.5 py-0.5 rounded-full text-xs font-medium border ${
          categoryClasses[category as keyof typeof categoryClasses]
        }`}
      >
        {category}
      </span>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Materials</h1>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editMaterial && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Material</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Material Name</label>
                  <input
                    type="text"
                    name="material_name"
                    value={editMaterial.material_name}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter material name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Material Code</label>
                  <input
                    type="text"
                    name="material_code"
                    value={editMaterial.material_code}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter material code"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={editMaterial.category}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="Raw">Raw</option>
                    <option value="Semi-finished">Semi-finished</option>
                    <option value="Finished">Finished</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={editMaterial.unit}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter unit"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Available</label>
                  <input
                    type="number"
                    name="quantity_available"
                    value={editMaterial.quantity_available}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter quantity available"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Level</label>
                  <input
                    type="number"
                    name="reorder_level"
                    value={editMaterial.reorder_level}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter reorder level"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editMaterial.location}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter location"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditMaterial(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Materials List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[110px]">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[100px]">Code</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[120px]">Location</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {materials.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-3 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  materials.map((material) => (
                    <tr key={material._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 py-2 max-w-[110px] whitespace-normal break-words">
                        <div className="text-sm text-gray-900 truncate">{material.material_name}</div>
                      </td>
                      <td className="px-3 py-2 max-w-[100px] whitespace-nowrap">
                        <div className="text-sm text-gray-900">{material.material_code}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{getCategoryBadge(material.category)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{material.unit}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{material.quantity_available}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{material.reorder_level}</div>
                      </td>
                      <td className="px-3 py-2 max-w-[120px] whitespace-normal break-words">
                        <div className="text-sm text-gray-900 truncate">{material.location}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(material.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(material)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(material._id)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;
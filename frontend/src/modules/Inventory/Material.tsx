import React, { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    axios
      .get<Material[]>(`${import.meta.env.VITE_BACKEND_URL}api/materials`)
      .then((res) => setMaterials(res.data))
      .catch((err) => console.error("Failed to fetch materials:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading materials...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Materials</h2>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Unit</th>
              <th className="px-4 py-2">Available</th>
              <th className="px-4 py-2">Reorder Level</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{material.material_name}</td>
                <td className="px-4 py-2">{material.material_code}</td>
                <td className="px-4 py-2">{material.category}</td>
                <td className="px-4 py-2">{material.unit}</td>
                <td className="px-4 py-2">{material.quantity_available}</td>
                <td className="px-4 py-2">{material.reorder_level}</td>
                <td className="px-4 py-2">{material.location}</td>
                <td className="px-4 py-2">{new Date(material.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Materials;

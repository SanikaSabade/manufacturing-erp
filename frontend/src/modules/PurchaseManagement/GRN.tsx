import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

interface Material {
  material_name: string;
}

interface ReceivedItem {
  material: Material;
  quantity: number;
  inspected: boolean;
}

interface PurchaseOrder {
  _id: string;
  supplier?: { name: string };
  orderDate?: string;
}

interface GRN {
  _id: string;
  purchaseOrder: PurchaseOrder;
  receivedDate: string;
  receivedItems: ReceivedItem[];
  createdAt: string;
}

const GRNComponent: React.FC = () => {
  const [grns, setGrns] = useState<GRN[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGRNs();
  }, []);

  const fetchGRNs = () => {
    axios
      .get<GRN[]>(`${import.meta.env.VITE_BACKEND_URL}api/grns`)
      .then((res) => setGrns(res.data))
      .catch((err) => console.error("Error fetching GRNs:", err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this GRN?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/grns/${id}`);
      fetchGRNs();
    } catch (err) {
      console.error("Error deleting GRN:", err);
    }
  };

  if (loading) return <div className="p-6">Loading GRNs...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Goods Receipt Notes (GRNs)</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/dashboard/grn/add")}
        >
          + Add GRN
        </button>
      </div>

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-sm border text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2">Purchase Order ID</th>
              <th className="px-4 py-2">Received Date</th>
              <th className="px-4 py-2">Received Items</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {grns.map((grn) => (
              <tr key={grn._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{grn.purchaseOrder?._id}</td>
                <td className="px-4 py-2">
                  {new Date(grn.receivedDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <ul className="list-disc pl-4">
                    {grn.receivedItems.map((item, idx) => (
                      <li key={idx}>
                        {item.material?.material_name} – {item.quantity} pcs –{" "}
                        {item.inspected ? "Inspected ✅" : "Not Inspected ❌"}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2">
                  {new Date(grn.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/dashboard/purchase/grn/edit/${grn._id}`)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(grn._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {grns.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  No GRNs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GRNComponent;

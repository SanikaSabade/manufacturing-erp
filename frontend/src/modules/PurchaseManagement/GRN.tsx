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
  _id?: string;
  purchaseOrder: PurchaseOrder;
  receivedDate: string;
  receivedItems: ReceivedItem[];
  createdAt?: string;
}

const GRNComponent: React.FC = () => {
  const [grns, setGrns] = useState<GRN[]>([]);
  const [form, setForm] = useState<GRN>({
    purchaseOrder: { _id: "" },
    receivedDate: "",
    receivedItems: [{ material: { material_name: "" }, quantity: 0, inspected: false }],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGRNs();
  }, []);
const navigate=useNavigate();
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
  
    const isCheckbox = (e.target as HTMLInputElement).type === "checkbox";
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;
  
    if (index !== undefined) {
      const items = [...form.receivedItems];
      if (name === "material_name") {
        items[index].material.material_name = value;
      } else if (name === "quantity") {
        items[index].quantity = Number(value);
      } else if (name === "inspected") {
        items[index].inspected = !!checked;
      }
      setForm({ ...form, receivedItems: items });
    } else if (name === "receivedDate") {
      setForm({ ...form, receivedDate: value });
    } else if (name === "purchaseOrderId") {
      setForm({ ...form, purchaseOrder: { _id: value } });
    }
  };
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/grns/${editingId}`, form);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/grns`, form);
      }
      fetchGRNs();
      setEditingId(null);
      setShowForm(false);
      setForm({
        purchaseOrder: { _id: "" },
        receivedDate: "",
        receivedItems: [{ material: { material_name: "" }, quantity: 0, inspected: false }],
      });
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleEdit = (grn: GRN) => {
    setForm(grn);
    setEditingId(grn._id || null);
    setShowForm(true);
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

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded shadow space-y-4">
          <input
            name="purchaseOrderId"
            value={form.purchaseOrder._id}
            onChange={handleInputChange}
            placeholder="Purchase Order ID"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            name="receivedDate"
            value={form.receivedDate}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          <div>
            <h3 className="font-semibold mb-2">Received Items</h3>
            {form.receivedItems.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  name="material_name"
                  value={item.material.material_name}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="Material Name"
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="Quantity"
                  className="p-2 border rounded"
                  required
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="inspected"
                    checked={item.inspected}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                  Inspected
                </label>
              </div>
            ))}
           
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingId ? "Update GRN" : "Add GRN"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-sm border text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 border">Purchase Order ID</th>
              <th className="px-4 py-2 border">Received Date</th>
              <th className="px-4 py-2 border">Received Items</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {grns.map((grn) => (
              <tr key={grn._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 border">{grn.purchaseOrder?._id}</td>
                <td className="px-4 py-2 border">{new Date(grn.receivedDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">
                  <ul className="list-disc pl-4">
                    {grn.receivedItems.map((item, idx) => (
                      <li key={idx}>
                        {item.material?.material_name} – {item.quantity} pcs –{" "}
                        {item.inspected ? "Inspected ✅" : "Not Inspected ❌"}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 border">
                  {new Date(grn.createdAt || "").toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(grn)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(grn._id!)}
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




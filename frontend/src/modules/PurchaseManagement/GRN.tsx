import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";

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

  const fetchGRNs = () => {
    setLoading(true);
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

  const getInspectedBadge = (inspected: boolean) => {
    return (
      <span
        className={`px-1.5 py-0.5 rounded-full text-xs font-medium border ${
          inspected
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-red-100 text-red-800 border-red-200"
        }`}
      >
        {inspected ? "Inspected" : "Not Inspected"}
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Goods Receipt Notes (GRNs)</h1>
            </div>
            
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{editingId ? "Edit GRN" : "Add GRN"}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Order ID</label>
                  <input
                    name="purchaseOrderId"
                    value={form.purchaseOrder._id}
                    onChange={handleInputChange}
                    placeholder="Enter Purchase Order ID"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Received Date</label>
                  <input
                    type="date"
                    name="receivedDate"
                    value={form.receivedDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Received Items</h4>
                {form.receivedItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Material Name</label>
                      <input
                        name="material_name"
                        value={item.material.material_name}
                        onChange={(e) => handleInputChange(e, index)}
                        placeholder="Enter material name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleInputChange(e, index)}
                        placeholder="Enter quantity"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          name="inspected"
                          checked={item.inspected}
                          onChange={(e) => handleInputChange(e, index)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        Inspected
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  {editingId ? "Update GRN" : "Add GRN"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm({
                      purchaseOrder: { _id: "" },
                      receivedDate: "",
                      receivedItems: [{ material: { material_name: "" }, quantity: 0, inspected: false }],
                    });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">GRNs List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[120px]">Purchase Order ID</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[200px]">Received Items</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No GRNs found</h3>
                        <p className="text-gray-500">Get started by adding your first GRN.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  grns.map((grn) => (
                    <tr key={grn._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 py-2 max-w-[120px] whitespace-normal break-words">
                        <div className="text-sm text-gray-900 truncate">{grn.purchaseOrder?._id || "N/A"}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(grn.receivedDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-3 py-2 max-w-[200px] whitespace-normal break-words">
                        <ul className="text-sm text-gray-900 space-y-1">
                          {grn.receivedItems.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="truncate">
                                {item.material?.material_name || "N/A"} – {item.quantity} pcs
                              </span>
                              {getInspectedBadge(item.inspected)}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {grn.createdAt ? new Date(grn.createdAt).toLocaleDateString() : "-"}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(grn)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(grn._id!)}
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

export default GRNComponent;
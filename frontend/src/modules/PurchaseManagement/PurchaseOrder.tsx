import React, { useEffect, useState } from "react";
import axios from '../../utils/axios';
import { useNavigate } from "react-router-dom";

interface Supplier {
  _id: string;
  name: string;
}

interface Material {
  _id: string;
  material_name: string;
}

interface Item {
  material: Material;
  quantity: number;
  cost: number;
}

interface PurchaseOrder {
  _id: string;
  supplier: Supplier;
  orderDate: string;
  status: "Ordered" | "Received" | "Cancelled";
  items: Item[];
  createdAt: string;
}

const PurchaseOrders: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editableOrder, setEditableOrder] = useState<Partial<PurchaseOrder>>({});
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    axios.get(`${import.meta.env.VITE_BACKEND_URL}api/suppliers`)
      .then(res => setSuppliers(res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    axios
      .get<PurchaseOrder[]>(`${import.meta.env.VITE_BACKEND_URL}api/purchase-orders`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching purchase orders:", err))
      .finally(() => setLoading(false));
  };

  const handleEditToggle = (order: PurchaseOrder) => {
    if (editingId === order._id) {
      setEditingId(null);
    } else {
      setEditingId(order._id);
      setEditableOrder({
        ...order,
        orderDate: order.orderDate.split("T")[0],
        items: order.items.map(item => ({
          ...item,
          material: item.material
        }))
      });
    }
  };

  const handleEditChange = (field: string, value: any) => {
    setEditableOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/purchase-orders/${editingId}`, editableOrder);
      setEditingId(null);
      fetchOrders();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this purchase order?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/purchase-orders/${id}`);
        fetchOrders();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  if (loading) return <div className="p-6">Loading purchase orders...</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Purchase Orders</h2>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/dashboard/purchase/add")}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
            + Add Purchase Order
          </button>

        </div>
      </div>

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-sm border text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 border">Supplier</th>
              <th className="px-4 py-2 border">Order Date</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Items</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                {editingId === order._id ? (
                  <>
                    <td className="px-4 py-2 ">
                      <select
                        value={editableOrder.supplier?._id}
                        onChange={(e) =>
                          handleEditChange("supplier", suppliers.find(s => s._id === e.target.value))
                        }
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="">Select</option>
                        {suppliers.map((sup) => (
                          <option key={sup._id} value={sup._id}>{sup.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="date"
                        value={editableOrder.orderDate || ""}
                        onChange={(e) => handleEditChange("orderDate", e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={editableOrder.status}
                        onChange={(e) => handleEditChange("status", e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="Ordered">Ordered</option>
                        <option value="Received">Received</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-gray-500 italic">Edit items not supported here</td>
                    <td className="px-4 py-2 text-gray-500 italic">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={handleEditSubmit}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2">{order.supplier?.name}</td>
                    <td className="px-4 py-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{order.status}</td>
                    <td className="px-4 py-2">
                      <ul className="list-disc pl-4">
                        {order.items.map((item, i) => (
                          <li key={i}>
                            {item.material?.material_name} – {item.quantity} pcs @ ₹{item.cost}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEditToggle(order)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6">

      <button
            onClick={() => navigate("/dashboard/purchase/suppliers")}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Suppliers
          </button>
          </div>
    </div>
  );
};

export default PurchaseOrders;

import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

interface Item {
  quantity: number;
  material: { name: string };
  price: number;
}

interface SalesOrder {
  _id?: string;
  orderNumber: string;
  customer: { name: string };
  date: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered";
  items: Item[];
  createdAt?: string;
}

const SalesOrders: React.FC = () => {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [form, setForm] = useState<SalesOrder>({
    orderNumber: "",
    customer: { name: "" },
    date: "",
    status: "Pending",
    items: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get<SalesOrder[]>(`${import.meta.env.VITE_BACKEND_URL}api/sales-orders`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({
      orderNumber: "",
      customer: { name: "" },
      date: "",
      status: "Pending",
      items: [],
    });
    setEditingId(null);
  };

  const calculateTotal = (items: Item[]) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "customer") {
      setForm({ ...form, customer: { name: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/sales-orders/${editingId}`, form);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/sales-orders`, form);
      }
      fetchOrders();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleEdit = (order: SalesOrder) => {
    setForm(order);
    setEditingId(order._id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/sales-orders/${id}`);
      fetchOrders();
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Orders</h2>
        <div className="flex gap-2">
        <button
onClick={() => navigate("/dashboard/sales/add")}
className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
+ Add Order
</button>
          
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-gray-100 p-4 rounded shadow grid grid-cols-2 gap-4"
        >
          <input
            name="orderNumber"
            value={form.orderNumber}
            onChange={handleInputChange}
            placeholder="Order Number"
            className="p-2 border rounded"
            required
          />
          <input
            name="customer"
            value={form.customer.name}
            onChange={handleInputChange}
            placeholder="Customer Name"
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <select
            name="status"
            value={form.status}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
          <div className="col-span-2 flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingId ? "Update Order" : "Add Order"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Order Number</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Total Items</th>
              <th className="px-4 py-2 border">Total Price</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-2 border">{order.orderNumber}</td>
                <td className="px-4 py-2 border">{order.customer?.name || "N/A"}</td>
                <td className="px-4 py-2 border">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border capitalize">{order.status}</td>
                <td className="px-4 py-2 border">{order.items.length}</td>
                <td className="px-4 py-2 border">₹{calculateTotal(order.items)}</td>
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(order)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(order._id!)}
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
      <div className="flex justify-center mt-6">

      <button
            onClick={() => navigate("/dashboard/sales/customers")}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
            Customers List
          </button>
          </div>
    </div>
  );
};

export default SalesOrders;





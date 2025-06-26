import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";

import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";


interface Item {
  quantity: number;
  material: string; 
  price: number;
}


interface SalesOrder {
  _id?: string;
  orderNumber?: string;
  customer: { name: string };
  date: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered";
  items: Item[];
  delivery_date?: string;
  payment_status?: "Pending" | "Paid" | "Overdue";
  total_amount?: number;
  priority?: "Low" | "Medium" | "High" | "Urgent";
  expected_delivery?: string;
  approval_status?: "Draft" | "Pending" | "Approved" | "Rejected";
  linked_documents?: string[];
  last_updated_by?: string;
  createdAt?: string;
}

const SalesOrders: React.FC = () => {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  
  const [employees, setEmployees] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [form, setForm] = useState<SalesOrder>({
    orderNumber: "",
    customer: { name: "" },
    date: "",
    status: "Pending",
    items: [],
    delivery_date: "",
  payment_status: "Pending",
  priority: "Low",
  expected_delivery: "",
  approval_status: "Draft",
  linked_documents: [],
  last_updated_by: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    fetchEmployees();
  }, []);

  const fetchOrders = () => {
    axios
      .get<SalesOrder[]>(`${import.meta.env.VITE_BACKEND_URL}api/sales-orders`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  };

 
  const fetchEmployees = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/employees`);
    setEmployees(res.data);
  };

  const resetForm = () => {
    setForm({
      orderNumber: "",
      customer: { name: "" },
      date: "",
      status: "Pending",
      items: [],
      delivery_date: "",
      payment_status: "Pending",
      priority: "Low",
      expected_delivery: "",
      approval_status: "Draft",
      linked_documents: [],
      last_updated_by: "",
    });
    setEditingId(null);
  };

  const calculateTotal = (items: Item[]) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/sales-orders/${editingId}`, form);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/sales-orders`, {
          ...form,
          orderNumber: `SO${Date.now()}`,
        });
      }
  
      fetchOrders();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleEdit = (order: SalesOrder) => {
    setForm({
      orderNumber: order.orderNumber || "",
      customer: order.customer as any,
      date: order.date,
      status: order.status,
      items: order.items,
      delivery_date: order.delivery_date,
      payment_status: order.payment_status,
      priority: order.priority,
      expected_delivery: order.expected_delivery,
      approval_status: order.approval_status,
      linked_documents: order.linked_documents,
      last_updated_by: order.last_updated_by as any,
    });
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

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      Shipped: "bg-purple-100 text-purple-800 border-purple-200",
      Delivered: "bg-green-100 text-green-800 border-green-200",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
      </span>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales Orders</h1>
            </div>
            
          </div>
        </div>
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? "Edit Order" : "Create New Order"}
            </h3>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 3, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 3 }}
            >
              <TextField
                label="Customer Name"
                value={form.customer.name}
                onChange={(e) => setForm({ ...form, customer: { name: e.target.value } })}
                required
                fullWidth
              />

              <TextField
                label="Order Date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as SalesOrder["status"] })}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Delivery Date"
                type="date"
                value={form.delivery_date || ""}
                onChange={(e) => setForm({ ...form, delivery_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  label="Payment Status"
                  value={form.payment_status}
                  onChange={(e) => setForm({ ...form, payment_status: e.target.value as SalesOrder["payment_status"] })}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  label="Priority"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as SalesOrder["priority"] })}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Urgent">Urgent</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Expected Delivery"
                type="date"
                value={form.expected_delivery || ""}
                onChange={(e) => setForm({ ...form, expected_delivery: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Approval Status</InputLabel>
                <Select
                                label="Approval Status"

                  value={form.approval_status}
                  onChange={(e) => setForm({ ...form, approval_status: e.target.value as SalesOrder["approval_status"] })}
                >
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Linked Documents (comma separated)"
                value={form.linked_documents?.join(", ") }
                onChange={(e) =>
                  setForm({ ...form, linked_documents: e.target.value.split(",").map((d) => d.trim()) })
                }
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Last Updated By</InputLabel>
                <Select
                                label="Last Updated By"
                  value={form.last_updated_by}
                  onChange={(e) => setForm({ ...form, last_updated_by: e.target.value })}
                >
                  {employees.map((emp) => (
                    <MenuItem key={emp._id} value={emp._id}>
                      {emp.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="col-span-2 flex space-x-4 gap-4">
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                >
                  {editingId ? "Update Order" : "Create Order"}
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Box>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 p-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text--600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'Pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'Shipped').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'Delivered').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'Confirmed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Orders List</h3>
          </div>
          <div className="overflow-x-auto">
          
          <table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Number</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Delivery</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Status</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linked Documents</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated By</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {orders.length === 0 ? (
      <tr>
        <td colSpan={14} className="px-6 py-12 text-center">
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          </div>
        </td>
      </tr>
    ) : (
      orders.map((order) => (
        <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{order.customer?.name || "N/A"}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{new Date(order.date).toLocaleDateString()}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : "N/A"}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{order.payment_status}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{order.priority}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{order.expected_delivery ? new Date(order.expected_delivery).toLocaleDateString() : "N/A"}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{order.approval_status}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
  {order.linked_documents && order.linked_documents.length > 0 && order.linked_documents.some((url) => url.trim() !== "") ? (
    <div className="flex flex-col space-y-1">
      {order.linked_documents
        .filter((url) => url.trim() !== "")
        .map((url, index) => (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            Document {index + 1}
          </a>
        ))}
    </div>
  ) : (
    <span className="text-gray-500">N/A</span>
  )}
</td>


          <td className="px-6 py-4 whitespace-nowrap">
          {typeof order.last_updated_by === "object"
      ? (order.last_updated_by as any).name
      : employees.find((emp) => emp._id === order.last_updated_by)?.name || "N/A"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900">₹{calculateTotal(order.items)}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(order)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(order._id!)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
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

export default SalesOrders;
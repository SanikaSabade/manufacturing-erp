import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import {
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

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
  delivery_date?: string;
  payment_status?: "Pending" | "Paid" | "Overdue";
  priority?: "Low" | "Medium" | "High" | "Urgent";
  linked_documents?: string[];
  expected_delivery?: string;
  approval_status?: "Draft" | "Pending" | "Approved" | "Rejected";
  last_updated_by?: string;
  createdAt: string;
}

const PurchaseOrders: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [employees, setEmployees] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editableOrder, setEditableOrder] = useState<Partial<PurchaseOrder>>({});
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    fetchEmployees();
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}api/suppliers`)
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    axios
      .get<PurchaseOrder[]>(`${import.meta.env.VITE_BACKEND_URL}api/purchase-orders`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching purchase orders:", err))
      .finally(() => setLoading(false));
  };

  const fetchEmployees = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/employees`);
    setEmployees(res.data);
  };

  const handleEditToggle = (order: PurchaseOrder) => {
    setEditingId(order._id);
    setEditableOrder({
      ...order,
      orderDate: order.orderDate.split("T")[0],
      items: order.items.map((item) => ({
        material: { ...item.material },
        quantity: item.quantity,
        cost: item.cost,
      })),
    });
  };

  const handleEditChange = (field: string, value: any) => {
    setEditableOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/purchase-orders/${editingId}`,
        editableOrder
      );
      setEditingId(null);
      setEditableOrder({});
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

  const calculateTotal = (items: Item[]) =>
    items.reduce((sum, item) => sum + item.cost * item.quantity, 0).toFixed(2);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Ordered: "bg-blue-100 text-blue-800 border-blue-200",
      Received: "bg-green-100 text-green-800 border-green-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
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
              <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
            </div>
           
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ordered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'Ordered').length}
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
                <p className="text-sm font-medium text-gray-600">Received</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'Received').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'Cancelled').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {editingId && editableOrder && (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900">Edit Purchase Order</h3>
    <Stack spacing={3} mt={3}>
      <FormControl fullWidth>
        <InputLabel>Supplier</InputLabel>
        <Select
        label="Supplier"
          value={editableOrder.supplier?._id || ""}
          onChange={(e) =>
            handleEditChange(
              "supplier",
              suppliers.find((s) => s._id === e.target.value)
            )
          }
        >
          {suppliers.map((sup) => (
            <MenuItem key={sup._id} value={sup._id}>
              {sup.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Order Date"
        type="date"
        required
        value={editableOrder.orderDate || ""}
        onChange={(e) => handleEditChange("orderDate", e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
<FormControl fullWidth>
        <InputLabel>Purchase Order Status</InputLabel>
        <Select
        label="Purchase Order Status"
        required
          value={editableOrder.status || ""}
          onChange={(e) => handleEditChange("status", e.target.value)}
        >
          <MenuItem value="Ordered">Ordered</MenuItem>
          <MenuItem value="Received">Received</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Delivery Date"
        type="date"
        required
        value={editableOrder.delivery_date || ""}
        onChange={(e) => handleEditChange("delivery_date", e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>Payment Status</InputLabel>
        <Select
        label="Payment Status"
        required
          value={editableOrder.payment_status || ""}
          onChange={(e) => handleEditChange("payment_status", e.target.value)}
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
          value={editableOrder.priority || ""}
          onChange={(e) => handleEditChange("priority", e.target.value)}
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
        required
        value={editableOrder.expected_delivery || ""}
        onChange={(e) =>
          handleEditChange("expected_delivery", e.target.value)
        }
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>Approval Status</InputLabel>
        <Select
        label="Approval Status"
          value={editableOrder.approval_status || ""}
          onChange={(e) => handleEditChange("approval_status", e.target.value)}
        >
          <MenuItem value="Draft">Draft</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </Select>
      </FormControl>

      <TextField
      required
        label="Linked Documents (comma separated)"
        value={(editableOrder.linked_documents || []).join(", ")}
        onChange={(e) =>
          handleEditChange(
            "linked_documents",
            e.target.value.split(",").map((doc) => doc.trim())
          )
        }
        fullWidth
      />

     
<FormControl fullWidth>
                <InputLabel>Last Updated By</InputLabel>
                <Select
                  label="Last Updated By"
                  value={editableOrder.last_updated_by ||""}
                  onChange={(e) => handleEditChange("last_updated_by", e.target.value )}
                >
                  {employees.map((emp) => (
                    <MenuItem key={emp._id} value={emp._id}>
                      {emp.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

      <div>
        <div className="text-sm font-medium text-gray-700">Items</div>
        <Stack spacing={2}>
          {(editableOrder.items || []).map((item, idx) => (
            <Stack key={idx} spacing={1} p={2} bgcolor="#f9fafb" borderRadius={1}>
              <TextField
                label="Material Name"
                value={item.material.material_name}
                onChange={(e) => {
                  const updated = [...(editableOrder.items || [])];
                  updated[idx].material.material_name = e.target.value;
                  setEditableOrder((prev) => ({ ...prev, items: updated }));
                }}
                fullWidth
              />
              <TextField
                label="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const updated = [...(editableOrder.items || [])];
                  updated[idx].quantity = Number(e.target.value);
                  setEditableOrder((prev) => ({ ...prev, items: updated }));
                }}
                fullWidth
              />
              <TextField
                label="Cost"
                type="number"
                value={item.cost}
                onChange={(e) => {
                  const updated = [...(editableOrder.items || [])];
                  updated[idx].cost = Number(e.target.value);
                  setEditableOrder((prev) => ({ ...prev, items: updated }));
                }}
                fullWidth
              />
            </Stack>
          ))}
        </Stack>
      </div>

      <Stack direction="row" spacing={2}>
        <Button variant="contained"
                  color="success"
                   onClick={handleEditSubmit}>
          Save Changes
        </Button>
        <Button
          variant="contained"
                  color="inherit"
          onClick={() => {
            setEditingId(null);
            setEditableOrder({});
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  </div>
)}


        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Purchase Orders List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase order Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                  </th> <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Linked Documents
                  </th> <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected Delivery
                  </th> <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approval Status
                  </th> <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated By
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase orders found</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.supplier?.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm text-gray-900 mb-1">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </div>
                          <div className="space-y-1">
                            {order.items.slice(0, 2).map((item, i) => (
                              <div key={i} className="text-xs text-gray-600">
                                {item.material?.material_name} × {item.quantity} @ ₹{item.cost}
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{order.items.length - 2} more items
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : "N/A"}
                      </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                      {order.payment_status}
                      </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{calculateTotal(order.items)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                      {order.priority}                   
                         </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                      <div className="text-sm text-gray-900">{order.linked_documents?.join(", ") || "N/A"}</div>
                      </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                      {order.expected_delivery ? new Date(order.expected_delivery).toLocaleDateString() : "N/A"}              
                      </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                      {order.approval_status}              
                       </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      {order.last_updated_by && typeof order.last_updated_by === "object"
    ? (order.last_updated_by as any).name
    : (order.last_updated_by && employees.find(emp => emp._id === order.last_updated_by)?.name) || "N/A"}
</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditToggle(order)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(order._id)}
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

export default PurchaseOrders;
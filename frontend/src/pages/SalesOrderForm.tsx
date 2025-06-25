import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

interface Customer {
  _id: string;
  name: string;
}
interface Employee {
  _id: string;
  name: string;
}
interface Material {
  material_name: string;
  _id: string;
  name: string;
}

const SalesOrderForm: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [form, setForm] = useState({
    customerId: "",
    date: "",
    deliveryDate: "",
    status: "Pending",
    paymentStatus: "Pending",
    priority: "Medium",
    expectedDelivery: "",
    approvalStatus: "Draft",
    lastUpdatedBy: "",
    linkedDocuments: [] as string[],
    items: [{ material: "", quantity: 1, price: 0 }],
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}api/customers`)
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Error loading customers:", err));

    axios.get(`${import.meta.env.VITE_BACKEND_URL}api/employees`)
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error loading employees:", err));

    axios.get(`${import.meta.env.VITE_BACKEND_URL}api/materials`)
      .then((res) => setMaterials(res.data))
      .catch((err) => console.error("Error loading materials:", err));
  }, []);

  const handleItemChange = (
    index: number,
    field: "material" | "quantity" | "price",
    value: any
  ) => {
    const updatedItems = [...form.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setForm({ ...form, items: updatedItems });
  };
  
  const addItem = () => {
    setForm({ ...form, items: [...form.items, { material: "", quantity: 1, price: 0 }] });
  };
  
  const removeItem = (index: number) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updatedItems });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Calculate total_amount
    const totalAmount = form.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/sales-orders`, {
        orderNumber: `SO${Date.now()}`,
        customer: form.customerId,
        date: form.date,
        delivery_date: form.deliveryDate,
        status: form.status,
        payment_status: form.paymentStatus,
        priority: form.priority,
        expected_delivery: form.expectedDelivery,
        approval_status: form.approvalStatus,
        last_updated_by: form.lastUpdatedBy,
        linked_documents: form.linkedDocuments,
        items: form.items,
        total_amount: totalAmount,
      });
      navigate("/dashboard/sales");
    } catch (err) {
      console.error("Error adding order:", err);
    }
  };
  
  return (
    <Box maxWidth={700} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Sales Order
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Customer</InputLabel>
            <Select
              label="Customer"
              required
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            >
              <MenuItem value="">Select Customer</MenuItem>
              {customers.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Order Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Delivery Date"
            type="date"
            value={form.deliveryDate}
            onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Payment Status</InputLabel>
            <Select
              label="Payment Status"
              value={form.paymentStatus}
              onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
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
            value={form.expectedDelivery}
            onChange={(e) => setForm({ ...form, expectedDelivery: e.target.value })}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Approval Status</InputLabel>
            <Select
              label="Approval Status"
              value={form.approvalStatus}
              onChange={(e) => setForm({ ...form, approvalStatus: e.target.value })}
            >
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Last Updated By</InputLabel>
            <Select
              label="Last Updated By"
              value={form.lastUpdatedBy}
              onChange={(e) => setForm({ ...form, lastUpdatedBy: e.target.value })}
            >
              <MenuItem value="">Select Employee</MenuItem>
              {employees.map((emp) => (
                <MenuItem key={emp._id} value={emp._id}>
                  {emp.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Linked Documents (comma separated)"
            value={form.linkedDocuments.join(", ")}
            onChange={(e) =>
              setForm({ ...form, linkedDocuments: e.target.value.split(",").map((doc) => doc.trim()) })
            }
            fullWidth
            sx={{ mb: 2 }}
          />

          <Typography variant="h6" mt={3} mb={1}>
            Items
          </Typography>

          {form.items.map((item, index) => (
            <Box key={index} display="flex" gap={2} alignItems="center" mb={2}>
              <FormControl fullWidth>
                <InputLabel>Material</InputLabel>
                <Select
                label="Material"
                  value={item.material}
                  onChange={(e) => handleItemChange(index, "material", e.target.value)}
                >
                  <MenuItem value="">Select Material</MenuItem>
                  {materials.map((mat) => (
                    <MenuItem key={mat._id} value={mat._id}>
                {mat.material_name}
              </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                fullWidth
              />
              <TextField
                label="Price"
                type="number"
                value={item.price}
                onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
                fullWidth
              />
              <IconButton onClick={() => removeItem(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button variant="outlined" onClick={addItem} sx={{ mb: 3 }}>
            + Add Item
          </Button>

          <Stack direction="row" justifyContent="center" spacing={2}>
            <Button type="submit" variant="contained" color="success">
              Submit Order
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate("/dashboard/sales")}>
              Cancel
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default SalesOrderForm;

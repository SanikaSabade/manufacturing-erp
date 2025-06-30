import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Stack,
  Paper,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import DeleteIcon from "@mui/icons-material/Delete";

interface Supplier {
  _id: string;
  name: string;
}
interface Material {
  _id: string;
  material_name: string;
}
interface Employee {
  _id: string;
  name: string;
}
interface Item {
  materialId: string;
  quantity: number;
  cost: number;
}
interface PurchaseOrderInput {
  supplierId: string;
  orderDate: string;
  status: "Ordered" | "Received" | "Cancelled";
  delivery_date?: string;
  payment_status?: "Pending" | "Paid" | "Overdue";
  priority?: "Low" | "Medium" | "High" | "Urgent";
  expected_delivery?: string;
  approval_status?: "Draft" | "Pending" | "Approved" | "Rejected";
  linked_documents?: string[];
  last_updated_by?: string;
  items: Item[];
}

const PurchaseOrderForm: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [form, setForm] = useState<PurchaseOrderInput>({
    supplierId: "",
    orderDate: "",
    status: "Ordered",
    items: [{ materialId: "", quantity: 0, cost: 0 }],
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}api/suppliers`)
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error("Error loading suppliers:", err));
  
    axios.get(`${import.meta.env.VITE_BACKEND_URL}api/materials`)
      .then((res) => setMaterials(res.data))
      .catch((err) => console.error("Error loading materials:", err));
  
    axios.get(`${import.meta.env.VITE_BACKEND_URL}api/employees`)
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error loading employees:", err));
  }, []);
  
  const handleItemChange = <K extends keyof Item>(
    index: number,
    field: K,
    value: Item[K]
  ) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm({ ...form, items: updatedItems });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasInvalidItems = form.items.some(
      (item) => !item.materialId || !item.quantity || !item.cost
    );
    if (!form.supplierId || !form.orderDate || hasInvalidItems) {
      alert("Please fill in all required fields before submitting.");
      return;
    }
    const totalAmount = form.items.reduce(
      (sum, item) => sum + item.quantity * item.cost,
      0
    );
    try {
      await axios.post("/api/purchase-orders", {
        supplier: form.supplierId,
        orderDate: form.orderDate,
        status: form.status,
        delivery_date: form.delivery_date,
        payment_status: form.payment_status,
        total_amount: totalAmount,
        priority: form.priority,
        expected_delivery: form.expected_delivery,
        approval_status: form.approval_status,
        linked_documents: form.linked_documents,
        last_updated_by: form.last_updated_by,
        items: form.items.map((item) => ({
          material: item.materialId,
          quantity: item.quantity,
          cost: item.cost,
        })),
      });
      navigate("/dashboard/purchase");
    } catch (error) {
      console.error("Error creating purchase order:", error);
      alert("Error creating purchase order");
    }
  };
  
  return (
    <Box maxWidth={800} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Purchase Order
      </Typography>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa", borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Main Fields */}
            <FormControl fullWidth required>
              <InputLabel>Supplier</InputLabel>
              <Select
                value={form.supplierId}
                onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                label="Supplier"
              >
                <MenuItem value="">Select Supplier</MenuItem>
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
              value={form.orderDate}
              onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as PurchaseOrderInput["status"] })
                }
                label="Status"
              >
                <MenuItem value="Ordered">Ordered</MenuItem>
                <MenuItem value="Received">Received</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
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
                value={form.payment_status || ""}
                onChange={(e) =>
                  setForm({ ...form, payment_status: e.target.value as PurchaseOrderInput["payment_status"] })
                }
                label="Payment Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
              </Select>
            </FormControl>


            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={form.priority || ""}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value as PurchaseOrderInput["priority"] })
                }
                label="Priority"
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
                value={form.approval_status || ""}
                onChange={(e) =>
                  setForm({ ...form, approval_status: e.target.value as PurchaseOrderInput["approval_status"] })
                }
                label="Approval Status"
              >
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Linked Documents (comma separated)"
              value={(form.linked_documents || []).join(", ")}
              onChange={(e) =>
                setForm({ ...form, linked_documents: e.target.value.split(",").map((d) => d.trim()) })
              }
              fullWidth
            />

<FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Last Updated By</InputLabel>
            <Select
              label="Last Updated By"
              value={form.last_updated_by}
              onChange={(e) => setForm({ ...form, last_updated_by: e.target.value })}
            >
              <MenuItem value="">Select Employee</MenuItem>
              {employees.map((emp) => (
                <MenuItem key={emp._id} value={emp._id}>
                  {emp.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
            <Typography variant="h6">Items</Typography>
            {form.items.map((item, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ borderBottom: "1px solid #e0e0e0", pb: 1 }}
              >
                <FormControl fullWidth>
                  <InputLabel>Material</InputLabel>
                  <Select
                    value={item.materialId}
                    onChange={(e) => handleItemChange(index, "materialId", e.target.value)}
                    label="Material"
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
                  label="Qty"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                  required
                  fullWidth
                />

                <TextField
                  label="Cost"
                  type="number"
                  value={item.cost}
                  onChange={(e) => handleItemChange(index, "cost", Number(e.target.value))}
                  required
                  fullWidth
                />

                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => {
                    const updated = [...form.items];
                    updated.splice(index, 1);
                    setForm({ ...form, items: updated });
                  }}
                  disabled={form.items.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}

            <Button
              variant="text"
              color="primary"
              onClick={() =>
                setForm({ ...form, items: [...form.items, { materialId: "", quantity: 0, cost: 0 }] })
              }
            >
              + Add Item
            </Button>

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button variant="contained" color="success" type="submit">
                Save Purchase Order
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => navigate("/dashboard/purchase")}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default PurchaseOrderForm;

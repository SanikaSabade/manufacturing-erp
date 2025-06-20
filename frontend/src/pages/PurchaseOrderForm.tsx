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

interface Item {
  materialId: string;
  quantity: number;
  cost: number;
}

interface PurchaseOrderInput {
  supplierId: string;
  orderDate: string;
  status: "Ordered" | "Received" | "Cancelled";
  items: Item[];
}

const PurchaseOrderForm: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [form, setForm] = useState<PurchaseOrderInput>({
    supplierId: "",
    orderDate: "",
    status: "Ordered",
    items: [{ materialId: "", quantity: 0, cost: 0 }],
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/suppliers").then((res) => setSuppliers(res.data));
    axios.get("/api/materials").then((res) => setMaterials(res.data));
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
      alert("Please fill in all fields correctly before submitting.");
      return;
    }
    try {
      await axios.post("/api/purchase-orders", {
        supplier: form.supplierId,
        orderDate: form.orderDate,
        status: form.status,
        items: form.items.map((item) => ({
          material: item.materialId,
          quantity: item.quantity,
          cost: item.cost,
        })),
      });
      navigate("/dashboard/purchase");
    } catch (error) {
      console.error("Error adding purchase order:", error);
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
                setForm({
                  ...form,
                  items: [...form.items, { materialId: "", quantity: 0, cost: 0 }],
                })
              }
            >
              + Add Item
            </Button>

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button variant="contained" color="success" type="submit">
                Save Purchase Order
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/purchase")}
              >
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

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

const SalesOrderForm: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState({
    customerId: "",
    orderNumber: "",
    date: "",
    status: "Pending",
    items: [{ quantity: 1, price: 0 }],
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Customer[]>(`${import.meta.env.VITE_BACKEND_URL}api/customers`)
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Failed to load customers:", err));
  }, []);

  const handleItemChange = (index: number, field: "quantity" | "price", value: number) => {
    const updatedItems = [...form.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setForm({ ...form, items: updatedItems });
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { quantity: 1, price: 0 }] });
  };

  const removeItem = (index: number) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updatedItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/sales-orders`, {
        customer: form.customerId,
        orderNumber: form.orderNumber,
        date: form.date,
        status: form.status,
        items: form.items,
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
            <InputLabel>Select Customer</InputLabel>
            <Select
              required
              label="Select Customer"
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
            label="Order Number"
            value={form.orderNumber}
            onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          <TextField
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            fullWidth
            required
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

          <Typography variant="h6" mt={3} mb={1}>
            Items
          </Typography>

          {form.items.map((item, index) => (
            <Box key={index} display="flex" gap={2} alignItems="center" mb={2}>
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
            <Button
               variant="outlined"
                color="inherit"
              onClick={() => navigate("/dashboard/sales")}
            >
              Cancel
            </Button>
            </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default SalesOrderForm;

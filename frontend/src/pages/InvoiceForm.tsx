import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Paper,
  type SelectChangeEvent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface SalesOrder {
  _id: string;
  orderNumber: string;
}

interface Invoice {
  invoiceNumber: string;
  salesOrder: string;
  issueDate: string;
  paymentStatus: "Unpaid" | "Paid" | "Overdue";
  pdfUrl?: string;
}

const InvoiceForm: React.FC = () => {
  const [form, setForm] = useState<Invoice>({
    invoiceNumber: "",
    salesOrder: "",
    issueDate: "",
    paymentStatus: "Unpaid",
    pdfUrl: "",
  });
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<SalesOrder[]>(`${import.meta.env.VITE_BACKEND_URL}api/sales-orders`)
      .then((res) => setSalesOrders(res.data))
      .catch(console.error);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/invoices`, form);
      navigate("/dashboard/sales/invoices");
    } catch (err) {
      console.error("Failed to create invoice", err);
    }
  };

  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add New Invoice
      </Typography>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa" }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              name="invoiceNumber"
              label="Invoice Number"
              value={form.invoiceNumber}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Select Sales Order</InputLabel>
              <Select
                name="salesOrder"
                value={form.salesOrder}
                onChange={handleSelectChange}
                label="Select Sales Order"
              >
                <MenuItem value="">Select Sales Order</MenuItem>
                {salesOrders.map((order) => (
                  <MenuItem key={order._id} value={order._id}>
                    {order.orderNumber}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="issueDate"
              label="Issue Date"
              type="date"
              value={form.issueDate}
              onChange={handleInputChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth required>
              <InputLabel>Payment Status</InputLabel>
              <Select
                name="paymentStatus"
                value={form.paymentStatus}
                onChange={handleSelectChange}
                label="Payment Status"
              >
                <MenuItem value="Unpaid">Unpaid</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="pdfUrl"
              label="PDF URL (optional)"
              value={form.pdfUrl}
              onChange={handleInputChange}
              fullWidth
            />

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button variant="contained" color="success" type="submit">
                Save Invoice
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/sales/invoices")}
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

export default InvoiceForm;

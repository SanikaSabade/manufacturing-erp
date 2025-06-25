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
interface Employee {
  _id: string;
  name: string;
}
interface InvoiceFormData {
  invoiceNumber: string;
  salesOrder: string;
  issueDate: string;
  paymentStatus: "Unpaid" | "Paid" | "Overdue";
  pdfUrl?: string;
  total_amount: number;
  terms_conditions: string;
  discounts: number;
  dueDate?: string;
  received_by: string;
  tax_details: {
    gst_rate: number;
    cgst: number;
    sgst: number;
    igst: number;
    other_taxes: number;
  };
}

const InvoiceForm: React.FC = () => {
  const [form, setForm] = useState<InvoiceFormData>({
    invoiceNumber: "",
    salesOrder: "",
    issueDate: "",
    paymentStatus: "Unpaid",
    pdfUrl: "",
    total_amount: 0,
    terms_conditions: "",
    discounts: 0,
    dueDate: "",
    received_by: "",
    tax_details: {
      gst_rate: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      other_taxes: 0,
    },
  });
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<SalesOrder[]>(`${import.meta.env.VITE_BACKEND_URL}api/sales-orders`)
      .then((res) => setSalesOrders(res.data))
      .catch(console.error);

    axios
      .get<Employee[]>(`${import.meta.env.VITE_BACKEND_URL}api/employees`)
      .then((res) => setEmployees(res.data))
      .catch(console.error);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name in form.tax_details) {
      setForm((prev) => ({
        ...prev,
        tax_details: {
          ...prev.tax_details,
          [name]: Number(value),
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
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

            <TextField
              name="total_amount"
              label="Total Amount"
              type="number"
              value={form.total_amount}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <TextField
              name="discounts"
              label="Discounts"
              type="number"
              value={form.discounts}
              onChange={handleInputChange}
              fullWidth
            />

            <TextField
              name="terms_conditions"
              label="Terms & Conditions"
              value={form.terms_conditions}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              name="dueDate"
              label="Due Date"
              type="date"
              value={form.dueDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Received By</InputLabel>
              <Select
                name="received_by"
                value={form.received_by}
                onChange={handleSelectChange}
                label="Received By"
              >
                <MenuItem value="">Select Employee</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" fontWeight="bold" mt={2}>
              Tax Details
            </Typography>
            <TextField
              name="gst_rate"
              label="GST Rate"
              type="number"
              value={form.tax_details.gst_rate}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="cgst"
              label="CGST"
              type="number"
              value={form.tax_details.cgst}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="sgst"
              label="SGST"
              type="number"
              value={form.tax_details.sgst}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="igst"
              label="IGST"
              type="number"
              value={form.tax_details.igst}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="other_taxes"
              label="Other Taxes"
              type="number"
              value={form.tax_details.other_taxes}
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

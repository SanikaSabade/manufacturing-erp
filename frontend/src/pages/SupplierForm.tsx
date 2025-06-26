import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

const SupplierForm: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gstNumber: "",
    contact_person: "",
    billing_address: "",
    credit_limit: 0,
    payment_terms: "",
    bank_details: "",
    pan_number: "",
    documents: "",
  });
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name: string; value: any }>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/suppliers", {
        ...form,
        credit_limit: Number(form.credit_limit),
        documents: form.documents
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean),
      });
      navigate("/dashboard/purchase/suppliers");
    } catch (error) {
      console.error("Failed to add supplier:", error);
    }
  };
  
  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add New Supplier
      </Typography>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa", borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="GST Number"
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Contact Person"
              name="contact_person"
              value={form.contact_person}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Billing Address"
              name="billing_address"
              value={form.billing_address}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Credit Limit"
              name="credit_limit"
              value={form.credit_limit}
              onChange={handleChange}
              required
              fullWidth
              type="number"
            />
            <TextField
              label="Payment Terms"
              name="payment_terms"
              value={form.payment_terms}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Bank Details"
              name="bank_details"
              value={form.bank_details}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="PAN Number"
              name="pan_number"
              value={form.pan_number}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Documents (comma separated URLs)"
              name="documents"
              value={form.documents}
              onChange={handleChange}
              fullWidth
            />

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button variant="contained" color="success" type="submit">
                Add Supplier
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/purchase/suppliers")}
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

export default SupplierForm;

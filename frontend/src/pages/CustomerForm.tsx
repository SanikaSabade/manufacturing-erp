import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axios";

interface Customer {
  name: string;
  email: string;
  phone: string;
  gstNumber: string;
  address: string;
}

const CustomerForm: React.FC = () => {
  const [form, setForm] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
    gstNumber: "",
    address: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}api/customers/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error("Failed to load customer:", err));
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/customers/${id}`, form);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/customers`, form);
      }
      navigate("/dashboard/sales/customers");
    } catch (err) {
      console.error("Save failed:", err);
    }
  };
  
  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {id ? "Edit Customer" : "Add Customer"}
      </Typography>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa" }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              name="name"
              label="Name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="phone"
              label="Phone"
              value={form.phone}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="gstNumber"
              label="GST Number"
              value={form.gstNumber}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="address"
              label="Address"
              value={form.address}
              onChange={handleChange}
              required
              fullWidth
            />

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button
                variant="contained"
                color="success"
                type="submit"
              >
                {id ? "Update" : "Add"}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/sales/customers")}
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

export default CustomerForm;

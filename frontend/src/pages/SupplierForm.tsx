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
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/suppliers", form);
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
            {["name", "email", "phone", "address", "gstNumber"].map((field) => (
              <TextField
                key={field}
                label={field
                  .replace(/([A-Z])/g, " $1") 
                  .replace(/^./, (str) => str.toUpperCase())}
                value={(form as any)[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
                fullWidth
              />
            ))}

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

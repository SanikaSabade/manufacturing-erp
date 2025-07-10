import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

interface Employee {
  _id: string;
  name: string;
}

const PaymentForm: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: "Outgoing",
    amount: "",
    reference: "",
    date: "",
    mode: "",
    notes: "",
    approved_by: "",
  });
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/employees`);
        setEmployees(res.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<{ value: unknown }>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value as string }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/payments`, {
        ...form,
        amount: parseFloat(form.amount),
      });
      navigate("/dashboard/finance");
    } catch (err) {
      console.error("Error adding payment:", err);
      alert("Failed to add payment.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Payment
      </Typography>

      <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa", borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={form.type}
                onChange={handleSelectChange}
                label="Type"
              >
                <MenuItem value="Outgoing">Outgoing</MenuItem>
                <MenuItem value="Incoming">Incoming</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Amount (₹)"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              fullWidth
              type="number"
            />

            <TextField
              label="Reference Number"
              name="reference"
              value={form.reference}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Mode"
              name="mode"
              value={form.mode}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Approved By</InputLabel>
              <Select
                name="approved_by"
                value={form.approved_by}
                onChange={handleSelectChange}
                label="Approved By"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button
                variant="contained"
                color="success"
                disabled={loading}
                type="submit"
              >
                {loading ? "Adding..." : "Add Payment"}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/finance")}
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

export default PaymentForm;

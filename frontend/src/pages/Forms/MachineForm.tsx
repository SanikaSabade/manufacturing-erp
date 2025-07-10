import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Box,
} from "@mui/material";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

interface Employee {
  _id: string;
  name: string;
}

const MachineForm: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({
    machine_name: "",
    model: "",
    capacity: "",
    maintenance_date: "",
    operator_id: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/employees`);
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/machines`, {
        ...form,
        capacity: Number(form.capacity),
      });
      navigate("/dashboard/inventory/machine");
    } catch (err) {
      console.error("Error adding machine:", err);
      alert("Failed to add machine.");
    }
  };

  return (
    <Box maxWidth={700} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add New Machine
      </Typography>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa", borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Machine Name"
              name="machine_name"
              value={form.machine_name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Model"
              name="model"
              value={form.model}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Capacity"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              type="number"
              fullWidth
            />
            <TextField
              label="Maintenance Date"
              name="maintenance_date"
              value={form.maintenance_date}
              onChange={handleChange}
              required
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel>Operator</InputLabel>
              <Select
                name="operator_id"
                value={form.operator_id}
                onChange={handleSelectChange}
                label="Operator"
              >
                <MenuItem value="">Select Employee</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" color="success" type="submit">
                Save Machine
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/inventory/machine")}
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

export default MachineForm;

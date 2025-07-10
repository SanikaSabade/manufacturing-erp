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
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

interface Machine {
  _id: string;
  machine_name: string;
}

const WorkOrderForm: React.FC = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [form, setForm] = useState({
    orderNumber: `WO-${Date.now()}`, 
    machine_id: "",
    shift: "Morning",
    planned_start_date: "",
    planned_end_date: "",
    actual_start_date: "",
    actual_end_date: "",
  });

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/machines`);
        setMachines(res.data);
      } catch (error) {
        console.error("Error fetching machines:", error);
      }
    };
    fetchMachines();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/work-orders`, {
        ...form,
        actual_start_date: form.actual_start_date || undefined,
        actual_end_date: form.actual_end_date || undefined,
      });
      navigate("/dashboard/inventory/workOrders");
    } catch (err) {
      console.error("Error creating work order:", err);
      alert("Failed to create work order.");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Work Order
      </Typography>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa", borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl fullWidth required>
              <InputLabel>Machine</InputLabel>
              <Select
                name="machine_id"
                value={form.machine_id}
                onChange={handleSelectChange}
                label="Machine"
              >
                <MenuItem value="">Select Machine</MenuItem>
                {machines.map((machine) => (
                  <MenuItem key={machine._id} value={machine._id}>
                    {machine.machine_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Shift</InputLabel>
              <Select
                name="shift"
                value={form.shift}
                onChange={handleSelectChange}
                label="Shift"
              >
                <MenuItem value="Morning">Morning</MenuItem>
                <MenuItem value="Evening">Evening</MenuItem>
                <MenuItem value="Night">Night</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="planned_start_date"
              label="Planned Start Date"
              type="date"
              value={form.planned_start_date}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="planned_end_date"
              label="Planned End Date"
              type="date"
              value={form.planned_end_date}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="actual_start_date"
              label="Actual Start Date"
              type="date"
              value={form.actual_start_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="actual_end_date"
              label="Actual End Date"
              type="date"
              value={form.actual_end_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button variant="contained" color="success" type="submit">
                Save Work Order
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/inventory/workOrders")}
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

export default WorkOrderForm;

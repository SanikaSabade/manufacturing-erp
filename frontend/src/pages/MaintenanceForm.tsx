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
import axios from "../utils/axios";

interface Machine {
  _id: string;
  machine_name: string;
}

const MaintenanceLogForm: React.FC = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [form, setForm] = useState({
    machine_id: "",
    maintenance_type: "",
    cost: "",
    downtime_hours: "",
    remarks: "",
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
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/maintenance-logs`, {
        ...form,
        cost: parseFloat(form.cost),
        downtime_hours: parseFloat(form.downtime_hours),
      });
      navigate("/dashboard/inventory/maintenanceLogs");
    } catch (err) {
      console.error("Error adding maintenance log:", err);
      alert("Failed to save maintenance log.");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Maintenance Log
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

            <TextField
              name="maintenance_type"
              label="Maintenance Type"
              value={form.maintenance_type}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              name="cost"
              label="Cost"
              type="number"
              value={form.cost}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              name="downtime_hours"
              label="Downtime Hours"
              type="number"
              value={form.downtime_hours}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              name="remarks"
              label="Remarks"
              value={form.remarks}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button variant="contained" color="success" type="submit">
                Save Log
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/inventory/maintenanceLogs")}
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

export default MaintenanceLogForm;

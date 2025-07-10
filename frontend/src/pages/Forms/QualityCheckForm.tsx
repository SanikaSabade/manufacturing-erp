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

interface Employee {
  _id: string;
  name: string;
}

interface WorkOrder {
  _id: string;
  orderNumber: string;
}

const QualityCheckForm: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  const [form, setForm] = useState({
    work_order_id: "",
    inspected_by: "",
    qc_result: "",
    remarks: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, woRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}api/employees`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}api/work-orders`),
        ]);
        setEmployees(empRes.data || []);
        setWorkOrders(woRes.data || []);
      } catch (err) {
        console.error("Error fetching employees or work orders:", err);
      }
    };

    fetchData();
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
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/quality-checks`, form);
      navigate("/dashboard/inventory/qualityChecks");
    } catch (err) {
      console.error("Error submitting quality check:", err);
      alert("Failed to submit quality check.");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Quality Check
      </Typography>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa", borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl fullWidth required>
              <InputLabel>Work Order</InputLabel>
              <Select
                name="work_order_id"
                value={form.work_order_id}
                onChange={handleSelectChange}
                label="Work Order"
              >
                {workOrders.length === 0 ? (
                  <MenuItem disabled>No work orders found</MenuItem>
                ) : (
                  workOrders.map((wo) => (
                    <MenuItem key={wo._id} value={wo._id}>
                      {wo.orderNumber}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Inspected By</InputLabel>
              <Select
                name="inspected_by"
                value={form.inspected_by}
                onChange={handleSelectChange}
                label="Inspected By"
              >
                {employees.length === 0 ? (
                  <MenuItem disabled>No employees found</MenuItem>
                ) : (
                  employees.map((emp) => (
                    <MenuItem key={emp._id} value={emp._id}>
                      {emp.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <TextField
              name="qc_result"
              label="QC Result"
              value={form.qc_result}
              onChange={handleChange}
              required
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
                Save Quality Check
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/inventory/qualityChecks")}
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

export default QualityCheckForm;

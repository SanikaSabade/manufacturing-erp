import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    salary: "",
    joinDate: "",
    status: "Active",
    end_date: "",
    skill_set: "",
    shift: "",
    supervisor_id: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name: string; value: any }>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/employees`, {
        ...formData,
        salary: parseFloat(formData.salary),
        end_date: formData.end_date || null,
        skill_set: formData.skill_set
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v),
      });
      navigate("/dashboard/hr");
    } catch (err) {
      console.error("Add failed", err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add New Employee
      </Typography>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa", borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              type="email"
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              fullWidth
              type="number"
            />
            <TextField
              label="Join Date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
              required
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Skill Set (comma separated)"
              name="skill_set"
              value={formData.skill_set}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Shift"
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Supervisor ID"
              name="supervisor_id"
              value={formData.supervisor_id}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              fullWidth
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button
                variant="contained"
                color="success"
                disabled={loading}
                type="submit"
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/hr")}
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

export default EmployeeForm;

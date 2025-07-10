import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  FormControl,
  InputLabel,
  Select,
  Paper,
  type SelectChangeEvent,
} from "@mui/material";

interface Material {
  _id: string;
  material_name: string;
}

interface User {
  _id: string;
  name: string;
}

const InventoryForm: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    material_id: "",
    change_type: "add",
    quantity_changed: "",
    reason: "",
    date: "",
    user_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialRes, userRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}api/materials`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}api/users`),
        ]);
        setMaterials(materialRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error("Failed to load materials or users", err);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/inventory-logs`, formData);
      navigate("/dashboard/inventory");
    } catch (error) {
      console.error("Error adding inventory log:", error);
    }
  };
  
  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Inventory Log
      </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: "#fafafa" }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl fullWidth required>
              <InputLabel>Material</InputLabel>
              <Select
                name="material_id"
                value={formData.material_id}
                onChange={handleSelectChange}
                label="Material"
              >
                {materials.map((mat) => (
                  <MenuItem key={mat._id} value={mat._id}>
                    {mat.material_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Change Type</InputLabel>
              <Select
                name="change_type"
                value={formData.change_type}
                onChange={handleSelectChange}
                label="Change Type"
              >
                <MenuItem value="add">Add</MenuItem>
                <MenuItem value="remove">Remove</MenuItem>
                <MenuItem value="adjust">Adjust</MenuItem>
                <MenuItem value="transfer">Transfer</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Quantity Changed"
              name="quantity_changed"
              value={formData.quantity_changed}
              onChange={handleInputChange}
              required
              fullWidth
              type="number"
            />

            <TextField
              label="Reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <TextField
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth required>
              <InputLabel>User</InputLabel>
              <Select
                name="user_id"
                value={formData.user_id}
                onChange={handleSelectChange}
                label="User"
              >
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button variant="contained" color="success" type="submit">
                Add Log
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/inventory")}
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

export default InventoryForm;

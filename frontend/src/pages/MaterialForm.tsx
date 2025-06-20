import React, { useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
  Card,
  CardContent,
  CardHeader,
  type SelectChangeEvent,
} from "@mui/material";

const MaterialForm: React.FC = () => {
  const [form, setForm] = useState({
    material_name: "",
    material_code: "",
    category: "Raw",
    unit: "",
    quantity_available: "",
    reorder_level: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, category: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/materials`, form);
      navigate("/dashboard/inventory/material");
    } catch (error) {
      console.error("Failed to add material:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, bgcolor: "#fafafa" }}>
        <CardHeader
          title="Add New Material"
          titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Material Name"
                name="material_name"
                value={form.material_name}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                label="Material Code"
                name="material_code"
                value={form.material_code}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={form.category}
                  onChange={handleSelectChange}
                   label="Category"
                >
                  <MenuItem value="Raw">Raw</MenuItem>
                  <MenuItem value="Semi-finished">Semi-finished</MenuItem>
                  <MenuItem value="Finished">Finished</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Unit (e.g., kg, pcs)"
                name="unit"
                value={form.unit}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                label="Quantity Available"
                name="quantity_available"
                value={form.quantity_available}
                onChange={handleInputChange}
                required
                fullWidth
                type="number"
              />
              <TextField
                label="Reorder Level"
                name="reorder_level"
                value={form.reorder_level}
                onChange={handleInputChange}
                required
                fullWidth
                type="number"
              />
              <TextField
                label="Location"
                name="location"
                value={form.location}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Stack direction="row" justifyContent="center" spacing={2}>
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Material"}
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate("/dashboard/inventory/material")}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MaterialForm;

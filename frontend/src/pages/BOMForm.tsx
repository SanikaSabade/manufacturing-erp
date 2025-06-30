import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

interface Employee {
  _id: string;
  name: string;
}

interface Material {
  _id: string;
  material_name: string;
}

interface ComponentItem {
  material: string;
  quantity: number;
  unit: string;
}

const BOMForm: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [form, setForm] = useState({
    product_name: "",
    created_by: "",
    components: [{ material: "", quantity: 1, unit: "" }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, matRes] = await Promise.all([
          axios.get("/api/employees"),
          axios.get("/api/materials"),
        ]);
        setEmployees(empRes.data);
        setMaterials(matRes.data);
      } catch (err) {
        console.error("Error loading employees or materials:", err);
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

  const handleComponentChange = (
    index: number,
    field: keyof ComponentItem,
    value: string | number
  ) => {
    const updated = [...form.components];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, components: updated }));
  };

  const addComponent = () => {
    setForm((prev) => ({
      ...prev,
      components: [...prev.components, { material: "", quantity: 1, unit: "" }],
    }));
  };

  const removeComponent = (index: number) => {
    setForm((prev) => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.product_name ||
      !form.created_by ||
      form.components.some(
        (comp) => !comp.material || !comp.unit || comp.quantity <= 0
      )
    ) {
      alert("Please fill all fields correctly.");
      return;
    }

    try {
      await axios.post("/api/bom", form);
      navigate("/dashboard/inventory/bom");
    } catch (error) {
      console.error("Error creating BOM:", error);
      alert("Failed to create BOM");
    }
  };

  return (
    <Box maxWidth={800} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add New BOM
      </Typography>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa" }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Product Name"
              name="product_name"
              value={form.product_name}
              onChange={handleChange}
              fullWidth
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Created By</InputLabel>
              <Select
                name="created_by"
                value={form.created_by}
                onChange={handleSelectChange}
                label="Created By"
              >
                <MenuItem value="">Select Employee</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6">Components</Typography>
            {form.components.map((comp, index) => (
              <Stack
                key={index}
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
              >
                <FormControl fullWidth required>
                  <InputLabel>Material</InputLabel>
                  <Select
                    value={comp.material}
                    onChange={(e) =>
                      handleComponentChange(index, "material", e.target.value)
                    }
                    label="Material"
                  >
                    <MenuItem value="">Select Material</MenuItem>
                    {materials.map((mat) => (
                      <MenuItem key={mat._id} value={mat._id}>
                        {mat.material_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Quantity"
                  type="number"
                  value={comp.quantity}
                  onChange={(e) =>
                    handleComponentChange(index, "quantity", Number(e.target.value))
                  }
                  required
                />

                <TextField
                  label="Unit"
                  value={comp.unit}
                  onChange={(e) =>
                    handleComponentChange(index, "unit", e.target.value)
                  }
                  required
                />

                {form.components.length > 1 && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeComponent(index)}
                  >
                    Remove
                  </Button>
                )}
              </Stack>
            ))}

            <Button variant="outlined" onClick={addComponent}>
              + Add Component
            </Button>

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button variant="contained" color="success" type="submit">
                Save BOM
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/inventory/bom")}
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

export default BOMForm;

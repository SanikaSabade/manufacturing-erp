import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import {
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  type SelectChangeEvent
} from "@mui/material";

interface Material {
  _id: string;
  name: string;
}

interface Employee {
  _id: string;
  name: string;
}

interface ComponentItem {
  material: string;
  quantity: number;
  unit?: string;
}

interface BOM {
  _id: string;
  product_name: string;
  components: ComponentItem[];
  created_by: string;
  date_created: string;
}

const BOMPage: React.FC = () => {
  const [bomList, setBomList] = useState<BOM[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBOM, setEditingBOM] = useState<BOM | null>(null);

  useEffect(() => {
    fetchBOM();
    fetchMaterials();
    fetchEmployees();
  }, []);

  const fetchBOM = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/bom`);
      setBomList(res.data);
    } catch (err) {
      console.error("Error fetching BOM:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchMaterials = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/materials`);
    setMaterials(res.data);
  };
  const fetchEmployees = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/employees`);
    setEmployees(res.data);
  };
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!editingBOM) return;
    const { name, value } = e.target;
    setEditingBOM({ ...editingBOM, [name]: value });
  };

  const handleEditSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setEditingBOM((prev) =>
      prev ? { ...prev, [name]: value } : null
    );
  };

  const handleEditComponentChange = (index: number, field: keyof ComponentItem, value: any) => {
    if (!editingBOM) return;
    const updatedComponents = [...editingBOM.components];
    updatedComponents[index] = { ...updatedComponents[index], [field]: value };
    setEditingBOM({ ...editingBOM, components: updatedComponents });
  };
  const addComponent = () => {
    if (!editingBOM) return;
    setEditingBOM({
      ...editingBOM,
      components: [...editingBOM.components, { material: "", quantity: 1, unit: "" }],
    });
  };
  const removeComponent = (index: number) => {
    if (!editingBOM) return;
    const updated = editingBOM.components.filter((_, i) => i !== index);
    setEditingBOM({ ...editingBOM, components: updated });
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBOM) return;

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/bom/${editingBOM._id}`, editingBOM);
      setEditingBOM(null);
      fetchBOM();
    } catch (err) {
      console.error("Error updating BOM:", err);
    }
  };
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this BOM?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/bom/${id}`);
        fetchBOM();
      } catch (err) {
        console.error("Error deleting BOM:", err);
      }
    }
  };
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">BOM List</h1>
        </div>

        {editingBOM && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Edit BOM
            </Typography>
            <form onSubmit={handleEditSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Product Name"
                  name="product_name"
                  value={editingBOM.product_name}
                  onChange={handleEditChange}
                  required
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Created By</InputLabel>
                  <Select
                    name="created_by"
                    value={editingBOM.created_by}
                    onChange={handleEditSelectChange}
                    label="Created By"
                  >
                    {employees.map((emp) => (
                      <MenuItem key={emp._id} value={emp._id}>
                        {emp.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div>
                  <Typography variant="subtitle1">Components</Typography>
                  {editingBOM.components.map((comp, index) => (
                    <div key={index} className="flex space-x-3 items-center mt-2">
                      <FormControl fullWidth>
                        <InputLabel>Material</InputLabel>
                        <Select
                          value={comp.material}
                          onChange={(e) => handleEditComponentChange(index, "material", e.target.value)}
                          label="Material"
                        >
                          {materials.map((mat) => (
                            <MenuItem key={mat._id} value={mat._id}>
                              {mat.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        label="Quantity"
                        type="number"
                        value={comp.quantity}
                        onChange={(e) => handleEditComponentChange(index, "quantity", Number(e.target.value))}
                      />
                      <TextField
                        label="Unit"
                        value={comp.unit}
                        onChange={(e) => handleEditComponentChange(index, "unit", e.target.value)}
                      />
                      <IconButton color="error" onClick={() => removeComponent(index)}>
                        Remove
                      </IconButton>
                    </div>
                  ))}
                  <Button variant="outlined" onClick={addComponent}>
                    + Add Component
                  </Button>
                </div>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="success" type="submit">
                    Save Changes
                  </Button>
                  <Button variant="contained" color="inherit" onClick={() => setEditingBOM(null)}>
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">BOM List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date Created</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Components</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bomList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      No BOM found
                    </td>
                  </tr>
                ) : (
                  bomList.map((bom) => (
                    <tr key={bom._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{bom.product_name}</td>
                      <td className="px-6 py-4">
                        {employees.find((emp) => emp._id === bom.created_by)?.name || "—"}
                      </td>
                      <td className="px-6 py-4">{new Date(bom.date_created).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        {bom.components.map((comp) => (
                          <div key={comp.material}>
                            • {materials.find((mat) => mat._id === comp.material)?.name} ({comp.quantity}
                            {comp.unit})
                          </div>
                        ))}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingBOM(bom)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(bom._id)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BOMPage;

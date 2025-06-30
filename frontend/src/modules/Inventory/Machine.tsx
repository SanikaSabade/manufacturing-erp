import React, { useEffect, useState } from "react";
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
} from "@mui/material";

interface Employee {
  _id: string;
  name: string;
}

interface Machine {
  _id: string;
  machine_name: string;
  model?: string;
  capacity?: number;
  maintenance_date: string;
  operator_id?: { _id: string; name: string };
  createdAt: string;
}

const Machines: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

  useEffect(() => {
    fetchMachines();
    fetchEmployees();
  }, []);

  const fetchMachines = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/machines`);
      setMachines(res.data);
    } catch (err) {
      console.error("Error fetching machines:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/employees`);
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this machine?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/machines/${id}`);
        fetchMachines();
      } catch (err) {
        console.error("Failed to delete machine:", err);
      }
    }
  };
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditingMachine((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "capacity" ? Number(value) : value,
          }
        : null
    );
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMachine) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/machines/${editingMachine._id}`,
        editingMachine
      );
      setEditingMachine(null);
      fetchMachines();
    } catch (err) {
      console.error("Error updating machine:", err);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Machines</h1>

        {editingMachine && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-4">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Edit Machine
            </Typography>
            <form onSubmit={handleEditSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Machine Name"
                  name="machine_name"
                  value={editingMachine.machine_name}
                  onChange={handleEditChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Model"
                  name="model"
                  value={editingMachine.model || ""}
                  onChange={handleEditChange}
                  fullWidth
                />
                <TextField
                  label="Capacity"
                  name="capacity"
                  value={editingMachine.capacity || ""}
                  onChange={handleEditChange}
                  fullWidth
                  type="number"
                />
                <TextField
                  label="Maintenance Date"
                  name="maintenance_date"
                  value={editingMachine.maintenance_date.slice(0, 10)}
                  onChange={handleEditChange}
                  required
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    name="operator_id"
                    value={editingMachine.operator_id?._id || ""}
                    onChange={(e) =>
                      setEditingMachine((prev) =>
                        prev
                          ? {
                              ...prev,
                              operator_id: { _id: e.target.value, name: "" },
                            }
                          : null
                      )
                    }
                    label="Operator"
                  >
                    <MenuItem value="">None</MenuItem>
                    {employees.map((emp) => (
                      <MenuItem key={emp._id} value={emp._id}>
                        {emp.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="success" type="submit">
                    Save Changes
                  </Button>
                  <Button variant="contained" color="inherit" onClick={() => setEditingMachine(null)}>
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Machine List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Machine Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Maintenance Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operator
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {machines.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      No machines found
                    </td>
                  </tr>
                ) : (
                  machines.map((machine) => (
                    <tr
                      key={machine._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">{machine.machine_name}</td>
                      <td className="px-6 py-4">{machine.model || "—"}</td>
                      <td className="px-6 py-4">{machine.capacity || "—"}</td>
                      <td className="px-6 py-4">
                        {new Date(machine.maintenance_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
  {typeof machine.operator_id === "object" && "name" in machine.operator_id
    ? machine.operator_id.name
    : "—"}
</td>

                      <td className="px-6 py-4">
                        {new Date(machine.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingMachine(machine)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(machine._id)}
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

export default Machines;

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

interface Machine {
  _id: string;
  machine_name: string;
}

interface MaintenanceLog {
  _id: string;
  machine_id: { _id: string; machine_name: string };
  maintenance_type: string;
  cost?: number;
  downtime_hours?: number;
  remarks?: string;
  createdAt: string;
}

const MaintenanceLogs: React.FC = () => {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLog, setEditingLog] = useState<MaintenanceLog | null>(null);

  useEffect(() => {
    fetchLogs();
    fetchMachines();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/maintenance-logs`);
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching maintenance logs:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchMachines = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/machines`);
      setMachines(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this maintenance log?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/maintenance-logs/${id}`);
        fetchLogs();
      } catch (err) {
        console.error("Error deleting maintenance log:", err);
      }
    }
  };
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditingLog((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "cost" || name === "downtime_hours" ? Number(value) : value,
          }
        : null
    );
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLog) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/maintenance-logs/${editingLog._id}`,
        editingLog
      );
      setEditingLog(null);
      fetchLogs();
    } catch (err) {
      console.error("Error updating maintenance log:", err);
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
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Logs</h1>

        {editingLog && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-4">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Edit Maintenance Log
            </Typography>
            <form onSubmit={handleEditSubmit}>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>Machine</InputLabel>
                  <Select
                    name="machine_id"
                    value={editingLog.machine_id._id}
                    onChange={(e) =>
                      setEditingLog((prev) =>
                        prev
                          ? {
                              ...prev,
                              machine_id: { _id: e.target.value, machine_name: "" },
                            }
                          : null
                      )
                    }
                    label="Machine"
                  >
                    {machines.map((machine) => (
                      <MenuItem key={machine._id} value={machine._id}>
                        {machine.machine_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Maintenance Type"
                  name="maintenance_type"
                  value={editingLog.maintenance_type}
                  onChange={handleEditChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Cost"
                  name="cost"
                  value={editingLog.cost || ""}
                  onChange={handleEditChange}
                  fullWidth
                  type="number"
                />
                <TextField
                  label="Downtime Hours"
                  name="downtime_hours"
                  value={editingLog.downtime_hours || ""}
                  onChange={handleEditChange}
                  fullWidth
                  type="number"
                />
                <TextField
                  label="Remarks"
                  name="remarks"
                  value={editingLog.remarks || ""}
                  onChange={handleEditChange}
                  fullWidth
                  multiline
                  rows={3}
                />
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="success" type="submit">
                    Save Changes
                  </Button>
                  <Button variant="contained" color="inherit" onClick={() => setEditingLog(null)}>
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Maintenance Logs List</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Machine</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Maintenance Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Downtime Hours</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      No maintenance logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">{log.machine_id.machine_name}</td>
                      <td className="px-6 py-4">{log.maintenance_type}</td>
                      <td className="px-6 py-4">₹{log.cost?.toFixed(2) || "—"}</td>
                      <td className="px-6 py-4">{log.downtime_hours || "—"}</td>
                      <td className="px-6 py-4">{log.remarks || "—"}</td>
                      <td className="px-6 py-4">{new Date(log.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingLog(log)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(log._id)}
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

export default MaintenanceLogs;

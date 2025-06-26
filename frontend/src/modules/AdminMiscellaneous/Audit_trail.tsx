import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Alert,
  MenuItem,
} from "@mui/material";
import axios from "../../utils/axios";

interface AuditTrail {
  _id: string;
  module: string;
  action_type: string;
  user_id?: string;
  createdAt: string;
}

interface Employee {
  _id: string;
  name: string;
}

const AuditTrail: React.FC = () => {
  const [entries, setEntries] = useState<AuditTrail[]>([]);
  const [loading, setLoading] = useState(true);
  const [editEntry, setEditEntry] = useState<AuditTrail | null>(null);
  const [formData, setFormData] = useState({
    module: "",
    action_type: "",
    user_id: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetchEntries();
    fetchEmployees();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await axios.get<AuditTrail[]>(`${import.meta.env.VITE_BACKEND_URL}api/audit-trail`);
      setEntries(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchEmployees = async () => {
    try {
      const res = await axios.get<Employee[]>(`${import.meta.env.VITE_BACKEND_URL}api/employees`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Employee fetch failed:", err);
    }
  };
  
  const handleEditClick = (entry: AuditTrail) => {
    setEditEntry(entry);
    setFormData({
      module: entry.module,
      action_type: entry.action_type,
      user_id: entry.user_id || "",
    });
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEntry) return;

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/audit-trail/${editEntry._id}`, formData);
      setEditEntry(null);
      await fetchEntries();
    } catch (err: any) {
      setError(err.response?.data?.error || "Update failed");
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/audit-trail/${id}`);
      setEntries(entries.filter((entry) => entry._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-blue-600"></div>
      </div>
    );
  }

  return (
    <Box maxWidth={1200} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Audit Trail
      </Typography>

      {editEntry && (
        <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa", borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Edit Audit Entry
          </Typography>
          <form onSubmit={handleUpdate}>
            <Stack spacing={3}>
              <TextField
                label="Module"
                value={formData.module}
                onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                required
              />
              <TextField
                label="Action Type"
                value={formData.action_type}
                onChange={(e) => setFormData({ ...formData, action_type: e.target.value })}
                required
              />
              <TextField
                select
                label="User"
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </TextField>
              {error && <Alert severity="error">{error}</Alert>}
              <Stack direction="row" justifyContent="start" spacing={2}>
                <Button variant="contained" color="success" type="submit">
                  Save Changes
                </Button>
                <Button variant="contained" color="inherit" onClick={() => setEditEntry(null)}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Entries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 ">
              <tr>
                {["Module", "Action Type", "User ID","Created At", "Actions"].map((title) => (
                  <th
                    key={title}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-12 text-center text-gray-500">
                    No Audit Entries Found
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry._id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{entry.module}</td>
                    <td className="px-3 py-2">{entry.action_type}</td>
                    <td className="px-3 py-2">
  {entry.user_id
    ? employees.find((emp) => emp._id === entry.user_id)?.name || entry.user_id
    : "—"}
</td>
<td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(entry.createdAt).toLocaleDateString()}</div>
                      </td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(entry)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(entry._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
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
    </Box>
  );
};

export default AuditTrail;

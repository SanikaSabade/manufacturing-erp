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

interface Notification {
  _id: string;
  type: string;
  message: string;
  user_id?: string;
  read_flag: boolean;
}

interface Employee {
  _id: string;
  name: string;
}

const NotificationPage: React.FC = () => {
  const [entries, setEntries] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editEntry, setEditEntry] = useState<Notification | null>(null);
  
  const [editData, setEditData] = useState({
    type: "",
    message: "",
    user_id: "",
    read_flag: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetchEntries();
    fetchEmployees();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await axios.get<Notification[]>(`${import.meta.env.VITE_BACKEND_URL}api/notifications`);
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
  
  const handleEditClick = (entry: Notification) => {
    setEditEntry(entry);
    setEditData({
      type: entry.type,
      message: entry.message,
      user_id: entry.user_id || "",
      read_flag: entry.read_flag,
    });
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEntry) return;

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/notifications/${editEntry._id}`, editData);
      setEditEntry(null);
      await fetchEntries();
    } catch (err: any) {
      setError(err.response?.data?.error || "Update failed");
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/notifications/${id}`);
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
        Notification Management
      </Typography>

      

      {editEntry && (
        <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa", borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Edit Notification
          </Typography>
          <form onSubmit={handleUpdate}>
            <Stack spacing={3}>
              <TextField
                label="Type"
                value={editData.type}
                onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                required
              />
              <TextField
                label="Message"
                value={editData.message}
                onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                required
                multiline
                rows={2}
              />
              <TextField
                select
                label="Employee"
                value={editData.user_id}
                onChange={(e) => setEditData({ ...editData, user_id: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Read?"
                value={editData.read_flag ? "true" : "false"}
                onChange={(e) => setEditData({ ...editData, read_flag: e.target.value === "true" })}
              >
                <MenuItem value="true">Read</MenuItem>
                <MenuItem value="false">Unread</MenuItem>
              </TextField>
              {error && <Alert severity="error">{error}</Alert>}
              <Stack direction="row" justifyContent="center" spacing={2}>
                <Button variant="contained" color="success" type="submit">
                  Save Changes
                </Button>
                <Button variant="outlined" color="inherit" onClick={() => setEditEntry(null)}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Type", "Message", "Employee", "Read?", "Actions"].map((title) => (
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
                  <td colSpan={5} className="px-3 py-12 text-center text-gray-500">
                    No Notifications Found
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry._id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{entry.type}</td>
                    <td className="px-3 py-2">{entry.message}</td>
                    <td className="px-3 py-2">
                      {entry.user_id
                        ? employees.find((emp) => emp._id === entry.user_id)?.name || entry.user_id
                        : "—"}
                    </td>
                    <td className="px-3 py-2">{entry.read_flag ? "Read" : "Unread"}</td>
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

export default NotificationPage;

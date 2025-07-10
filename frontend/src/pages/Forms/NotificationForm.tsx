import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";


interface Employee {
  _id: string;
  name: string;
}

const NotificationForm: React.FC = () => {
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [readFlag, setReadFlag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get<Employee[]>(`${import.meta.env.VITE_BACKEND_URL}api/employees`);
        setEmployees(res.data);
      } catch (err) {
        console.error("Employee fetch failed:", err);
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/notifications`, {
        type,
        message,
        user_id: userId || undefined,
        read_flag: readFlag,
      });
      navigate("/dashboard/admin/notification");
      setType("");
      setMessage("");
      setUserId("");
      setReadFlag(false);
    } catch (err: any) {
      setError(err.response?.data?.error || "Add failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add New Notification
      </Typography>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa", borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
            <TextField
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              multiline
              rows={3}
            />
            <TextField
              select
              label="Employee"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
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
              value={readFlag ? "true" : "false"}
              onChange={(e) => setReadFlag(e.target.value === "true")}
            >
              <MenuItem value="false">Unread</MenuItem>
              <MenuItem value="true">Read</MenuItem>
            </TextField>
            {error && <Alert severity="error">{error}</Alert>}
            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button
                variant="contained"
                color="success"
                type="submit"
                disabled={loading}
              >
                {loading ? "Adding…" : "Add Notification"}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/admin/notification")}
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

export default NotificationForm;

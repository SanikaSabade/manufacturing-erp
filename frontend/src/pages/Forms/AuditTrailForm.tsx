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

const AddAuditTrailForm: React.FC = () => {
  const [module, setModule] = useState<string>("");
  const [actionType, setActionType] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get<Employee[]>(
          `${import.meta.env.VITE_BACKEND_URL}api/employees`
        );
        setEmployees(res.data);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/audit-trail`, {
        module,
        action_type: actionType,
        user_id: userId,
      });
      navigate("/dashboard/admin/audit_trail");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add entry");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Audit Trail Entry
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          bgcolor: "#fafafa",
          borderRadius: 2,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Module"
              value={module}
              onChange={(e) => setModule(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Action Type"
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              required
              fullWidth
            />
            <TextField
              select
              label="User"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              fullWidth
            >
              {employees.map((emp) => (
                <MenuItem key={emp._id} value={emp._id}>
                  {emp.name}
                </MenuItem>
              ))}
            </TextField>

            {error && <Alert severity="error">{error}</Alert>}

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button
                variant="contained"
                color="success"
                type="submit"
                disabled={loading}
              >
                {loading ? "Adding…" : "Add Entry"}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/admin/audit_trail")}
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

export default AddAuditTrailForm;

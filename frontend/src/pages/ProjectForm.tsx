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
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const ProjectForm: React.FC = () => {
  const [project_name, setProjectName] = useState("");
  const [start_date, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [client_id, setClientId] = useState("");
  const [budget, setBudget] = useState<number>(0);
  const [clients, setClients] = useState<{ _id: string; name: string }[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/customers`);
        setClients(res.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/projects`, {
        project_name,
        start_date,
        deadline,
        client_id: client_id || undefined,
        budget,
      });
      navigate("/dashboard/projects");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add project");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Project
      </Typography>

      <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa", borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Project Name"
              value={project_name}
              onChange={(e) => setProjectName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Start Date"
              value={start_date}
              onChange={(e) => setStartDate(e.target.value)}
              required
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Client"
              value={client_id}
              onChange={(e) => setClientId(e.target.value)}
              fullWidth
            >
              <MenuItem value="">None</MenuItem>
              {clients.map((client) => (
                <MenuItem key={client._id} value={client._id}>
                  {client.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Budget"
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value))}
              fullWidth
              type="number"
              inputProps={{ min: 0 }}
            />
            
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}
            
            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button
                variant="contained"
                color="success"
                type="submit"
                disabled={loading}
              >
                {loading ? "Adding…" : "Add Project"}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/projects")}
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

export default ProjectForm;

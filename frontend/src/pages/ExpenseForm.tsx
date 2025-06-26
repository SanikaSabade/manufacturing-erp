import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const ExpenseForm: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [paidBy, setPaidBy] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [projectId, setProjectId] = useState("");
  const [recurringFlag, setRecurringFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<{ _id: string; project_name: string }[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/projects`);
        setProjects(res.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    }
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/expenses`, {
        amount,
        paidBy,
        date,
        notes,
        expense_type: expenseType,
        project_id: projectId || undefined,
        recurring_flag: recurringFlag,
      });
      navigate("/dashboard/finance/expenses");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Expense
      </Typography>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa", borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              required
              fullWidth
              type="number"
            />
            <TextField
              label="Paid By"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Expense Type"
              value={expenseType}
              onChange={(e) => setExpenseType(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.project_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={recurringFlag}
                  onChange={(e) => setRecurringFlag(e.target.checked)}
                />
              }
              label="Recurring Expense"
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button variant="contained" color="success" type="submit" disabled={loading}>
                {loading ? "Adding…" : "Add Expense"}
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => navigate("/dashboard/finance/expenses")}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ExpenseForm;

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Alert,
} from "@mui/material";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const ExpenseForm: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [paidBy, setPaidBy] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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
                {loading ? "Adding…" : "Add Expense"}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/finance/expenses")}
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

export default ExpenseForm;

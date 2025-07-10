import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
} from "@mui/material";

interface Settings {
  currency: string;
  taxPercentage: number | ""; 
  fiscalYearStart: string;
  fiscalYearEnd: string;
}

const SettingsForm: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<Settings>({
    currency: "",
    taxPercentage: "",
    fiscalYearStart: "",
    fiscalYearEnd: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "taxPercentage") {
        return { ...prev, [name]: value === "" ? "" : Number(value) };
      }
      return { ...prev, [name]: value };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/settings`, form);
      navigate("/dashboard/admin/settings");
    } catch (error) {
      console.error("Failed to save setting:", error);
    }
  };
  
  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add New Setting
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: "#fafafa" }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Currency"
              name="currency"
              value={form.currency}
              onChange={handleChange}
              required
              fullWidth
            />
            
            <TextField
              label="Tax Percentage (%)"
              name="taxPercentage"
              value={form.taxPercentage}
              onChange={handleChange}
              required
              fullWidth
              type="number"
            />
            
            <TextField
              label="Fiscal Year Start"
              name="fiscalYearStart"
              value={form.fiscalYearStart}
              onChange={handleChange}
              required
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              label="Fiscal Year End"
              name="fiscalYearEnd"
              value={form.fiscalYearEnd}
              onChange={handleChange}
              required
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
            />

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button
                variant="contained"
                color="success"
                type="submit"
              >
                Add Setting
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/admin/settings")}
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

export default SettingsForm;

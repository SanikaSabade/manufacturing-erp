import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

interface Employee {
  _id: string;
  name: string;
}

const AttendanceForm: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({
    employee: "",
    date: "",
    checkIn: "",
    checkOut: "",
    status: "Present",
    shift: "",
    remarks: "",
    working_hours: "",
    overtime_hours: "",
  });
  const { employee, date, checkIn, checkOut, status, shift, remarks, working_hours, overtime_hours } = form;

  const navigate = useNavigate();

  const convertToISO = (time: string) => {
    return time && date ? new Date(`${date}T${time}:00.000Z`) : null;
  };
  
  useEffect(() => {
    axios
      .get("/api/employees")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Failed to load employees:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/attendance", {
        employee,
        date,
        checkIn: convertToISO(checkIn),
        checkOut: convertToISO(checkOut),
        status,
        shift,
        remarks,
        working_hours: Number(working_hours),
        overtime_hours: Number(overtime_hours),
      });
      navigate("/dashboard/hr/attendance");
    } catch (err) {
      console.error("Error submitting attendance:", err);
      alert("Failed to submit attendance.");
    }
  };
  
  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Attendance
      </Typography>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa", borderRadius: 2, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControl fullWidth required>
              <InputLabel>Employee</InputLabel>
              <Select
                value={employee}
                onChange={(e) => setForm({ ...form, employee: e.target.value })}
                label="Employee"
              >
                <MenuItem value="">Select Employee</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Check In"
              type="time"
              value={checkIn}
              onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Check Out"
              type="time"
              value={checkOut}
              onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                <MenuItem value="Leave">Leave</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Shift"
              value={shift}
              onChange={(e) => setForm({ ...form, shift: e.target.value })}
              fullWidth
            />

            <TextField
              label="Remarks"
              value={remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              fullWidth
            />

            <TextField
              label="Working Hours"
              type="number"
              value={working_hours}
              onChange={(e) => setForm({ ...form, working_hours: e.target.value })}
              fullWidth
            />

            <TextField
              label="Overtime Hours"
              type="number"
              value={overtime_hours}
              onChange={(e) => setForm({ ...form, overtime_hours: e.target.value })}
              fullWidth
            />

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button variant="contained" color="success" type="submit">
                Submit Attendance
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/dashboard/hr/attendance")}
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

export default AttendanceForm;


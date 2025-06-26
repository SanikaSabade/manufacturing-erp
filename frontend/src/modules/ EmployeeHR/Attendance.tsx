import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Stack
} from "@mui/material";

interface Employee {
  _id: string;
  name: string;
  email?: string;
}

interface Attendance {
  _id?: string;
  employee: Employee;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: "Present" | "Absent" | "Leave";
  working_hours?: number;
  overtime_hours?: number;
  remarks?: string;
  shift?: string;
  createdAt?: string;
}

const Attendance: React.FC = () => {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState<Partial<Attendance>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [attRes, empRes] = await Promise.all([
        axios.get<Attendance[]>(`${import.meta.env.VITE_BACKEND_URL}api/attendance`),
        axios.get<Employee[]>(`${import.meta.env.VITE_BACKEND_URL}api/employees`),
      ]);
      setRecords(attRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setForm({});
    setEditingId(null);
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "employee") {
      setForm((prev) => ({
        ...prev,
        employee: employees.find((emp) => emp._id === value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      employee: (form.employee as Employee)?._id,
      date: new Date(form.date!).toISOString(),
      checkIn: new Date(`${form.date}T${form.checkIn}:00`).toISOString(),
      checkOut: new Date(`${form.date}T${form.checkOut}:00`).toISOString(),
      status: form.status,
      working_hours: Number(form.working_hours),
      overtime_hours: Number(form.overtime_hours),
      remarks: form.remarks,        
      shift: form.shift, 
    };
    
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/attendance/${editingId}`, payload);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/attendance`, payload);
      }
      fetchAllData();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };
  
  const handleEdit = (record: Attendance) => {
    setForm({
      ...record,
      date: record.date.split("T")[0],
      checkIn: record.checkIn?.slice(11, 16),
      checkOut: record.checkOut?.slice(11, 16),
    });
    setEditingId(record._id!);
    setShowForm(true);
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/attendance/${id}`);
      fetchAllData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };
  
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Present: "bg-green-100 text-green-800 border-green-200",
      Absent: "bg-red-100 text-red-800 border-red-200",
      Leave: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return (
      <span
        className={`px-1.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status as keyof typeof statusClasses]}`}
      >
        {status}
      </span>
    );
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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Employee Attendance</h1>
            
          </div>
        </div>

        {showForm && (
  <Box
    component="form"
    onSubmit={handleSubmit}
    sx={{
      p: 3,
      bgcolor: "white",
      boxShadow: 1,
      borderRadius: 2,
      border: "1px solid #e0e0e0",
    }}
  >
    <h3>{editingId ? "Edit Record" : "Add Record"}</h3>
    <Stack spacing={2}>
      <TextField
        select
        name="employee"
        label="Employee"
        value={(form.employee as Employee)?._id || ""}
        onChange={handleInputChange}
        required
        fullWidth
      >
        <MenuItem value="">Select Employee</MenuItem>
        {employees.map((emp) => (
          <MenuItem key={emp._id} value={emp._id}>
            {emp.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        name="date"
        label="Date"
        type="date"
        value={form.date || ""}
        onChange={handleInputChange}
        required
        fullWidth
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        name="checkIn"
        label="Check-In"
        type="time"
        value={form.checkIn || ""}
        onChange={handleInputChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        name="checkOut"
        label="Check-Out"
        type="time"
        value={form.checkOut || ""}
        onChange={handleInputChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        select
        name="status"
        label="Status"
        value={form.status || ""}
        onChange={handleInputChange}
        required
        fullWidth
      >
        <MenuItem value="">Select Status</MenuItem>
        <MenuItem value="Present">Present</MenuItem>
        <MenuItem value="Absent">Absent</MenuItem>
        <MenuItem value="Leave">Leave</MenuItem>
      </TextField>

      <TextField
        name="working_hours"
        label="Working Hours"
        type="number"
        value={form.working_hours || ""}
        onChange={handleInputChange}
        fullWidth
      />

      <TextField
        name="overtime_hours"
        label="Overtime Hours"
        type="number"
        value={form.overtime_hours || ""}
        onChange={handleInputChange}
        fullWidth
      />

      <TextField
        name="remarks"
        label="Remarks"
        value={form.remarks || ""}
        onChange={handleInputChange}
        fullWidth
      />

      <TextField
        name="shift"
        label="Shift"
        value={form.shift || ""}
        onChange={handleInputChange}
        fullWidth
      />

      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="success" type="submit">
          {editingId ? "Update Record" : "Add Record"}
        </Button>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => {
            resetForm();
            setShowForm(false);
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  </Box>
)}


        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Check-In</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Check-Out</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Working Hrs</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Overtime Hrs</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-3 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">No attendance records found</h3>
                        <p className="text-gray-500">Get started by adding your first attendance record.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-900">{record.employee?.name || "Unknown"}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                      <td className="px-3 py-2">{getStatusBadge(record.status)}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{record.working_hours ?? "—"}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{record.overtime_hours ?? "—"}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{record.remarks || "—"}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{record.shift || "—"}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "—"}</td>
                      <td className="px-3 py-2 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(record)}
                            className="text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 px-2 py-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(record._id!)}
                            className="text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 px-2 py-1"
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

export default Attendance;

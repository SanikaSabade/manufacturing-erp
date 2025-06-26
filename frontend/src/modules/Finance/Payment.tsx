import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import {
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  type SelectChangeEvent
} from "@mui/material";

interface Payment {
  _id: string;
  type: "Incoming" | "Outgoing";
  amount: number;
  reference_number?: string;
  date: string;
  mode?: string;
  notes?: string;
  approved_by?: { _id: string; name: string };
  createdAt: string;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [employees, setEmployees] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  useEffect(() => {
    fetchPayments();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/employees`);
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Payment[]>(`${import.meta.env.VITE_BACKEND_URL}api/payments`);
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this payment?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/payments/${id}`);
        fetchPayments();
      } catch (err) {
        console.error("Failed to delete payment:", err);
      }
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement  | HTMLTextAreaElement  >) => {
    const { name, value } = e.target;
    setEditingPayment(prev => prev ? { ...prev, [name]: name === "amount" ? +value : value } : null);
  };

  const handleEditSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setEditingPayment((prev) =>
      prev ? { ...prev, [name]: value } : null
    );
  };
  

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/payments/${editingPayment._id}`, editingPayment);
      setEditingPayment(null);
      fetchPayments();
    } catch (err) {
      console.error("Error updating payment:", err);
    }
  };

  const getStatusBadge = (type: string) => {
    const typeClasses = {
      Incoming: "bg-green-100 text-green-800 border-green-200",
      Outgoing: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${typeClasses[type as keyof typeof typeClasses]}`}>
        {type}
      </span>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Incoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(payment => payment.type === 'Incoming').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Outgoing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(payment => payment.type === 'Outgoing').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {editingPayment && (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 p-4">
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      Edit Payment
    </Typography>
    <form onSubmit={handleEditSubmit}>
      <Stack spacing={3}>
      <FormControl fullWidth>
  <InputLabel>Type</InputLabel>
  <Select
    name="type"
    value={editingPayment.type}
    onChange={handleEditSelectChange}
    label="Type"
  >
    <MenuItem value="Incoming">Incoming</MenuItem>
    <MenuItem value="Outgoing">Outgoing</MenuItem>
  </Select>
</FormControl>


        <TextField
          label="Amount (₹)"
          name="amount"
          value={editingPayment.amount}
          onChange={handleEditChange}
          type="number"
          required
          fullWidth
        />

        <TextField
          label="Reference"
          name="reference"
          value={editingPayment.reference_number || ""}
          onChange={handleEditChange}
          fullWidth
        />

        <TextField
          label="Date"
          name="date"
          value={editingPayment.date.slice(0, 10)}
          onChange={handleEditChange}
          required
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Mode"
          name="mode"
          value={editingPayment.mode || ""}
          onChange={handleEditChange}
          fullWidth
        />

        <TextField
          label="Notes"
          name="notes"
          value={editingPayment.notes || ""}
          onChange={handleEditChange}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Approved By</InputLabel>
          <Select
            name="approved_by"
            value={editingPayment.approved_by?._id || ""}
            onChange={(e) =>
              setEditingPayment((prev) =>
                prev
                  ? {
                      ...prev,
                      approved_by: { _id: e.target.value, name: "" },
                    }
                  : null
              )
            }
            label="Approved By"
          >
            <MenuItem value="">None</MenuItem>
            {employees.map((emp) => (
              <MenuItem key={emp._id} value={emp._id}>
                {emp.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="success"
            type="submit"
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setEditingPayment(null)}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </form>
  </div>
)}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Payments List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference Number</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved By</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.type)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹{payment.amount.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.reference_number || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(payment.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.mode || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.notes || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
  <div className="text-sm text-gray-900">
    {payment.approved_by && typeof payment.approved_by === "object"
      ? payment.approved_by.name
      : employees.find(emp => emp._id === (payment.approved_by as unknown as string))?.name || "—"}
  </div>
</td>


                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(payment.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingPayment(payment)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(payment._id)}
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
      </div>
    </div>
  );
};

export default Payments;
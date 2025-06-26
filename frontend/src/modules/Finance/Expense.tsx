import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import {
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
} from "@mui/material";


interface Project {
  _id: string;
  project_name: string;
}

interface Expense {
  _id: string;
  amount: number;
  paidBy: string;
  date: string;
  notes?: string;
  expense_type?: string;
  project_id?: Project | string;
  recurring_flag?: boolean;
  createdAt: string;
  updatedAt: string;
}

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    paidBy: "",
    date: "",
    notes: "",
    expense_type: "",
    project_id: "",
    recurring_flag: false,
  });

  useEffect(() => {
    fetchExpenses();
    fetchProjects();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get<Expense[]>(`${import.meta.env.VITE_BACKEND_URL}api/expenses`);
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchProjects = async () => {
    try {
      const res = await axios.get<Project[]>(`${import.meta.env.VITE_BACKEND_URL}api/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };
  const handleEditClick = (expense: Expense) => {
    setEditExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      paidBy: expense.paidBy,
      date: expense.date.split("T")[0],
      notes: expense.notes || "",
      expense_type: expense.expense_type || "",
      project_id: typeof expense.project_id === "string" ? expense.project_id : expense.project_id?._id || "",
      recurring_flag: expense.recurring_flag || false,
    });
  };
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editExpense) return;

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/expenses/${editExpense._id}`, {
        ...formData,
        amount: Number(formData.amount),
      });
      setEditExpense(null);
      await fetchExpenses();
    } catch (err) {
      console.error("Update failed", err);
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/expenses/${id}`);
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
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
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
        </div>

        {editExpense && (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Edit Expense</h3>
    </div>
    <form onSubmit={handleUpdate} className="p-6">
      <Stack spacing={3}>
        <TextField
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
          fullWidth
        />
        <TextField
          label="Paid By"
          value={formData.paidBy}
          onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
          required
          fullWidth
        />
        <TextField
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Expense Type"
          value={formData.expense_type}
          onChange={(e) => setFormData({ ...formData, expense_type: e.target.value })}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Project</InputLabel>
          <Select
            value={formData.project_id}
            onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
            label="Project"
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
            <input
              type="checkbox"
              checked={formData.recurring_flag}
              onChange={(e) =>
                setFormData({ ...formData, recurring_flag: e.target.checked })
              }
              className="h-4 w-4"
            />
          }
          label="Recurring Expense"
        />
        <TextField
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          fullWidth
        />
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="success"
            type="submit"
            sx={{ textTransform: "none" }}
          >
            Save Changes
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => setEditExpense(null)}
            sx={{ textTransform: "none" }}
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
            <h3 className="text-lg font-semibold text-gray-900">Expenses List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Paid By</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Expense Type</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Recurring</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-3 py-12 text-center">
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
                            d="M17 9V7a5 5 0 00-10 0v2m-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7m-7-2v7m-4-4h8"
                          />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">No expenses found</h3>
                        <p className="text-gray-500">No expense records available at the moment.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 py-2 whitespace-nowrap">₹{expense.amount.toFixed(2)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{expense.paidBy}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="px-3 py-2 whitespace-normal break-words">{expense.notes || "—"}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{expense.expense_type || "—"}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {typeof expense.project_id !== "string" && expense.project_id?.project_name
                          ? expense.project_id.project_name
                          : "—"}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{expense.recurring_flag ? "Yes" : "No"}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{new Date(expense.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(expense)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(expense._id)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
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
export default Expenses;

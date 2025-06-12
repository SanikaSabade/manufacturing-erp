import React, { useEffect, useState } from "react";
import axios from '../../utils/axios';
import { useNavigate } from "react-router-dom";

interface Expense {
  _id: string;
  amount: number;
  paidBy: string;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);

  const [formData, setFormData] = useState({
    amount: "",
    paidBy: "",
    date: "",
    notes: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
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

  const handleEditClick = (expense: Expense) => {
    setEditExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      paidBy: expense.paidBy,
      date: expense.date.split("T")[0],
      notes: expense.notes || "",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editExpense) return;

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/expenses/${editExpense._id}`, formData);
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

  if (loading) return <div className="p-6">Loading expenses...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Expenses</h2>
        <button
          onClick={() => navigate("/dashboard/expenses/add")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          + Add Expense
        </button>
      </div>

      {editExpense && (
        <form onSubmit={handleUpdate} className="mb-6 p-4 bg-gray-100 rounded shadow space-y-4">
          <h3 className="text-xl font-semibold">Edit Expense</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Paid By"
              value={formData.paidBy}
              onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="border px-3 py-2 rounded"
            />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => setEditExpense(null)} type="button" className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Paid By</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Notes</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 border">₹{expense.amount.toFixed(2)}</td>
                <td className="px-4 py-2 border">{expense.paidBy}</td>
                <td className="px-4 py-2 border">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">{expense.notes || "—"}</td>
                <td className="px-4 py-2 border">{new Date(expense.createdAt).toLocaleString()}</td>
                <td className="flex gap-2 p-4">

                  <button
                    onClick={() => handleEditClick(expense)}
                    className="text-sm px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="text-sm px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;

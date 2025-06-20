import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";

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
              <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
            </div>
          </div>
        </div>

        {editExpense && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Expense</h3>
            </div>
            <form onSubmit={handleUpdate} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paid By</label>
                  <input
                    type="text"
                    placeholder="Enter paid by"
                    value={formData.paidBy}
                    onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <input
                    type="text"
                    placeholder="Enter notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditExpense(null)}
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
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
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[100px]">Amount</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[120px]">Paid By</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[150px]">Notes</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a5 5 0 00-10 0v2m-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7m-7-2v7m-4-4h8" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
                        <p className="text-gray-500">No expense records available at the moment.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 py-2 max-w-[100px] whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{expense.amount.toFixed(2)}</div>
                      </td>
                      <td className="px-3 py-2 max-w-[120px] whitespace-normal break-words">
                        <div className="text-sm text-gray-900 truncate">{expense.paidBy}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(expense.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-3 py-2 max-w-[150px] whitespace-normal break-words">
                        <div className="text-sm text-gray-900 truncate">{expense.notes || "—"}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(expense.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(expense)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(expense._id)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
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
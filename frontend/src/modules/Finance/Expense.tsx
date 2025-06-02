import React, { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    axios
      .get<Expense[]>("http://localhost:8000/api/expenses") 
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error("Failed to fetch expenses:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading expenses...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Expenses</h2>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Paid By</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Notes</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">₹{expense.amount.toFixed(2)}</td>
                <td className="px-4 py-2">{expense.paidBy}</td>
                <td className="px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{expense.notes || "—"}</td>
                <td className="px-4 py-2">{new Date(expense.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;

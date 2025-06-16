import React, { useState } from "react";
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
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded shadow">
        <div>
          <label className="block font-medium mb-1">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Paid By</label>
          <input
            type="text"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter name"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Optional notes"
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex gap-2 justify-center">

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
        <button
  type="button"
  onClick={() => navigate("/dashboard/finance/expenses")}
  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
>
  Cancel
</button>
</div>
      </form>
    </div>
  );
};

export default ExpenseForm;

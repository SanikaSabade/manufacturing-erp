import React, { useEffect, useState } from "react";
import axios from '../../utils/axios';
import { useNavigate } from "react-router-dom";

interface Payment {
  _id: string;
  type: "Incoming" | "Outgoing";
  amount: number;
  reference?: string;
  date: string;
  mode?: string;
  notes?: string;
  createdAt: string;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

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

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingPayment(prev => prev ? { ...prev, [name]: name === "amount" ? +value : value } : null);
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

  if (loading) return <div className="p-6">Loading payments...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Payments</h2>
        <button
          onClick={() => navigate("/dashboard/finance/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Payment
        </button>
      </div>

      {editingPayment && (
        <form onSubmit={handleEditSubmit} className="bg-gray-100 p-4 mb-6 rounded">
          <h3 className="text-lg font-semibold mb-3">Edit Payment</h3>
          <div className="grid grid-cols-2 gap-4">
            <select name="type" value={editingPayment.type} onChange={handleEditChange} className="border px-2 py-1 rounded">
              <option value="Incoming">Incoming</option>
              <option value="Outgoing">Outgoing</option>
            </select>
            <input name="amount" value={editingPayment.amount} onChange={handleEditChange} type="number" className="border px-2 py-1 rounded" />
            <input name="reference" value={editingPayment.reference || ""} onChange={handleEditChange} className="border px-2 py-1 rounded" />
            <input name="date" type="date" value={editingPayment.date.slice(0,10)} onChange={handleEditChange} className="border px-2 py-1 rounded" />
            <input name="mode" value={editingPayment.mode || ""} onChange={handleEditChange} className="border px-2 py-1 rounded" />
            <input name="notes" value={editingPayment.notes || ""} onChange={handleEditChange} className="border px-2 py-1 rounded" />
          </div>
          <div className="mt-4 flex gap-3 justify-start">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Save
            </button>
            <button type="button" onClick={() => setEditingPayment(null)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100 border-b text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Reference</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border ">Mode</th>
              <th className="px-4 py-2 border">Notes</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 border-l-1 border-black font-medium text-blue-600">{payment.type}</td>
                <td className="px-4 py-2 border">₹{payment.amount.toFixed(2)}</td>
                <td className="px-4 py-2 border">{payment.reference || "—"}</td>
                <td className="px-4 py-2 border">{new Date(payment.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">{payment.mode || "—"}</td>
                <td className="px-4 py-2 border">{payment.notes || "—"}</td>
                <td className="px-4 py-2 border">{new Date(payment.createdAt).toLocaleString()}</td>
                <td className="p-4 py-2 flex gap-2 ">
                  <button
                    onClick={() => setEditingPayment(payment)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(payment._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center p-5">
        <button
          onClick={() => navigate("/dashboard/finance/expenses")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Expenses
        </button>
      </div>
    </div>
  );
};

export default Payments;

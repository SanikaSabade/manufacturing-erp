import React, { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    axios
      .get<Payment[]>(`${import.meta.env.VITE_BACKEND_URL}api/payments`) 
      .then((res) => setPayments(res.data))
      .catch((err) => console.error("Error fetching payments:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading payments...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Payments</h2>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100 border-b text-gray-700">
            <tr>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Reference</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Mode</th>
              <th className="px-4 py-2">Notes</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-blue-600">{payment.type}</td>
                <td className="px-4 py-2">₹{payment.amount.toFixed(2)}</td>
                <td className="px-4 py-2">{payment.reference || "—"}</td>
                <td className="px-4 py-2">{new Date(payment.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{payment.mode || "—"}</td>
                <td className="px-4 py-2">{payment.notes || "—"}</td>
                <td className="px-4 py-2">{new Date(payment.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;

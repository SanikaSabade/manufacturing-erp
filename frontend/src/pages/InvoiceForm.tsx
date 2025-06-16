import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

interface SalesOrder {
  _id: string;
  orderNumber: string;
}

interface Invoice {
  invoiceNumber: string;
  salesOrder: string;
  issueDate: string;
  paymentStatus: "Unpaid" | "Paid" | "Overdue";
  pdfUrl?: string;
}

const InvoiceForm: React.FC = () => {
  const [form, setForm] = useState<Invoice>({
    invoiceNumber: "",
    salesOrder: "",
    issueDate: "",
    paymentStatus: "Unpaid",
    pdfUrl: "",
  });
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<SalesOrder[]>(`${import.meta.env.VITE_BACKEND_URL}api/sales-orders`)
      .then((res) => setSalesOrders(res.data))
      .catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/invoices`, form);
      navigate("/dashboard/sales/invoices");
    } catch (err) {
      console.error("Failed to create invoice", err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Invoice</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 bg-gray-50 p-6 rounded shadow"
      >
        <input
          name="invoiceNumber"
          value={form.invoiceNumber}
          onChange={handleChange}
          placeholder="Invoice Number"
          className="p-2 border rounded"
          required
        />

        <select
          name="salesOrder"
          value={form.salesOrder}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        >
          <option value="">Select Sales Order</option>
          {salesOrders.map((order) => (
            <option key={order._id} value={order._id}>
              {order.orderNumber}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="issueDate"
          value={form.issueDate}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        <select
          name="paymentStatus"
          value={form.paymentStatus}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        >
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>

        <input
          name="pdfUrl"
          value={form.pdfUrl}
          onChange={handleChange}
          placeholder="PDF URL (optional)"
          className="p-2 border rounded"
        />

        <div className="flex gap-2 justify-center">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Invoice
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/sales/invoices")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;

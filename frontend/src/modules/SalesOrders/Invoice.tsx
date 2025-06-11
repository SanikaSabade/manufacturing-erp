import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

interface SalesOrder {
  _id: string;
  orderNumber: string;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  salesOrder?: SalesOrder | null;
  issueDate: string;
  paymentStatus: "Unpaid" | "Paid" | "Overdue";
  pdfUrl?: string;
  createdAt: string;
}

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    issueDate: "",
    paymentStatus: "Unpaid" as "Unpaid" | "Paid" | "Overdue",
    pdfUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Invoice[]>(`${import.meta.env.VITE_BACKEND_URL}api/invoices`)
      .then((res) => setInvoices(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      invoiceNumber: invoice.invoiceNumber,
      issueDate: invoice.issueDate.split("T")[0],
      paymentStatus: invoice.paymentStatus,
      pdfUrl: invoice.pdfUrl || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/invoices/${id}`);
        setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!editingInvoice) return;

    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/invoices/${editingInvoice._id}`, formData);
      setInvoices((prev) =>
        prev.map((inv) => (inv._id === editingInvoice._id ? res.data : inv))
      );
      setEditingInvoice(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) return <div className="p-6">Loading invoices...</div>;

  return (
    <div className="p-6">
                  <div className="mb-4 flex justify-between items-center">

      <h2 className="text-2xl font-semibold mb-4">Invoices</h2>
      <button
        onClick={() => navigate("/dashboard/invoices/add")}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Add Invoice
      </button>
      </div>

      {editingInvoice && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Edit Invoice</h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleFormChange}
              placeholder="Invoice Number"
              className="border p-2 rounded"
            />
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleFormChange}
              className="border p-2 rounded"
            />
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleFormChange}
              className="border p-2 rounded"
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
            <input
              type="text"
              name="pdfUrl"
              value={formData.pdfUrl}
              onChange={handleFormChange}
              placeholder="PDF URL"
              className="border p-2 rounded"
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditingInvoice(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Invoice Number</th>
              <th className="px-4 py-2 border">Sales Order</th>
              <th className="px-4 py-2 border">Issue Date</th>
              <th className="px-4 py-2 border">Payment Status</th>
              <th className="px-4 py-2 border">PDF</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-2 border">{invoice.invoiceNumber}</td>
                <td className="px-4 py-2 border">{invoice.salesOrder?.orderNumber || "N/A"}</td>
                <td className="px-4 py-2 border">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">{invoice.paymentStatus}</td>
                <td className="px-4 py-2 border">
                  {invoice.pdfUrl ? (
                    <a
                      href={invoice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View PDF
                    </a>
                  ) : (
                    "No PDF"
                  )}
                </td>
                <td className="px-4 py-2 border">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(invoice)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(invoice._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;

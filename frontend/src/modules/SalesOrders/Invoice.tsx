import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";

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

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Paid: "bg-green-100 text-green-800 border-green-200",
      Unpaid: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Overdue: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
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
              <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            </div>
          </div>
        </div>

        {editingInvoice && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Invoice</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleFormChange}
                    placeholder="Enter invoice number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PDF URL</label>
                  <input
                    type="text"
                    name="pdfUrl"
                    value={formData.pdfUrl}
                    onChange={handleFormChange}
                    placeholder="Enter PDF URL"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingInvoice(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Invoices List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[120px]">Invoice Number</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[140px]">Sales Order</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PDF</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 py-2 max-w-[120px] whitespace-normal break-words">
                        <div className="text-sm text-gray-900 truncate">{invoice.invoiceNumber}</div>
                      </td>
                      <td className="px-3 py-2 max-w-[140px] whitespace-normal break-words">
                        <div className="text-sm text-gray-900 truncate">{invoice.salesOrder?.orderNumber || "N/A"}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(invoice.issueDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{getStatusBadge(invoice.paymentStatus)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm">
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
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(invoice.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(invoice)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(invoice._id)}
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

export default Invoices;
import React, { useEffect, useState } from "react";
import axios from "axios";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Invoice[]>("http://localhost:8000/api/invoices") 
      .then((res) => setInvoices(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading invoices...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Invoices</h2>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;

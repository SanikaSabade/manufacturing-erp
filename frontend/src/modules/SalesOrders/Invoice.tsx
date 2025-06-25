import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";

interface SalesOrder {
  _id: string;
  orderNumber: string;
}
interface Employee {
  _id: string;
  name: string;
}
interface Invoice {
  _id: string;
  invoiceNumber: string;
  salesOrder?: SalesOrder | null;
  issueDate: string;
  paymentStatus: "Unpaid" | "Paid" | "Overdue";
  pdfUrl?: string;
  total_amount: number;
  discounts: number;
  terms_conditions: string;
  received_by: string;
  tax_details: {
    gst_rate: number;
    cgst: number;
    sgst: number;
    igst: number;
    other_taxes: number;
  };
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
    total_amount: 0,
    discounts: 0,
    terms_conditions: "",
    received_by: "",
    tax_details: {
      gst_rate: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      other_taxes: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    axios
      .get<Invoice[]>(`${import.meta.env.VITE_BACKEND_URL}api/invoices`)
      .then((res) => setInvoices(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    axios
      .get<Employee[]>(`${import.meta.env.VITE_BACKEND_URL}api/employees`)
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Failed to load employees:", err));
  }, []);

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      invoiceNumber: invoice.invoiceNumber,
      issueDate: invoice.issueDate.split("T")[0],
      paymentStatus: invoice.paymentStatus,
      pdfUrl: invoice.pdfUrl || "",
      total_amount: invoice.total_amount || 0,
      discounts: invoice.discounts || 0,
      terms_conditions: invoice.terms_conditions || "",
      received_by: invoice.received_by || "",
      tax_details: {
        gst_rate: invoice.tax_details?.gst_rate || 0,
        cgst: invoice.tax_details?.cgst || 0,
        sgst: invoice.tax_details?.sgst || 0,
        igst: invoice.tax_details?.igst || 0,
        other_taxes: invoice.tax_details?.other_taxes || 0,
      },
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
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleUpdate = async () => {
    if (!editingInvoice) return;

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/invoices/${editingInvoice._id}`,
        formData
      );
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
      <span
        className={`px-1.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status as keyof typeof statusClasses]}`}
      >
        {status}
      </span>
    );
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        </div>

        {editingInvoice && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <Typography variant="h6">Edit Invoice</Typography>
            <Box
              component="form"
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
              gap={2}
              mt={2}
            >
              <TextField
                label="Invoice Number"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                label="Issue Date"
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                label="Payment Status"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, paymentStatus: e.target.value as any }))
                  }
                >
                  <MenuItem value="Unpaid">Unpaid</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="PDF URL"
                name="pdfUrl"
                value={formData.pdfUrl}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                label="Total Amount"
                type="number"
                name="total_amount"
                value={formData.total_amount}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                label="Discounts"
                type="number"
                name="discounts"
                value={formData.discounts}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                label="Terms & Conditions"
                name="terms_conditions"
                value={formData.terms_conditions}
                onChange={handleFormChange}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Received By</InputLabel>
                <Select
                label="Recieved By"
  name="received_by"
  value={formData.received_by}
  onChange={(e) =>
    setFormData((prev) => ({ ...prev, received_by: e.target.value }))
  }
>
  {employees.map((emp) => (
    <MenuItem key={emp._id} value={emp._id}>
      {emp.name}
    </MenuItem>
  ))}
</Select>

              </FormControl>
              <Box gridColumn="1 / -1">
                <Typography variant="subtitle1">Tax Details</Typography>
                <Box
                  display="grid"
                  gridTemplateColumns={{ xs: "1fr 1fr", md: "1fr 1fr 1fr" }}
                  gap={2}
                >
                  {["gst_rate", "cgst", "sgst", "igst", "other_taxes"].map((key) => (
                    <TextField
                      key={key}
                      label={key}
                      type="number"
                      value={(formData.tax_details as any)[key]}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tax_details: {
                            ...prev.tax_details,
                            [key]: Number(e.target.value),
                          },
                        }))
                      }
                      fullWidth
                    />
                  ))}
                </Box>
              </Box>
            </Box>
            <Box mt={3} display="flex" gap={2}>
              <Button variant="contained"
                  color="success"
                   onClick={handleUpdate}>
                Save Changes
              </Button>
              <Button variant="contained"
                  color="inherit"
                   onClick={() => setEditingInvoice(null)}>
                Cancel
              </Button>
            </Box>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Invoices List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Invoice Number</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sales Order</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">PDF</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Discounts</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Terms & Conditions</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Received By</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tax Details</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-3 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <h3 className="text-lg font-medium text-gray-900">No invoices found</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{invoice.invoiceNumber}</td>
                      <td className="px-3 py-2">{invoice.salesOrder?.orderNumber || "N/A"}</td>
                      <td className="px-3 py-2">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                      <td className="px-3 py-2">{getStatusBadge(invoice.paymentStatus)}</td>
                      <td className="px-3 py-2">
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
                      <td className="px-3 py-2">{invoice.total_amount}</td>
                      <td className="px-3 py-2">{invoice.discounts}</td>
                      <td className="px-3 py-2">{invoice.terms_conditions}</td>
                      <td className="px-3 py-2">
  {typeof invoice.received_by === "object" && invoice.received_by !== null
    ? (invoice.received_by as Employee).name
    : (invoice.received_by || "N/A")}
</td>
                      <td className=" py-2 align-top">
                        <div className="flex flex-wrap gap-1 text-gray-600 text-sm">
                          <span>GST: {invoice.tax_details?.gst_rate ?? 0}</span>
                          <span>CGST: {invoice.tax_details?.cgst ?? 0}</span>
                          <span>SGST: {invoice.tax_details?.sgst ?? 0}</span>
                          <span>IGST: {invoice.tax_details?.igst ?? 0}</span>
                          <span>Other: {invoice.tax_details?.other_taxes ?? 0}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 py-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(invoice)}
                            className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(invoice._id)}
                            className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200"
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

import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import {
  Box,
  Stack,
  TextField,
  Button,
} from "@mui/material";

interface Supplier {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  contact_person: string;
  billing_address: string;
  credit_limit?: number;
  payment_terms?: string;
  bank_details?: string;
  pan_number?: string;
  documents?: string[];
}

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState<Supplier>({
    name: "",
    email: "",
    phone: "",
    address: "",
    gstNumber: "",
    contact_person: "",
    billing_address: "",
    credit_limit: 0,
    payment_terms: "",
    bank_details: "",
    pan_number: "",
    documents: []
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}api/suppliers`)
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error("Error fetching suppliers:", err))
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      gstNumber: "",
      contact_person: "",
      billing_address: "",
      credit_limit: 0,
      payment_terms: "",
      bank_details: "",
      pan_number: "",
      documents: []
    });
    setEditingId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/suppliers/${editingId}`, form);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/suppliers`, form);
      }
      fetchSuppliers();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setForm(supplier);
    setEditingId(supplier._id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/suppliers/${id}`);
      fetchSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);
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
              <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
            </div>
            
          </div>
        </div>

        {showForm && (
  <Box
    component="form"
    onSubmit={handleSubmit}
    sx={{ p: 3, bgcolor: 'white', boxShadow: 1, borderRadius: 2, border: '1px solid #e0e0e0' }}
  >
    <h3>{editingId ? "Edit Supplier" : "Add Supplier"}</h3>
    <Stack spacing={2}>
      <TextField
        name="name"
        label="Name"
        value={form.name}
        onChange={handleInputChange}
        required
        fullWidth
      />
      <TextField
        name="email"
        label="Email"
        value={form.email}
        onChange={handleInputChange}
        required
        fullWidth
      />
      <TextField
        name="phone"
        label="Phone"
        value={form.phone}
        onChange={handleInputChange}
        required
        fullWidth
      />
      <TextField
        name="gstNumber"
        label="GST Number"
        value={form.gstNumber}
        onChange={handleInputChange}
        required
        fullWidth
      />
      <TextField
        name="address"
        label="Address"
        value={form.address}
        onChange={handleInputChange}
        required
        fullWidth
      />
      <TextField
        name="contact_person"
        label="Contact Person"
        value={form.contact_person}
        onChange={handleInputChange}
        required
        fullWidth
      />
      <TextField
        name="billing_address"
        label="Billing Address"
        value={form.billing_address}
        onChange={handleInputChange}
        required
        fullWidth
      />
      <TextField
        name="credit_limit"
        label="Credit Limit"
        value={form.credit_limit}
        onChange={(e) =>
          setForm({ ...form, credit_limit: Number(e.target.value) })
        }
        fullWidth
        type="number"
      />
      <TextField
        name="payment_terms"
        label="Payment Terms"
        value={form.payment_terms}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField
        name="bank_details"
        label="Bank Details"
        value={form.bank_details}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField
        name="pan_number"
        label="PAN Number"
        value={form.pan_number}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField
        name="documents"
        label="Documents (comma separated URLs)"
        value={form.documents?.join(", ") || ""}
        onChange={(e) =>
          setForm({ ...form, documents: e.target.value.split(",").map((url) => url.trim()) })
        }
        fullWidth
      />
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="success"
          type="submit"
        >
          {editingId ? "Update Supplier" : "Add Supplier"}
        </Button>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => {
            resetForm();
            setShowForm(false);
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  </Box>
)}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Suppliers List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[110px]">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[140px]">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[150px]">Address</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Number</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Address</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Limit</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Terms</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Details</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pan Number</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
                        <p className="text-gray-500">Get started by adding your first supplier.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  suppliers.map((supplier) => (
                    <tr key={supplier._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 py-2 max-w-[110px] whitespace-normal break-words">
                        <div className="text-sm font-medium text-gray-900 truncate">{supplier.name}</div>
                      </td>
                      <td className="px-3 py-2 max-w-[140px] whitespace-normal break-words">
                        <div className="text-sm text-gray-900 truncate">{supplier.email}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.phone}</div>
                      </td>
                      <td className="px-3 py-2 max-w-[150px] whitespace-normal break-words">
                        <div className="text-sm text-gray-900 truncate">{supplier.address}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.gstNumber}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.contact_person}</div>
                      </td><td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.billing_address}</div>
                      </td><td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.credit_limit}</div>
                      </td><td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.payment_terms}</div>
                      </td><td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.bank_details}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.pan_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
  {supplier.documents && supplier.documents.length > 0 && supplier.documents.some((url) => url.trim() !== "") ? (
    <div className="flex flex-col space-y-1">
      {supplier.documents
        .filter((url) => url.trim() !== "")
        .map((url, index) => (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            Document {index + 1}
          </a>
        ))}
    </div>
  ) : (
    <span className="text-gray-500">N/A</span>
  )}
</td>


                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(supplier)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(supplier._id!)}
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

export default Suppliers;
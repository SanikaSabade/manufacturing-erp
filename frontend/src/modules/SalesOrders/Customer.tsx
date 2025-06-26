import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { TextField, Button, Stack, Box, Typography } from "@mui/material";


interface Customer {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  gstNumber: string;
  address: string;
  contact_person: "",
  billing_address: "",
  credit_limit: 0,
  payment_terms: "",
  bank_details: "",
  pan_number: "",
  documents: string[];
  createdAt?: string;
  
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
    gstNumber: "",
    address: "",
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

  const fetchCustomers = () => {
    setLoading(true);
    axios
      .get<Customer[]>(`${import.meta.env.VITE_BACKEND_URL}api/customers`)
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Error fetching customers:", err))
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", gstNumber: "", address: "",contact_person: "",
      billing_address: "",
      credit_limit: 0,
      payment_terms: "",
      bank_details: "",
      pan_number: "",
      documents: [] });
    setEditingId(null);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/customers/${editingId}`, form);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/customers`, form);
      }
      fetchCustomers();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleEdit = (customer: Customer) => {
    setForm(customer);
    setEditingId(customer._id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Customer?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error("Delete failed", err);
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
              <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            </div>
            
          </div>
        </div>

        {showForm && (
  <Box className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
    <Box className="px-6 py-4 border-b border-gray-200">
      <Typography variant="h6">
        {editingId ? "Edit Customer" : "Add Customer"}
      </Typography>
    </Box>
    <Box component="form" onSubmit={handleSubmit} p={3}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ flex: "1 1 48%" }}>
          <TextField
            label="Name"
            fullWidth
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
            size="small"
          />
        </Box>

        <Box sx={{ flex: "1 1 48%" }}>
          <TextField
            label="Email"
            fullWidth
            name="email"
            value={form.email}
            onChange={handleInputChange}
            required
            size="small"
            type="email"
          />
        </Box>

        <Box sx={{ flex: "1 1 48%" }}>
          <TextField
            label="Phone"
            fullWidth
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            required
            size="small"
          />
        </Box>

        <Box sx={{ flex: "1 1 48%" }}>
          <TextField
            label="GST Number"
            fullWidth
            name="gstNumber"
            value={form.gstNumber}
            onChange={handleInputChange}
            required
            size="small"
          />
        </Box>

        <Box sx={{ flex: "1 1 100%" }}>
          <TextField
            label="Address"
            fullWidth
            name="address"
            value={form.address}
            onChange={handleInputChange}
            required
            size="small"
          />
        </Box>

        <Box sx={{ flex: "1 1 48%" }}>
          <TextField
            label="Contact Person"
            fullWidth
            name="contact_person"
            value={form.contact_person}
            onChange={handleInputChange}
            required
            size="small"
          />
        </Box>

        <Box sx={{ flex: "1 1 48%" }}>
          <TextField
            label="Billing Address"
            fullWidth
            name="billing_address"
            value={form.billing_address}
            onChange={handleInputChange}
            required
            size="small"
          />
        </Box>

        <Box sx={{ flex: "1 1 48%" }}>
          <TextField
            label="Credit Limit"
            fullWidth
            name="credit_limit"
            value={form.credit_limit}
            onChange={handleInputChange}
            required
            size="small"
            type="number"
          />
        </Box>

        <Box sx={{ flex: "1 1 48%" }}>
          <TextField
            label="Payment Terms"
            fullWidth
            name="payment_terms"
            value={form.payment_terms}
            onChange={handleInputChange}
            required
            size="small"
          />
        </Box>

        <Box sx={{ flex: "1 1 48%" }}>
          <TextField
            label="Bank Details"
            fullWidth
            name="bank_details"
            value={form.bank_details}
            onChange={handleInputChange}
            required
            size="small"
          />
        </Box>

        <Box sx={{ flex: "1 1 48%" }}>
          <TextField
            label="PAN Number"
            fullWidth
            name="pan_number"
            value={form.pan_number}
            onChange={handleInputChange}
            required
            size="small"
          />
        </Box>

        <Box sx={{ flex: "1 1 100%" }}>
          <TextField
            label="Documents (comma-separated URLs)"
            fullWidth
            name="documents"
            value={form.documents.join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                documents: e.target.value.split(",").map((doc) => doc.trim()),
              })
            }
            size="small"
          />
        </Box>
      </Box>

      <Box mt={3}>
        <Stack direction="row" spacing={2}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            size="medium"
          >
            {editingId ? "Update Customer" : "Add Customer"}
          </Button>
          <Button
                  variant="contained"
                  color="inherit"
            onClick={() => {
              resetForm();
              setShowForm(false);
            }}
            size="medium"
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Box>
  </Box>
)}



        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Customers List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[110px]">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[140px]">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Number</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[150px]">Address</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Address</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Limit</th>
<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Terms</th>
<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Details</th>
<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAN Number</th>
<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>


                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 py-2 ">
                        <div className="text-sm font-medium text-gray-900 truncate">{customer.name}</div>
                      </td>
                      <td className="px-3 py-2 ">
                        <div className="text-sm text-gray-900 truncate">{customer.email}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.phone}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.gstNumber}</div>
                      </td>
                      <td className="px-3 py-2 max-w-[150px] whitespace-normal break-words">
                        <div className="text-sm text-gray-900 truncate">{customer.address}</div>
                      </td>
                      <td className="px-3 py-2"><div className="text-sm text-gray-900">{customer.contact_person}</div></td>
<td className="px-3 py-2">
<div className="text-sm text-gray-900">{customer.billing_address}</div></td>
<td className="px-3 py-2"><div className="text-sm text-gray-900">{customer.credit_limit}</div></td>
<td className="px-3 py-2"><div className="text-sm text-gray-900">{customer.payment_terms}</div></td>
<td className="px-3 py-2"><div className="text-sm text-gray-900">{customer.bank_details}</div></td>
<td className="px-3 py-2"><div className="text-sm text-gray-900">{customer.pan_number}</div></td>
<td className="px-3 py-2">
  {customer.documents && customer.documents.length > 0 && customer.documents.some((url) => url.trim() !== "") ? (
    <div className="flex flex-col space-y-1">
      {customer.documents
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


                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "-"}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(customer._id!)}
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

export default Customers;
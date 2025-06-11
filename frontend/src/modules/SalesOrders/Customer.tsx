import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

interface Customer {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  gstNumber: string;
  address: string;
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
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchCustomers = () => {
    axios
      .get<Customer[]>(`${import.meta.env.VITE_BACKEND_URL}api/customers`)
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Error fetching customers:", err));
  };

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", gstNumber: "", address: "" });
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
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-6">
            <div className="mb-4 flex justify-between items-center">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      <button
  onClick={() => navigate("/dashboard/customers/add")}
  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  + Add Customer
</button>
</div>
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-gray-100 p-4 rounded shadow grid grid-cols-2 gap-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="p-2 border rounded"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="p-2 border rounded"
            required
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            className="p-2 border rounded"
            required
          />
          <input
            name="gstNumber"
            value={form.gstNumber}
            onChange={handleInputChange}
            placeholder="GST Number"
            className="p-2 border rounded"
            required
          />
          <input
            name="address"
            value={form.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="p-2 border rounded"
            required
          />
          <div className="col-span-2 flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingId ? "Update Customer" : "Add Customer"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">GST Number</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 border">{customer.name}</td>
                <td className="px-4 py-2 border">{customer.email}</td>
                <td className="px-4 py-2 border">{customer.phone}</td>
                <td className="px-4 py-2 border">{customer.gstNumber}</td>
                <td className="px-4 py-2 border">{customer.address}</td>
                <td className="px-4 py-2 border">
                  {customer.createdAt ? new Date(customer.createdAt).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer._id!)}
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

      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/dashboard/sales/invoices")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Go to Invoices
        </button>
      </div>
    </div>
  );
};

export default Customers;

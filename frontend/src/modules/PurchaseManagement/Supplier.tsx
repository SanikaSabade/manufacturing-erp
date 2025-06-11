import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

interface Supplier {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
}

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState<Supplier>({
    name: "",
    email: "",
    phone: "",
    address: "",
    gstNumber: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    axios
      .get("/api/suppliers")
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
        await axios.put(`/api/suppliers/${editingId}`, form);
      } else {
        await axios.post("/api/suppliers", form);
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
      await axios.delete(`/api/suppliers/${id}`);
      fetchSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);
    }
  };

  if (loading) return <div className="p-6">Loading suppliers...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Suppliers</h2>
        <button
          onClick={() => navigate("/dashboard/supplier/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Supplier
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
            name="address"
            value={form.address}
            onChange={handleInputChange}
            placeholder="Address"
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
          <div className="col-span-2 flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingId ? "Update Supplier" : "Add Supplier"}
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
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">GST Number</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier._id} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-2 border">{supplier.name}</td>
                <td className="px-4 py-2 border">{supplier.email}</td>
                <td className="px-4 py-2 border">{supplier.phone}</td>
                <td className="px-4 py-2 border">{supplier.address}</td>
                <td className="px-4 py-2 border">{supplier.gstNumber}</td>
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supplier._id!)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/dashboard/purchase/grn")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          GRNs
        </button>
      </div>
    </div>
  );
};

export default Suppliers;




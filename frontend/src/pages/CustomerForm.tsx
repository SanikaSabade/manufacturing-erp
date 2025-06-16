import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axios";

interface Customer {
  name: string;
  email: string;
  phone: string;
  gstNumber: string;
  address: string;
}

const CustomerForm: React.FC = () => {
  const [form, setForm] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
    gstNumber: "",
    address: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}api/customers/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error("Failed to load customer:", err));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/customers/${id}`, form);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/customers`, form);
      }
      navigate("/dashboard/sales/customers");
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{id ? "Edit Customer" : "Add Customer"}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded shadow">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="p-2 border rounded"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="p-2 border rounded"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
          className="p-2 border rounded"
        />
        <input
          name="gstNumber"
          value={form.gstNumber}
          onChange={handleChange}
          placeholder="GST Number"
          required
          className="p-2 border rounded"
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          required
          className="p-2 border rounded"
        />
        <div className="col-span-2 flex gap-2 justify-center">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {id ? "Update" : "Add"}
          </button>
          <button type="button" onClick={() => navigate("/dashboard/sales/customers")} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

interface Customer {
  _id: string;
  name: string;
}


const SalesOrderForm: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState({
    customerId: "",
    orderNumber: "",
    date: "",
    status: "Pending",
    items: [{ quantity: 1, price: 0 }],
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Customer[]>(`${import.meta.env.VITE_BACKEND_URL}api/customers`)
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Failed to load customers:", err));
  }, []);

  const handleItemChange = (index: number, field: string, value: number) => {
    const updatedItems = [...form.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setForm({ ...form, items: updatedItems });
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { quantity: 1, price: 0 }] });
  };

  const removeItem = (index: number) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updatedItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/sales-orders`, {
        customer: form.customerId,
        orderNumber: form.orderNumber,
        date: form.date,
        status: form.status,
        items: form.items,
      });
      navigate("/dashboard/sales");
    } catch (err) {
      console.error("Error adding order:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add Sales Order</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 bg-gray-50 p-4 rounded shadow">
        <label className="font-medium">Select Customer</label>
        <select
          required
          value={form.customerId}
          onChange={(e) => setForm({ ...form, customerId: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <label className="font-medium">Order Number</label>
        <input
          type="text"
          placeholder="Order Number"
          value={form.orderNumber}
          onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
          className="p-2 border rounded"
          required
        />

        <label className="font-medium">Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="p-2 border rounded"
          required
        />

        <label className="font-medium">Status</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>

        <h3 className="font-semibold">Items</h3>
        {form.items.map((item, index) => (
          <div key={index} className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="block mb-1 text-sm font-medium">Quantity</label>
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                className="p-2 border rounded w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Price</label>
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
                className="p-2 border rounded w-full"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-sm text-red-600 hover:underline col-span-2 text-right"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-fit"
        >
          + Add Item
        </button>
<div className="flex gap-2 justify-center">
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Submit Order
        </button>
        <button
          type="button"
          onClick={() => navigate("/dashboard/sales")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
          Cancel
        </button>
        </div>
      </form>
    </div>
  );
};

export default SalesOrderForm;

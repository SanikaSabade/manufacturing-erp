import React, { useEffect, useState } from "react";
import axios from "axios";

interface Item {
  quantity: number;
  material: { name: string }; 
  price: number;
}

interface SalesOrder {
  _id: string;
  orderNumber: string;
  customer: { name: string }; 
  date: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered";
  items: Item[];
  createdAt: string;
}

const SalesOrders: React.FC = () => {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
    .get<SalesOrder[]>(`${import.meta.env.VITE_BACKEND_URL}api/sales-orders`) 
    .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const calculateTotal = (items: Item[]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales Orders</h2>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Order Number</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Total Items</th>
              <th className="px-4 py-2 border">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-2 border">{order.orderNumber}</td>
                <td className="px-4 py-2 border">{order.customer?.name || "N/A"}</td>
                <td className="px-4 py-2 border">{new Date(order.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 border capitalize">{order.status}</td>
                <td className="px-4 py-2 border">{order.items.length}</td>
                <td className="px-4 py-2 border">${calculateTotal(order.items)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesOrders;

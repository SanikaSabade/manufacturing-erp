import React, { useEffect, useState } from "react";
import axios from "axios";

interface Supplier {
  name: string;
}

interface Material {
  material_name: string;
}

interface Item {
  material: Material;
  quantity: number;
  cost: number;
}

interface PurchaseOrder {
  _id: string;
  supplier: Supplier;
  orderDate: string;
  status: "Ordered" | "Received" | "Cancelled";
  items: Item[];
  createdAt: string;
}

const PurchaseOrders: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<PurchaseOrder[]>("http://localhost:8000/api/purchase-orders") 
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching purchase orders:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading purchase orders...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Purchase Orders</h2>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-sm border text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2">Supplier</th>
              <th className="px-4 py-2">Order Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Items</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{order.supplier?.name}</td>
                <td className="px-4 py-2">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">
                  <ul className="list-disc pl-4">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.material?.material_name} – {item.quantity} pcs @ ₹{item.cost}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrders;

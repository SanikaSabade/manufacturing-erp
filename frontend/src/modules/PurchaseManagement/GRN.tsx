import React, { useEffect, useState } from "react";
import axios from "axios";

interface Material {
  material_name: string;
}

interface ReceivedItem {
  material: Material;
  quantity: number;
  inspected: boolean;
}

interface PurchaseOrder {
  _id: string;
  supplier?: { name: string }; 
  orderDate?: string;
}

interface GRN {
  _id: string;
  purchaseOrder: PurchaseOrder;
  receivedDate: string;
  receivedItems: ReceivedItem[];
  createdAt: string;
}

const GRNComponent: React.FC = () => {
  const [grns, setGrns] = useState<GRN[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<GRN[]>(`${import.meta.env.VITE_BACKEND_URL}api/grns`) 
      .then((res) => setGrns(res.data))
      .catch((err) => console.error("Error fetching GRNs:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading GRNs...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Goods Receipt Notes (GRNs)</h2>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-sm border text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2">Purchase Order ID</th>
              <th className="px-4 py-2">Received Date</th>
              <th className="px-4 py-2">Received Items</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {grns.map((grn) => (
              <tr key={grn._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{grn.purchaseOrder?._id}</td>
                <td className="px-4 py-2">
                  {new Date(grn.receivedDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <ul className="list-disc pl-4">
                    {grn.receivedItems.map((item, idx) => (
                      <li key={idx}>
                        {item.material?.material_name} – {item.quantity} pcs –{" "}
                        {item.inspected ? "Inspected ✅" : "Not Inspected ❌"}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2">
                  {new Date(grn.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GRNComponent;

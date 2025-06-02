import React, { useEffect, useState } from "react";
import axios from "axios";

interface Material {
  material_name: string;
}

interface User {
  name: string;
}

interface InventoryLog {
  _id: string;
  material_id: Material;
  change_type: "add" | "remove" | "adjust" | "transfer";
  quantity_changed: number;
  reason: string;
  date: string;
  user_id: User;
}

const InventoryLogs: React.FC = () => {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<InventoryLog[]>("http://localhost:8000/api/inventory-logs") 
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Error fetching inventory logs:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading inventory logs...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Logs</h2>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-sm border text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2">Material</th>
              <th className="px-4 py-2">Change Type</th>
              <th className="px-4 py-2">Quantity Changed</th>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">User</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{log.material_id?.material_name || "N/A"}</td>
                <td className="px-4 py-2 capitalize">{log.change_type}</td>
                <td className="px-4 py-2">{log.quantity_changed}</td>
                <td className="px-4 py-2">{log.reason}</td>
                <td className="px-4 py-2">{new Date(log.date).toLocaleString()}</td>
                <td className="px-4 py-2">{log.user_id?.name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryLogs;

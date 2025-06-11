import React, { useEffect, useState } from "react";
import axios from '../../utils/axios';
import { useNavigate } from "react-router-dom";

interface Material {
  _id: string;
  material_name: string;
}

interface User {
  _id: string;
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
  const [materials, setMaterials] = useState<Material[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editLog, setEditLog] = useState<InventoryLog | null>(null);

  const navigate = useNavigate();

  const fetchLogs = async () => {
    try {
      const [logRes, materialRes, userRes] = await Promise.all([
        axios.get<InventoryLog[]>(`${import.meta.env.VITE_BACKEND_URL}api/inventory-logs`),
        axios.get<Material[]>(`${import.meta.env.VITE_BACKEND_URL}api/materials`),
        axios.get<User[]>(`${import.meta.env.VITE_BACKEND_URL}api/users`)
      ]);
      setLogs(logRes.data);
      setMaterials(materialRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this log?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/inventory-logs/${id}`);
      fetchLogs();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLog) return;
    try {
      const { _id, material_id, user_id, ...updateData } = editLog;
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/inventory-logs/${_id}`, {
        ...updateData,
        material_id: material_id._id,
        user_id: user_id._id
      });
      setEditLog(null);
      fetchLogs();
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  if (loading) return <div className="p-6">Loading inventory logs...</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Logs</h2>
        <button
          onClick={() => navigate("/dashboard/inventory/add")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Inventory-Log
        </button>
      </div>

      {editLog && (
        <form onSubmit={handleEditSubmit} className="bg-gray-100 p-4 mb-6 rounded">
          <h3 className="text-lg font-semibold mb-3">Edit Inventory Log</h3>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={editLog.material_id._id}
              onChange={(e) =>
                setEditLog({
                  ...editLog,
                  material_id: materials.find((m) => m._id === e.target.value) || editLog.material_id
                })
              }
              className="border px-2 py-1 rounded"
            >
              {materials.map((mat) => (
                <option key={mat._id} value={mat._id}>
                  {mat.material_name}
                </option>
              ))}
            </select>

            <select
              value={editLog.change_type}
              onChange={(e) => setEditLog({ ...editLog, change_type: e.target.value as any })}
              className="border px-2 py-1 rounded"
            >
              <option value="add">Add</option>
              <option value="remove">Remove</option>
              <option value="adjust">Adjust</option>
              <option value="transfer">Transfer</option>
            </select>

            <input
              type="number"
              value={editLog.quantity_changed}
              onChange={(e) =>
                setEditLog({ ...editLog, quantity_changed: parseInt(e.target.value) })
              }
              placeholder="Quantity"
              className="border px-2 py-1 rounded"
            />

            <input
              type="text"
              value={editLog.reason}
              onChange={(e) => setEditLog({ ...editLog, reason: e.target.value })}
              placeholder="Reason"
              className="border px-2 py-1 rounded"
            />

            <input
              type="date"
              value={editLog.date.slice(0, 10)}
              onChange={(e) => setEditLog({ ...editLog, date: e.target.value })}
              className="border px-2 py-1 rounded"
            />

            <select
              value={editLog.user_id._id}
              onChange={(e) =>
                setEditLog({
                  ...editLog,
                  user_id: users.find((u) => u._id === e.target.value) || editLog.user_id
                })
              }
              className="border px-2 py-1 rounded"
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex gap-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditLog(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-sm border text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 border">Material</th>
              <th className="px-4 py-2 border">Change Type</th>
              <th className="px-4 py-2 border">Quantity Changed</th>
              <th className="px-4 py-2 border">Reason</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 border">{log.material_id?.material_name || "N/A"}</td>
                <td className="px-4 py-2 border capitalize">{log.change_type}</td>
                <td className="px-4 py-2 border">{log.quantity_changed}</td>
                <td className="px-4 py-2 border">{log.reason}</td>
                <td className="px-4 py-2 border">{new Date(log.date).toLocaleString()}</td>
                <td className="px-4 py-2 border">{log.user_id?.name || "N/A"}</td>
                <td className="px-4 py-2 text-center flex gap-2">
                  <button
                    onClick={() => setEditLog(log)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(log._id)}
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
          onClick={() => navigate("/dashboard/inventory/material")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Materials
        </button>
      </div>
    </div>
  );
};

export default InventoryLogs;

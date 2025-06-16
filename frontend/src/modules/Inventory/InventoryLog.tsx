import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";

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

  const fetchLogs = async () => {
    try {
      const [logRes, materialRes, userRes] = await Promise.all([
        axios.get<InventoryLog[]>(`${import.meta.env.VITE_BACKEND_URL}api/inventory-logs`),
        axios.get<Material[]>(`${import.meta.env.VITE_BACKEND_URL}api/materials`),
        axios.get<User[]>(`${import.meta.env.VITE_BACKEND_URL}api/users`),
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
        user_id: user_id._id,
      });
      setEditLog(null);
      fetchLogs();
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  const getStatusBadge = (change_type: string) => {
    const typeClasses = {
      add: "bg-green-100 text-green-800 border-green-200",
      remove: "bg-red-100 text-red-800 border-red-200",
      adjust: "bg-yellow-100 text-yellow-800 border-yellow-200",
      transfer: "bg-purple-100 text-purple-800 border-purple-200",
    };

    return (
      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium border ${typeClasses[change_type as keyof typeof typeClasses]}`}>
        {change_type.charAt(0).toUpperCase() + change_type.slice(1)}
      </span>
    );
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
              <h1 className="text-3xl font-bold text-gray-900">Inventory Logs</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Add</p>
                <p className="text-2xl font-bold text-gray-900">{logs.filter(log => log.change_type === 'add').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Remove</p>
                <p className="text-2xl font-bold text-gray-900">{logs.filter(log => log.change_type === 'remove').length}</p>
              </div>
            </div>
          </div>
        </div>

        {editLog && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Inventory Log</h3>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                  <select
                    value={editLog.material_id._id}
                    onChange={(e) =>
                      setEditLog({
                        ...editLog,
                        material_id: materials.find((m) => m._id === e.target.value) || editLog.material_id,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="">Select Material</option>
                    {materials.map((mat) => (
                      <option key={mat._id} value={mat._id}>
                        {mat.material_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Change Type</label>
                  <select
                    value={editLog.change_type}
                    onChange={(e) => setEditLog({ ...editLog, change_type: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="add">Add</option>
                    <option value="remove">Remove</option>
                    <option value="adjust">Adjust</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Changed</label>
                  <input
                    type="number"
                    value={editLog.quantity_changed}
                    onChange={(e) => setEditLog({ ...editLog, quantity_changed: parseInt(e.target.value) })}
                    placeholder="Enter quantity"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                  <input
                    type="text"
                    value={editLog.reason}
                    onChange={(e) => setEditLog({ ...editLog, reason: e.target.value })}
                    placeholder="Enter reason"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={editLog.date.slice(0, 10)}
                    onChange={(e) => setEditLog({ ...editLog, date: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                  <select
                    value={editLog.user_id._id}
                    onChange={(e) =>
                      setEditLog({
                        ...editLog,
                        user_id: users.find((u) => u._id === e.target.value) || editLog.user_id,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditLog(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Inventory Logs List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[110px]">Material</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change Type</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Changed</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[150px]">Reason</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[110px]">User</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory logs found</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 py-2 max-w-[110px] whitespace-normal break-words">
                        <div className="text-sm text-gray-900 truncate">{log.material_id?.material_name || "N/A"}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{getStatusBadge(log.change_type)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.quantity_changed}</div>
                      </td>
                      <td className="px-3 py-2 max-w-[150px] whitespace-normal break-words">
                        <div className="text-sm text-gray-900 truncate">{log.reason}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(log.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-3 py-2 max-w-[110px] whitespace-normal break-words">
                        <div className="text-sm text-gray-900 truncate">{log.user_id?.name || "N/A"}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditLog(log)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(log._id)}
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

export default InventoryLogs;
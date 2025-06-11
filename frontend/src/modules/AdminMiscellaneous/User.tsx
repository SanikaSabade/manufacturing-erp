import React, { useEffect, useState } from "react";
import axios from '../../utils/axios';
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "operator";
  last_login?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  useEffect(() => {
    axios
      .get<User[]>(`${import.meta.env.VITE_BACKEND_URL}api/users`) 
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading users...</div>;

  return (
    <div className="p-6">
                  <div className="mb-4 flex justify-between items-center">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <button
          onClick={() => navigate("/dashboard/admin/activity-log")} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Activity-Log
        </button>
        </div>
      <div className="overflow-x-auto shadow rounded border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Last Login</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Updated At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className={`px-4 py-2 font-semibold ${user.status === "active" ? "text-green-600" : "text-red-600"}`}>
                  {user.status}
                </td>
                <td className="px-4 py-2">
                  {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
                </td>
                <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(user.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center p-5">
        <button
          onClick={() => navigate("/dashboard/admin/settings")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Settings
        </button>
      </div>
    </div>
  );
};

export default Users;

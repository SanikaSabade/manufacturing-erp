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
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get<User[]>(`${import.meta.env.VITE_BACKEND_URL}api/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users:", err))
      .finally(() => setLoading(false));
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const handleEditChange = (field: keyof User, value: string) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, [field]: value });
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/users/${editingUser?._id}`, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading users...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Users</h2>

      <div className="p-5 gap-2 flex justify-end items-center">
        <button
          onClick={() => navigate("/dashboard/user/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add User
        </button>
        <button
          onClick={() => navigate("/dashboard/admin/activity-log")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Activity-Log
        </button>
      </div>

      {editingUser && (
        <div className="mb-6 bg-gray-100 border border-gray-300 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Edit User</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              value={editingUser.name || ""}
              onChange={(e) => handleEditChange("name", e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="Name"
            />
            <input
              value={editingUser.email || ""}
              onChange={(e) => handleEditChange("email", e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="Email"
            />
            <select
              value={editingUser.role || ""}
              onChange={(e) => handleEditChange("role", e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="operator">Operator</option>
            </select>
            <select
              value={editingUser.status || "active"}
              onChange={(e) => handleEditChange("status", e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleEditSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditingUser(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto shadow rounded border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Last Login</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Updated At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{user.name}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border capitalize">{user.role}</td>
                <td className={`px-4 py-2 border-r-1 border-b-1 border-black font-semibold ${user.status === "active" ? "text-green-600" : "text-red-600"}`}>
                  {user.status}
                </td>
                <td className="px-4 py-2 border">
                  {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
                </td>
                <td className="px-4 py-2 border">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">{new Date(user.updatedAt).toLocaleDateString()}</td>
                <td className="flex gap-2 px-4 py-2 border-r-1 ">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
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

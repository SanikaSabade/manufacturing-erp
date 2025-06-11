import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  salary: number;
  joinDate: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState<Partial<Employee> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    axios
      .get<Employee[]>(`${import.meta.env.VITE_BACKEND_URL}api/employees`)
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err))
      .finally(() => setLoading(false));
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee({
      ...emp,
      joinDate: emp.joinDate.split("T")[0],
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const handleEditChange = (field: keyof Employee, value: string | number) => {
    if (editingEmployee) {
      setEditingEmployee({ ...editingEmployee, [field]: value });
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/employees/${editingEmployee?._id}`,
        editingEmployee
      );
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading employees...</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employees</h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/dashboard/employee/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Employee
          </button>
          
        </div>
      </div>

      {editingEmployee && (
        <div className="mb-6 bg-gray-100 border border-gray-300 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Edit Employee</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              value={editingEmployee.name || ""}
              onChange={(e) => handleEditChange("name", e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="Name"
            />
            <input
              value={editingEmployee.email || ""}
              onChange={(e) => handleEditChange("email", e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="Email"
            />
            <input
              value={editingEmployee.phone || ""}
              onChange={(e) => handleEditChange("phone", e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="Phone"
            />
            <input
              value={editingEmployee.role || ""}
              onChange={(e) => handleEditChange("role", e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="Role"
            />
            <input
              type="number"
              value={editingEmployee.salary || ""}
              onChange={(e) => handleEditChange("salary", parseFloat(e.target.value))}
              className="border rounded px-3 py-2"
              placeholder="Salary"
            />
            <input
              type="date"
              value={editingEmployee.joinDate || ""}
              onChange={(e) => handleEditChange("joinDate", e.target.value)}
              className="border rounded px-3 py-2"
            />
            <select
              value={editingEmployee.status || "Active"}
              onChange={(e) => handleEditChange("status", e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
              onClick={() => setEditingEmployee(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

<div className="shadow rounded border border-gray-200  overflow-y-auto">
  <table className="min-w-full text-sm text-left">
    <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
      <tr>
        <th className="px-4 py-2 border">Name</th>
        <th className="px-4 py-2 border">Email</th>
        <th className="px-4 py-2 border">Phone</th>
        <th className="px-4 py-2 border">Role</th>
        <th className="px-4 py-2 border">Salary (₹)</th>
        <th className="px-4 py-2 border">Join Date</th>
        <th className="px-4 py-2 border">Status</th>
        <th className="px-4 py-2 border">Actions</th>
        <th className="px-4 py-2 border">Created At</th>

      </tr>
    </thead>
    <tbody>
      {employees.map((emp) => (
        <tr key={emp._id} className="border-b hover:bg-gray-50">
          <td className="px-4 py-2 border">{emp.name}</td>
          <td className="px-4 py-2 border">{emp.email}</td>
          <td className="px-4 py-2 border">{emp.phone}</td>
          <td className="px-4 py-2 border">{emp.role}</td>
          <td className="px-4 py-2 border">₹{emp.salary.toFixed(2)}</td>
          <td className="px-4 py-2 border">{new Date(emp.joinDate).toLocaleDateString()}</td>
          <td className={`px-4 py-2 border-r-1 border-black font-medium ${emp.status === "Active" ? "text-green-600" : "text-red-500"}`}>
            {emp.status}
          </td>
          <td className="flex gap-2 px-4 py-2  ">
            <button
              onClick={() => handleEdit(emp)}
              className="bg-yellow-500  text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(emp._id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </td>
          <td className="px-4 py-2 border">{new Date(emp.createdAt).toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      <div className="flex justify-center mt-6">
      <button
            onClick={() => navigate("/dashboard/hr/attendance")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Attendance
          </button>
          </div>
    </div>
  );
};

export default Employees;

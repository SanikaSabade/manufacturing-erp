import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";

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

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Active: "bg-green-100 text-green-800 border-green-200",
      Inactive: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
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
              <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(emp => emp.status === 'Active').length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(emp => emp.status === 'Inactive').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {editingEmployee && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Employee</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    value={editingEmployee.name || ""}
                    onChange={(e) => handleEditChange("name", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    value={editingEmployee.email || ""}
                    onChange={(e) => handleEditChange("email", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    value={editingEmployee.phone || ""}
                    onChange={(e) => handleEditChange("phone", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <input
                    value={editingEmployee.role || ""}
                    onChange={(e) => handleEditChange("role", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter role"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary (₹)</label>
                  <input
                    type="number"
                    value={editingEmployee.salary || ""}
                    onChange={(e) => handleEditChange("salary", parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter salary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                  <input
                    type="date"
                    value={editingEmployee.joinDate || ""}
                    onChange={(e) => handleEditChange("joinDate", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editingEmployee.status || "Active"}
                    onChange={(e) => handleEditChange("status", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleEditSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingEmployee(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Employee List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[110px]">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[140px]">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[90px]">Role</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary (₹)</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-3 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 py-2 max-w-[110px] whitespace-normal break-words">
                        <div className="text-sm font-medium text-gray-900 truncate">{emp.name}</div>
                      </td>
                      <td className="px-3 py-2 ">
                        <div className="text-sm text-gray-900 truncate">{emp.email}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{emp.phone}</div>
                      </td>
                      <td className="px-3 py-2 ">
                        <div className="text-sm text-gray-900 truncate">{emp.role}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹{emp.salary.toFixed(2)}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(emp.joinDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{getStatusBadge(emp.status)}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(emp)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(emp._id)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(emp.createdAt).toLocaleDateString()}</div>
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

export default Employees;
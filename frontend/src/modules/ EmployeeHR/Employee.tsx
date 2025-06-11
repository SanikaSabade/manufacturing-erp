import React, { useEffect, useState } from "react";
import axios from '../../utils/axios';
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
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Employee[]>(`${import.meta.env.VITE_BACKEND_URL}api/employees`) 
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Loading employees...</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
      <h2 className="text-2xl font-bold mb-4">Employees</h2>
      <button
          onClick={() => navigate("/dashboard/hr/attendance")} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Attendance
        </button>
        </div>
      <div className="overflow-x-auto shadow rounded">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Salary (₹)</th>
              <th className="px-4 py-2">Join Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{emp.name}</td>
                <td className="px-4 py-2">{emp.email}</td>
                <td className="px-4 py-2">{emp.phone}</td>
                <td className="px-4 py-2">{emp.role}</td>
                <td className="px-4 py-2">₹{emp.salary.toFixed(2)}</td>
                <td className="px-4 py-2">{new Date(emp.joinDate).toLocaleDateString()}</td>
                <td className={`px-4 py-2 font-medium ${emp.status === "Active" ? "text-green-600" : "text-red-500"}`}>
                  {emp.status}
                </td>
                <td className="px-4 py-2">{new Date(emp.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;

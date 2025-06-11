import React, { useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    salary: "",
    joinDate: "",
    status: "Active",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/employees`, {
        ...formData,
        salary: parseFloat(formData.salary),
      });
      navigate("/dashboard/hr");
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Employee</h2>
      <div className="grid grid-cols-2 gap-4">
        <input name="name" placeholder="Name" className="border rounded px-3 py-2" value={formData.name} onChange={handleChange} />
        <input name="email" placeholder="Email" className="border rounded px-3 py-2" value={formData.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" className="border rounded px-3 py-2" value={formData.phone} onChange={handleChange} />
        <input name="role" placeholder="Role" className="border rounded px-3 py-2" value={formData.role} onChange={handleChange} />
        <input name="salary" placeholder="Salary" type="number" className="border rounded px-3 py-2" value={formData.salary} onChange={handleChange} />
        <input name="joinDate" type="date" className="border rounded px-3 py-2" value={formData.joinDate} onChange={handleChange} />
        <select name="status" className="border rounded px-3 py-2" value={formData.status} onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div className="p-4 flex gap-2 justify-center">
        <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Submit
        </button>
        <button onClick={() => navigate("/dashboard/hr")} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EmployeeForm;

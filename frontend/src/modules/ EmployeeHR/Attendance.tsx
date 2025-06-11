import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

interface Employee {
  _id: string;
  name: string;
  email?: string;
}

interface Attendance {
  _id?: string;
  employee: Employee;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: "Present" | "Absent" | "Leave";
  createdAt?: string;
}

const Attendance: React.FC = () => {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState<Partial<Attendance>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    Promise.all([
      axios.get<Attendance[]>(`${import.meta.env.VITE_BACKEND_URL}api/attendance`),
      axios.get<Employee[]>(`${import.meta.env.VITE_BACKEND_URL}api/employees`)
    ])
      .then(([attRes, empRes]) => {
        setRecords(attRes.data);
        setEmployees(empRes.data);
      })
      .catch((err) => console.error("Error loading data:", err))
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({});
    setEditingId(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        employee: (form.employee as Employee)?._id,
      };

      if (editingId) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/attendance/${editingId}`, payload);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/attendance`, payload);
      }

      fetchAllData();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleEdit = (record: Attendance) => {
    setForm({
      ...record,
      date: record.date.split("T")[0],
      checkIn: record.checkIn?.slice(11, 16),
      checkOut: record.checkOut?.slice(11, 16),
    });
    setEditingId(record._id!);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/attendance/${id}`);
      fetchAllData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
     <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Attendance</h2>
        <button
          onClick={() => navigate("/dashboard/attendance/add")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Attendance
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-gray-100 p-4 rounded shadow grid grid-cols-2 gap-4"
        >
          <select
            name="employee"
            value={(form.employee as Employee)?._id || ""}
            onChange={(e) =>
              setForm({
                ...form,
                employee: employees.find((emp) => emp._id === e.target.value),
              })
            }
            required
            className="p-2 border rounded"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={form.date || ""}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />

          <input
            type="time"
            name="checkIn"
            value={form.checkIn || ""}
            onChange={handleInputChange}
            className="p-2 border rounded"
            placeholder="Check-In"
          />

          <input
            type="time"
            name="checkOut"
            value={form.checkOut || ""}
            onChange={handleInputChange}
            className="p-2 border rounded"
            placeholder="Check-Out"
          />

          <select
            name="status"
            value={form.status || ""}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>

          <div className="col-span-2 flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingId ? "Update Record" : "Add Record"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Employee</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Check-In</th>
              <th className="px-4 py-2 border">Check-Out</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Created</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-2 border">{record.employee?.name || "Unknown"}</td>
                <td className="px-4 py-2 border">{new Date(record.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">
                  {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "—"}
                </td>
                <td className="px-4 py-2 border">
                  {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "—"}
                </td>
                <td className="px-4 py-2 border capitalize">
                  <span
                    className={`font-medium ${
                      record.status === "Present"
                        ? "text-green-600"
                        : record.status === "Absent"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  {record.createdAt ? new Date(record.createdAt).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record._id!)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;




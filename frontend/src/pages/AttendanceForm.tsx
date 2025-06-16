import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

interface Employee {
  _id: string;
  name: string;
}

const AttendanceForm: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({
    employee: "",
    date: "",
    checkIn: "",
    checkOut: "",
    status: "Present",
  });
  const { employee, date, checkIn, checkOut, status } = form;

  const convertToISO = (time: string) => {
    return time ? new Date(`${date}T${time}:00.000Z`) : null;
  };

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/employees")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Failed to load employees:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/attendance", {
        employee,
        date,
        checkIn: convertToISO(checkIn),
        checkOut: convertToISO(checkOut),
        status,
      });
      navigate("/dashboard/hr/attendance");
    } catch (err) {
      console.error("Error submitting attendance:", err);
      alert("Failed to submit attendance.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Attendance</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 bg-gray-50 p-6 rounded shadow"  >
        <div>
          <label className="block mb-1 font-medium">Employee</label>
          <select
            value={form.employee}
            onChange={(e) => setForm({ ...form, employee: e.target.value })}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {[
          { name: "date", type: "date" },
          { name: "checkIn", type: "time" },
          { name: "checkOut", type: "time" },
        ].map(({ name, type }) => (
          <div key={name}>
            <label className="block mb-1 font-medium capitalize">{name}</label>
            <input
              type={type}
              className="w-full border px-3 py-2 rounded"
              value={(form as any)[name]}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              required={name === "date"}
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>
        </div>
        <div className="flex gap-2 justify-center">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Submit Attendance
        </button>
        <button
  type="button"
  onClick={() => navigate("/dashboard/hr/attendance")}
  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
>
  Cancel
</button>
</div>
      </form>
    </div>
  );
};

export default AttendanceForm;

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Employee {
  _id: string;
  name: string;
}

interface Attendance {
  _id: string;
  employee: Employee;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: "Present" | "Absent" | "Leave";
  createdAt: string;
  updatedAt: string;
}

const Attendance: React.FC = () => {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Attendance[]>(`${import.meta.env.VITE_BACKEND_URL}api/attendance`) 
      .then((res) => setRecords(res.data))
      .catch((err) => console.error("Error fetching attendance records:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading attendance records...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Employee Attendance</h2>
      <div className="overflow-x-auto shadow rounded">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Employee</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Check-In</th>
              <th className="px-4 py-2">Check-Out</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Recorded At</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{record.employee?.name || "Unknown"}</td>
                <td className="px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "—"}
                </td>
                <td className="px-4 py-2">
                  {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "—"}
                </td>
                <td
                  className={`px-4 py-2 font-medium ${
                    record.status === "Present"
                      ? "text-green-600"
                      : record.status === "Absent"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {record.status}
                </td>
                <td className="px-4 py-2">{new Date(record.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;

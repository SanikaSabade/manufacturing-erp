import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
}

interface ActivityLog {
  _id: string;
  user_id: User | null; 
  activity: string;
  timestamp: string;
  ip_address: string;
}

const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<ActivityLog[]>("http://localhost:8000/api/activity-logs")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Failed to fetch activity logs:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading activity logs...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Activity Logs</h2>
      <div className="overflow-x-auto shadow rounded border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Activity</th>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{log.user_id?.name || "Unknown User"}</td>
                <td className="px-4 py-2">{log.activity}</td>
                <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2">{log.ip_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogs;

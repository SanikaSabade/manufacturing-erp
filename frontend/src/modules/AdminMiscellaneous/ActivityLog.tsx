import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";

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
      .get<ActivityLog[]>(`${import.meta.env.VITE_BACKEND_URL}api/activity-logs`)
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Failed to fetch activity logs:", err))
      .finally(() => setLoading(false));
  }, []);

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
              <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
              <p className="text-gray-600 mt-1">View system activity logs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Activity Logs List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[120px]">User</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[300px]">Activity</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[120px]">IP Address</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No activity logs found</h3>
                        <p className="text-gray-500">No activity records available at the moment.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 py-2 max-w-[120px] whitespace-normal break-words">
                        <div className="text-sm text-gray-900 truncate">{log.user_id?.name || "Unknown User"}</div>
                      </td>
                      <td className="px-3 py-2 max-w-[300px] whitespace-normal break-words">
                        <div className="text-sm text-gray-900 truncate">{log.activity}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-3 py-2 max-w-[120px] whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.ip_address}</div>
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

export default ActivityLogs;
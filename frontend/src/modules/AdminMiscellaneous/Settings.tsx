import React, { useEffect, useState } from "react";
import axios from "axios";

interface Settings {
  _id: string;
  currency: string;
  taxPercentage: number;
  fiscalYearStart: string;
  fiscalYearEnd: string;
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Settings>("http://localhost:8000/api/settings") 
      .then((res) => setSettings(res.data))
      .catch((err) => console.error("Failed to fetch settings:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading settings...</div>;

  if (!settings) return <div className="p-6 text-red-600">No settings found.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">System Settings</h2>
      <div className="overflow-x-auto shadow rounded">
        <table className="min-w-full border border-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Currency</th>
              <th className="px-4 py-2">Tax (%)</th>
              <th className="px-4 py-2">Fiscal Year Start</th>
              <th className="px-4 py-2">Fiscal Year End</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{settings.currency}</td>
              <td className="px-4 py-2">{settings.taxPercentage}</td>
              <td className="px-4 py-2">
                {new Date(settings.fiscalYearStart).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                {new Date(settings.fiscalYearEnd).toLocaleDateString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingsPage;
